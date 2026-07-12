/**
 * ─── Google Business Profile Sync Service ───────────────────────────────────
 *
 * Responsible for ALL Google Business Profile API interactions:
 *   1. Exchanging a refresh token for a fresh access token
 *   2. Converting MongoDB workingHours → GBP regularHours format
 *   3. Creating or updating a location in GBP
 *
 * API Reference:
 *   My Business Business Information API v1
 *   https://developers.google.com/my-business/reference/businessinformation/rest
 *
 * This service exports a single `sync(location, userTokens)` function
 * that the worker calls via the platform registry.
 */

const axios = require('axios');

// ─── Google OAuth Endpoints ─────────────────────────────────────────────────
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GBP_API_BASE = 'https://mybusinessbusinessinformation.googleapis.com/v1';

// ─── OAuth credentials from env ─────────────────────────────────────────────
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// ─── Day mapping ────────────────────────────────────────────────────────────
// MongoDB stores keys like 'MONDAY', GBP API uses the same enum values.
const GBP_DAY_MAP = {
  MONDAY: 'MONDAY',
  TUESDAY: 'TUESDAY',
  WEDNESDAY: 'WEDNESDAY',
  THURSDAY: 'THURSDAY',
  FRIDAY: 'FRIDAY',
  SATURDAY: 'SATURDAY',
  SUNDAY: 'SUNDAY',
};

/**
 * Exchange a Google OAuth refresh token for a short-lived access token.
 *
 * @param {string} refreshToken - The user's stored refresh token
 * @returns {Promise<string>} Fresh access token (valid ~1 hour)
 * @throws {Error} If the token exchange fails
 */
async function getAccessToken(refreshToken) {
  try {
    const { data } = await axios.post(GOOGLE_TOKEN_URL, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    console.log('[GBP] ✅ Access token refreshed successfully');
    return data.access_token;
  } catch (err) {
    const msg = err.response?.data?.error_description || err.message;
    console.error('[GBP] ❌ Token refresh failed:', msg);
    throw new Error(`Google OAuth token refresh failed: ${msg}`);
  }
}

/**
 * Convert MongoDB WeeklyHours object → GBP regularHours.periods[] format.
 *
 * Input (MongoDB):
 * {
 *   MONDAY:  { isOpen: true, openTime: { hours: 9, minutes: 0 }, closeTime: { hours: 17, minutes: 0 } },
 *   SATURDAY: { isOpen: false, ... }
 * }
 *
 * Output (GBP API):
 * {
 *   periods: [
 *     { openDay: 'MONDAY', closeDay: 'MONDAY',
 *       openTime: { hours: 9, minutes: 0 }, closeTime: { hours: 17, minutes: 0 } }
 *   ]
 * }
 *
 * @param {Object} workingHours - The WeeklyHours map from MongoDB
 * @returns {{ periods: Array }} GBP-formatted regularHours object
 */
function toGBPRegularHours(workingHours) {
  if (!workingHours || typeof workingHours !== 'object') {
    return { periods: [] };
  }

  const periods = [];

  for (const [dayKey, schedule] of Object.entries(workingHours)) {
    // Skip closed days and invalid entries
    if (!schedule || !schedule.isOpen) continue;
    if (!GBP_DAY_MAP[dayKey]) continue;

    periods.push({
      openDay: GBP_DAY_MAP[dayKey],
      closeDay: GBP_DAY_MAP[dayKey], // Same day (no overnight support yet)
      openTime: {
        hours: schedule.openTime?.hours ?? 0,
        minutes: schedule.openTime?.minutes ?? 0,
      },
      closeTime: {
        hours: schedule.closeTime?.hours ?? 0,
        minutes: schedule.closeTime?.minutes ?? 0,
      },
    });
  }

  return { periods };
}

/**
 * Build the GBP location payload from a MongoDB Location document.
 *
 * Maps our internal schema fields to the Google Business Profile
 * Business Information API v1 `Location` resource shape.
 *
 * @param {Object} location - MongoDB Location document (lean)
 * @returns {Object} GBP-compatible location payload
 */
function buildGBPPayload(location) {
  const payload = {
    // Business name (displayed on Google Maps)
    title: location.name,

    // Primary phone number
    phoneNumbers: location.contact
      ? { primaryPhone: location.contact }
      : undefined,

    // Website URL
    websiteUri: location.website || undefined,

    // Business category (GBP expects gcid format, e.g. 'gcid:restaurant')
    // If the stored category is already in gcid format, use as-is.
    // Otherwise, wrap it.
    ...(location.category && {
      categories: {
        primaryCategory: {
          displayName: location.category,
        },
      },
    }),

    // Storefront address
    storefrontAddress: {
      // GBP uses addressLines[] — we put the full address as a single line.
      // For more accurate geocoding, split into structured fields later.
      addressLines: [location.address],
      // If we have lat/lng, include them
      ...(location.latitude && location.longitude && {
        latlng: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }),
    },

    // Working hours
    regularHours: toGBPRegularHours(location.workingHours),
  };

  // Remove undefined fields so they're not sent as null
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });

  return payload;
}

/**
 * Sync a location to Google Business Profile.
 *
 * This is the main entry point called by the worker via the platform registry.
 *
 * @param {Object} location  - Full MongoDB Location document
 * @param {Object} userTokens - The user's Google OAuth tokens from User model
 *   { refreshToken, accessToken, accessTokenExpiresAt, accountId }
 * @returns {Promise<{ externalId?: string }>} The GBP location resource name
 * @throws {Error} If sync fails at any step
 */
async function sync(location, userTokens) {
  if (!userTokens?.refreshToken) {
    throw new Error('No Google refresh token found for this user. Please connect your Google account.');
  }

  if (!userTokens?.accountId) {
    throw new Error('No GBP account ID found. Please link your Google Business Profile account.');
  }

  // 1. Get a fresh access token
  const accessToken = await getAccessToken(userTokens.refreshToken);

  // 2. Build the GBP payload from our location data
  const gbpPayload = buildGBPPayload(location);

  // 3. Determine if this is a CREATE or UPDATE
  //    Check if we already have a GBP location ID from a previous sync.
  const existingSyncEntry = location.syncStatus?.find((s) => s.platform === 'google');
  const existingExternalId = existingSyncEntry?.externalId;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  let gbpLocationName;

  if (existingExternalId) {
    // ── UPDATE existing GBP location ──────────────────────────────────────
    const updateUrl = `${GBP_API_BASE}/${existingExternalId}`;

    // updateMask tells GBP which fields to patch
    const updateMask = [
      'title',
      'phoneNumbers',
      'websiteUri',
      'regularHours',
      'storefrontAddress',
      'categories',
    ].join(',');

    console.log(`[GBP] Updating existing location: ${existingExternalId}`);

    const { data } = await axios.patch(
      `${updateUrl}?updateMask=${updateMask}`,
      gbpPayload,
      { headers }
    );

    gbpLocationName = data.name;
    console.log(`[GBP] ✅ Location updated: ${gbpLocationName}`);
  } else {
    // ── CREATE new GBP location ───────────────────────────────────────────
    const createUrl = `${GBP_API_BASE}/${userTokens.accountId}/locations`;

    console.log(`[GBP] Creating new location under: ${userTokens.accountId}`);

    const { data } = await axios.post(createUrl, gbpPayload, { headers });

    gbpLocationName = data.name;
    console.log(`[GBP] ✅ Location created: ${gbpLocationName}`);
  }

  // Return the GBP location resource name so the worker stores it
  return { externalId: gbpLocationName };
}

module.exports = { sync, getAccessToken, toGBPRegularHours, buildGBPPayload };

/**
 * ─── User Model ─────────────────────────────────────────────────────────────
 *
 * Stores per-user OAuth credentials for each external platform.
 * Keyed by `firebaseUid` (the Firebase Auth UID) so we can look up
 * tokens by the same identifier the rest of the app uses.
 *
 * Design:
 *   `oauthTokens` is a plain object (not a Map) so it serializes cleanly
 *   to JSON. Each key is a platform name ('google', 'facebook', etc.)
 *   and each value contains the credentials needed for that platform's API.
 *
 * Security note:
 *   Refresh tokens grant long-lived access. In production, encrypt them
 *   at rest (e.g. mongoose-encryption or field-level AES). For now, they
 *   are stored in plaintext — acceptable for development.
 */

const mongoose = require('mongoose');

// ── Per-platform token schema ───────────────────────────────────────────────
const oauthTokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: '',
    },
    accessTokenExpiresAt: {
      type: Date,
      default: null,
    },
    // Platform-specific identifiers
    // Google: the GBP account resource name, e.g. 'accounts/123456789'
    accountId: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

// ── Main User schema ────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    /**
     * OAuth tokens keyed by platform.
     * Example:
     * {
     *   google: { refreshToken: '1//04...', accessToken: 'ya29...', accountId: 'accounts/123' },
     *   facebook: { refreshToken: 'EAAG...', ... },
     * }
     */
    oauthTokens: {
      type: Map,
      of: oauthTokenSchema,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

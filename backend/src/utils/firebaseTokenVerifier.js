const crypto = require('crypto');

const PUBLIC_KEYS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let cachedKeys = null;
let keysExpiryTime = 0;

/**
 * Parses the Cache-Control header to determine key TTL
 * @param {string} cacheControlHeader 
 * @returns {number} maxAge in milliseconds
 */
function parseCacheControl(cacheControlHeader) {
  if (!cacheControlHeader) return 3600 * 1000; // default 1 hour
  const match = cacheControlHeader.match(/max-age=(\d+)/);
  if (match) {
    return parseInt(match[1], 10) * 1000;
  }
  return 3600 * 1000;
}

/**
 * Fetches Google's public certificates for Firebase ID tokens
 */
async function fetchPublicKeys() {
  const now = Date.now();
  if (cachedKeys && now < keysExpiryTime) {
    return cachedKeys;
  }

  console.log('[FirebaseVerifier] Fetching fresh public keys from Google...');
  const response = await fetch(PUBLIC_KEYS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch public keys from Google: ${response.statusText}`);
  }

  const keys = await response.json();
  const cacheControl = response.headers.get('cache-control');
  const ttl = parseCacheControl(cacheControl);

  cachedKeys = keys;
  keysExpiryTime = now + ttl;
  return cachedKeys;
}

/**
 * Base64url decoding helper
 */
function base64urlDecode(str) {
  // Add padding if needed
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Verifies a Firebase ID token (JWT)
 * @param {string} token - The raw JWT string
 * @param {string} projectId - The Firebase Project ID
 * @returns {Promise<object>} The decoded token payload (claims)
 */
async function verifyIdToken(token, projectId) {
  if (!token) {
    throw new Error('No token provided.');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format. JWT must have 3 parts.');
  }

  let header;
  let payload;
  try {
    header = JSON.parse(base64urlDecode(parts[0]));
    payload = JSON.parse(base64urlDecode(parts[1]));
  } catch (err) {
    throw new Error('Failed to parse token headers or payload.');
  }

  // 1. Verify headers
  if (header.alg !== 'RS256') {
    throw new Error(`Invalid signing algorithm. Expected RS256, got ${header.alg}`);
  }
  if (!header.kid) {
    throw new Error('Token header missing "kid" (Key ID).');
  }

  // 2. Verify basic payload claims
  const nowInSecs = Math.floor(Date.now() / 1000);
  if (payload.exp < nowInSecs) {
    throw new Error('Token has expired.');
  }
  if (payload.iat > nowInSecs + 300) { // Allow 5 mins clock skew
    throw new Error('Token issue time is in the future.');
  }
  if (payload.aud !== projectId) {
    throw new Error(`Invalid audience. Expected ${projectId}, got ${payload.aud}`);
  }
  const expectedIssuer = `https://securetoken.google.com/${projectId}`;
  if (payload.iss !== expectedIssuer) {
    throw new Error(`Invalid issuer. Expected ${expectedIssuer}, got ${payload.iss}`);
  }
  if (typeof payload.sub !== 'string' || payload.sub === '') {
    throw new Error('Token subject (sub) must be a non-empty string representing the user UID.');
  }

  // 3. Fetch public keys and find matching kid
  let publicKeys = await fetchPublicKeys();
  let x509Cert = publicKeys[header.kid];

  // If kid not found, public keys might have rotated. Refetch once.
  if (!x509Cert) {
    console.log(`[FirebaseVerifier] kid "${header.kid}" not found in cache. Refetching public keys...`);
    cachedKeys = null; // invalidate cache
    publicKeys = await fetchPublicKeys();
    x509Cert = publicKeys[header.kid];
  }

  if (!x509Cert) {
    throw new Error(`Invalid "kid". Certificate matching kid "${header.kid}" not found.`);
  }

  // 4. Verify signature
  const verifyData = `${parts[0]}.${parts[1]}`;
  const signature = Buffer.from(parts[2], 'base64');
  
  const isVerified = crypto.verify(
    'sha256',
    Buffer.from(verifyData),
    x509Cert,
    signature
  );

  if (!isVerified) {
    throw new Error('Signature verification failed.');
  }

  return payload;
}

module.exports = { verifyIdToken };

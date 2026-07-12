/**
 * ─── Platform Registry ──────────────────────────────────────────────────────
 *
 * The brain of the pluggable sync architecture.
 *
 * ADDING A NEW PLATFORM:
 *   1. Create a new service file in this directory (e.g. facebookService.js)
 *   2. The service must export: { sync(location, userTokens) → Promise<{externalId}> }
 *   3. Add one line to the `registry` object below.
 *   4. That's it. The worker, controller, queue — nothing else changes.
 *
 * The worker calls:
 *   const service = platformRegistry.get(platform);
 *   await service.sync(location, userTokens);
 *
 * If the platform isn't registered, the worker marks the job as failed
 * with a clear error message.
 */

const googleBusinessService = require('./googleBusinessService');

/**
 * Map of platform key → service module.
 * Each service MUST export a `sync(location, userTokens)` function.
 *
 * @type {Record<string, { sync: (location: Object, userTokens: Object) => Promise<{externalId?: string}> }>}
 */
const registry = {
  google: googleBusinessService,
  // ─── Future platforms (uncomment when ready) ───────────────────────────
  // facebook: require('./facebookService'),
  // bing:     require('./bingPlacesService'),
  // yelp:     require('./yelpService'),
  // appleMaps: require('./appleMapsService'),
};

/**
 * Get the sync service for a platform.
 *
 * @param {string} platform - 'google', 'facebook', etc.
 * @returns {{ sync: Function } | undefined}
 */
function get(platform) {
  return registry[platform];
}

/**
 * Returns all registered platform keys.
 * Useful for validation or UI enumeration.
 */
function registeredPlatforms() {
  return Object.keys(registry);
}

module.exports = { get, registeredPlatforms };

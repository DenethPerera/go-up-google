/**
 * ─── Sync Controller ────────────────────────────────────────────────────────
 *
 * HTTP endpoint for triggering platform syncs. This controller does ZERO
 * heavy work — it validates input, marks platforms as 'syncing' in the DB,
 * enqueues BullMQ jobs, and returns 202 Accepted instantly.
 *
 * The actual sync work happens in the Worker process.
 *
 * Flow:
 *   1. Frontend → POST /api/sync { locationId, platforms: ['google'] }
 *   2. Controller validates → marks syncStatus.state = 'syncing' in DB
 *   3. Enqueues one BullMQ job per platform
 *   4. Returns 202 Accepted with job IDs → frontend shows spinner
 *   5. Worker picks up job in background → calls platform service → updates DB
 *   6. Frontend pull-to-refresh → reads updated syncStatus → shows ✓ or ✗
 */

const Location = require('../locations/location.model');
const { addSyncJob } = require('../../queues/syncQueue');

// ── Allowed platform values ────────────────────────────────────────────────
const VALID_PLATFORMS = new Set(['google', 'facebook', 'bing', 'yelp', 'appleMaps']);

/**
 * POST /api/sync
 *
 * Body: { locationId: string, platforms: string[] }
 * Auth: Firebase JWT → req.uid
 *
 * Returns 202 Accepted with the created BullMQ job IDs.
 */
const triggerSync = async (req, res) => {
  const { locationId, platforms } = req.body;
  const firebaseUid = req.uid;

  // ── Validation ─────────────────────────────────────────────────────────
  if (!locationId) {
    return res.status(400).json({ success: false, message: 'locationId is required.' });
  }

  if (!Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ success: false, message: 'platforms must be a non-empty array.' });
  }

  const invalidPlatforms = platforms.filter((p) => !VALID_PLATFORMS.has(p));
  if (invalidPlatforms.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid platform(s): ${invalidPlatforms.join(', ')}. Valid: ${[...VALID_PLATFORMS].join(', ')}`,
    });
  }

  // ── Verify location exists and belongs to this user ────────────────────
  const location = await Location.findById(locationId);
  if (!location) {
    return res.status(404).json({ success: false, message: 'Location not found.' });
  }
  if (location.firebaseUid !== firebaseUid) {
    return res.status(403).json({ success: false, message: 'You do not own this location.' });
  }

  // ── Mark each platform as 'syncing' in DB immediately ─────────────────
  // This gives the frontend instant visual feedback on the next fetch.
  for (const platform of platforms) {
    const existing = location.syncStatus.find((s) => s.platform === platform);
    if (existing) {
      existing.state = 'syncing';
      existing.errorMessage = '';
    } else {
      // First time syncing this platform — create the entry
      location.syncStatus.push({ platform, state: 'syncing' });
    }
  }
  await location.save();

  // ── Enqueue one job per platform ───────────────────────────────────────
  // Each job is independent — if Google fails, Facebook still runs.
  const jobIds = [];
  for (const platform of platforms) {
    const job = await addSyncJob({ locationId, firebaseUid, platform });
    jobIds.push({ platform, jobId: job.id });
  }

  // ── 202 Accepted — zero latency ───────────────────────────────────────
  // The client knows the jobs are queued. Next pull-to-refresh will show
  // the updated syncStatus from the DB (set by the worker on completion).
  return res.status(202).json({
    success: true,
    message: `Sync jobs enqueued for: ${platforms.join(', ')}`,
    jobs: jobIds,
  });
};

module.exports = { triggerSync };

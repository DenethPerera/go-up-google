/**
 * ─── Platform Sync Queue (BullMQ) ───────────────────────────────────────────
 *
 * This module owns the BullMQ Queue instance and exposes a single function
 * `addSyncJob()` that the sync controller calls.
 *
 * Architecture note:
 *   The controller calls `addSyncJob()` once per platform. Each job carries
 *   a single { locationId, firebaseUid, platform } payload. The worker
 *   picks up each job independently, enabling per-platform retry/backoff
 *   without blocking unrelated syncs.
 *
 * Retry strategy (BullMQ built-in):
 *   - 3 attempts total
 *   - Exponential backoff: 2^attempt × 2000ms  →  2s, 4s, 8s
 *   - After 3 failures the job moves to the "failed" set
 */

const { Queue } = require('bullmq');
const { createConnection } = require('../config/redis');

// ─── Queue instance ─────────────────────────────────────────────────────────
// BullMQ queues are lazy — they don't connect until the first operation.
const syncQueue = new Queue('platform-sync', {
  connection: createConnection('queue'),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // base delay in ms → 2s, 4s, 8s
    },
    removeOnComplete: {
      count: 200,   // keep last 200 completed jobs for debugging
    },
    removeOnFail: {
      count: 500,   // keep last 500 failed jobs for investigation
    },
  },
});

/**
 * Enqueue a single platform sync job.
 *
 * @param {Object} payload
 * @param {string} payload.locationId  - MongoDB _id of the location to sync
 * @param {string} payload.firebaseUid - Firebase UID of the owning user
 * @param {string} payload.platform    - 'google' | 'facebook' | 'bing' | etc.
 * @returns {Promise<import('bullmq').Job>} The created BullMQ job
 *
 * Job naming convention:
 *   `sync:{platform}:{locationId}` — makes it easy to search in Redis
 *   or a BullMQ dashboard (e.g. Bull Board).
 */
async function addSyncJob({ locationId, firebaseUid, platform }) {
  const jobName = `sync:${platform}:${locationId}`;
  const job = await syncQueue.add(jobName, {
    locationId,
    firebaseUid,
    platform,
    enqueuedAt: new Date().toISOString(),
  });

  console.log(`[syncQueue] Job enqueued → ${jobName} (id: ${job.id})`);
  return job;
}

module.exports = { syncQueue, addSyncJob };

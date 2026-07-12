/**
 * ─── Platform Sync Worker ───────────────────────────────────────────────────
 *
 * STANDALONE process — run separately from the Express server:
 *   $ node src/workers/syncWorker.js
 *   $ npm run worker:dev   (with nodemon)
 *
 * This process:
 *   1. Connects to MongoDB (independent connection from Express)
 *   2. Connects to Redis (via BullMQ Worker)
 *   3. Picks up jobs from the 'platform-sync' queue
 *   4. Dynamically routes to the correct platform service via platformRegistry
 *   5. Updates the Location's syncStatus in MongoDB on success or failure
 *
 * BullMQ handles retries + exponential backoff automatically (configured
 * in syncQueue.js). If all retries are exhausted, the 'failed' event fires
 * and we persist the error state.
 *
 * Concurrency:
 *   Set to 3 — up to 3 sync jobs processed in parallel per worker instance.
 *   Scale horizontally by running multiple worker processes.
 */

require('dotenv').config();
const { Worker } = require('bullmq');
const mongoose = require('mongoose');

// ─── Models (must be imported AFTER mongoose is configured) ─────────────────
const Location = require('../features/locations/location.model');
const User = require('../models/user.model');

// ─── Infrastructure ────────────────────────────────────────────────────────
const { createConnection } = require('../config/redis');
const platformRegistry = require('../services/platforms/platformRegistry');

// ─── MongoDB connection (independent from Express) ──────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Worker] ✅ MongoDB connected');
  } catch (err) {
    console.error('[Worker] ❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

/**
 * Update a specific platform's syncStatus entry in the Location document.
 *
 * Uses a targeted MongoDB update with positional operator ($) to avoid
 * overwriting other platforms' status entries.
 *
 * @param {string} locationId - MongoDB _id
 * @param {string} platform   - Platform key (e.g. 'google')
 * @param {Object} update     - Fields to set on the syncStatus entry
 */
async function updateSyncStatus(locationId, platform, update) {
  await Location.updateOne(
    { _id: locationId, 'syncStatus.platform': platform },
    {
      $set: Object.fromEntries(
        Object.entries(update).map(([key, val]) => [`syncStatus.$.${key}`, val])
      ),
    }
  );
}

/**
 * The main job processor function.
 * BullMQ calls this for every job in the 'platform-sync' queue.
 *
 * @param {import('bullmq').Job} job
 */
async function processJob(job) {
  const { locationId, firebaseUid, platform } = job.data;
  const attemptLabel = `[attempt ${job.attemptsMade + 1}/${job.opts.attempts}]`;

  console.log(`\n[Worker] ▶ Processing: sync:${platform}:${locationId} ${attemptLabel}`);

  // 1. Look up the platform service from the registry
  const platformService = platformRegistry.get(platform);
  if (!platformService) {
    // This platform isn't implemented yet — fail permanently (no retry)
    const msg = `Platform '${platform}' is not registered. Available: ${platformRegistry.registeredPlatforms().join(', ')}`;
    console.error(`[Worker] ❌ ${msg}`);
    await updateSyncStatus(locationId, platform, {
      state: 'failed',
      errorMessage: msg,
    });
    throw new Error(msg); // Throwing tells BullMQ the job failed
  }

  // 2. Fetch the location from MongoDB
  const location = await Location.findById(locationId).lean();
  if (!location) {
    const msg = `Location ${locationId} not found in database`;
    console.error(`[Worker] ❌ ${msg}`);
    await updateSyncStatus(locationId, platform, {
      state: 'failed',
      errorMessage: msg,
    });
    throw new Error(msg);
  }

  // 3. Fetch the user's OAuth tokens for this platform
  const user = await User.findOne({ firebaseUid }).lean();
  if (!user) {
    const msg = `User ${firebaseUid} not found. Cannot retrieve OAuth tokens.`;
    console.error(`[Worker] ❌ ${msg}`);
    await updateSyncStatus(locationId, platform, {
      state: 'failed',
      errorMessage: 'User account not found. Please re-authenticate.',
    });
    throw new Error(msg);
  }

  // Get platform-specific tokens from the user's oauthTokens map
  const userTokens = user.oauthTokens?.get?.(platform) || user.oauthTokens?.[platform];
  if (!userTokens?.refreshToken) {
    const msg = `No ${platform} OAuth tokens found for user ${firebaseUid}. Please connect your ${platform} account.`;
    console.error(`[Worker] ❌ ${msg}`);
    await updateSyncStatus(locationId, platform, {
      state: 'failed',
      errorMessage: `Please connect your ${platform} account first.`,
    });
    throw new Error(msg);
  }

  // 4. Call the platform-specific sync service
  try {
    console.log(`[Worker] 🔄 Calling ${platform} sync service...`);
    const result = await platformService.sync(location, userTokens);

    // 5. On success — update syncStatus in DB
    const updatePayload = {
      state: 'success',
      lastSyncedAt: new Date(),
      errorMessage: '',
    };

    // Store the external platform ID if returned (e.g. GBP location resource name)
    if (result?.externalId) {
      updatePayload.externalId = result.externalId;
    }

    await updateSyncStatus(locationId, platform, updatePayload);

    console.log(`[Worker] ✅ ${platform} sync SUCCESS for location: ${location.name}`);
    return result; // BullMQ marks job as completed
  } catch (syncError) {
    // 6. On failure — update syncStatus but let BullMQ retry
    const errorMsg = syncError.response?.data?.error?.message || syncError.message || 'Unknown sync error';
    console.error(`[Worker] ❌ ${platform} sync FAILED ${attemptLabel}: ${errorMsg}`);

    await updateSyncStatus(locationId, platform, {
      state: 'failed',
      errorMessage: errorMsg,
    });

    // Re-throw so BullMQ retries with exponential backoff
    throw syncError;
  }
}

// ─── Start the worker ───────────────────────────────────────────────────────

async function start() {
  // Connect to MongoDB first
  await connectDB();

  // Create the BullMQ Worker
  const worker = new Worker('platform-sync', processJob, {
    connection: createConnection('worker'),
    concurrency: 3, // Process up to 3 jobs in parallel
  });

  // ── Event listeners ───────────────────────────────────────────────────────
  worker.on('ready', () => {
    console.log('[Worker] 🚀 Platform sync worker is READY and listening for jobs');
  });

  worker.on('completed', (job) => {
    console.log(`[Worker] ✓ Job completed: ${job.name} (id: ${job.id})`);
  });

  worker.on('failed', (job, err) => {
    if (job) {
      console.error(`[Worker] ✗ Job failed: ${job.name} (id: ${job.id}) — ${err.message}`);
      if (job.attemptsMade >= job.opts.attempts) {
        console.error(`[Worker] 💀 Job exhausted all retries: ${job.name}`);
      }
    }
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err.message);
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n[Worker] ${signal} received. Shutting down gracefully...`);
    await worker.close();
    await mongoose.connection.close();
    console.log('[Worker] 👋 Worker shut down cleanly');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// ── Entry point ─────────────────────────────────────────────────────────────
start().catch((err) => {
  console.error('[Worker] Fatal startup error:', err);
  process.exit(1);
});

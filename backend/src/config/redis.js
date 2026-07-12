/**
 * ─── Redis Connection (BullMQ) ──────────────────────────────────────────────
 *
 * BullMQ requires IORedis — NOT the generic `redis` npm package.
 * BullMQ internally needs TWO separate connections (one for the Queue,
 * one for the Worker), so we export a factory function `createConnection()`
 * rather than a singleton.
 *
 * Environment:
 *   REDIS_URL – Full connection string, e.g. redis://127.0.0.1:6379
 *               For Upstash / Redis Cloud, use the TLS URL they provide.
 *
 * Usage:
 *   const { createConnection } = require('./redis');
 *   const connection = createConnection();         // for Queue
 *   const workerConn = createConnection();         // for Worker (separate)
 */

const IORedis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

/**
 * Creates a new IORedis connection with sensible defaults.
 * Each call returns a FRESH connection — BullMQ requires Queue and Worker
 * to have separate TCP sockets.
 *
 * @param {string} [label='redis'] - Label used in console logs for debugging.
 * @returns {import('ioredis').Redis}
 */
function createConnection(label = 'redis') {
  const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,   // Required by BullMQ — disables per-command timeout
    enableReadyCheck: false,      // Faster startup, BullMQ handles readiness internally
    retryStrategy(times) {
      // Reconnect with exponential backoff, capped at 10 seconds
      const delay = Math.min(times * 200, 10000);
      console.log(`[${label}] Redis reconnecting in ${delay}ms (attempt ${times})`);
      return delay;
    },
  });

  connection.on('connect', () => {
    console.log(`[${label}] ✅ Redis connected → ${REDIS_URL}`);
  });

  connection.on('error', (err) => {
    console.error(`[${label}] ❌ Redis error:`, err.message);
  });

  return connection;
}

module.exports = { createConnection, REDIS_URL };

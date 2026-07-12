/**
 * ─── Sync Routes ────────────────────────────────────────────────────────────
 *
 * POST /api/sync — Trigger platform sync for a location.
 *                  Requires Firebase authentication.
 */

const express = require('express');
const { asyncHandler } = require('../../middleware/errorHandler');
const { firebaseAuth } = require('../../middleware/firebaseAuth');
const controller = require('./sync.controller');

const router = express.Router();

router.post('/', firebaseAuth, asyncHandler(controller.triggerSync));

module.exports = router;

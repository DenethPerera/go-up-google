const express = require('express');
const { asyncHandler } = require('../../middleware/errorHandler');
const controller = require('./category.controller');

const router = express.Router();

/**
 * GET /api/categories
 *   ?q=<search_term>   — optional partial-match filter on label
 *   ?page=<n>          — 1-based page (default 1)
 *   ?limit=<n>         — items per page (default 30, max 100)
 *
 * Public endpoint — no Firebase auth required.
 * Categories are read-only reference data.
 */
router.get('/', asyncHandler(controller.getCategories));

module.exports = router;

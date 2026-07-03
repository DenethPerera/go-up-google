const express = require('express');
const upload = require('../../middleware/upload');
const { asyncHandler } = require('../../middleware/errorHandler');
const controller = require('./location.controller');

const router = express.Router();

/**
 * POST   /api/locations        — Create a new location (with optional photos)
 * GET    /api/locations        — List all locations
 * GET    /api/locations/:id    — Get a single location
 * PUT    /api/locations/:id    — Update a location (with optional new photos)
 * DELETE /api/locations/:id    — Delete a location
 */

router
  .route('/')
  .post(upload.array('photos', 10), asyncHandler(controller.create))
  .get(asyncHandler(controller.getAll));

router
  .route('/:id')
  .get(asyncHandler(controller.getOne))
  .put(upload.array('photos', 10), asyncHandler(controller.update))
  .delete(asyncHandler(controller.remove));

module.exports = router;

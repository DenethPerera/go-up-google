const express = require('express');
const upload = require('../../middleware/upload');
const { asyncHandler } = require('../../middleware/errorHandler');
const { firebaseAuth } = require('../../middleware/firebaseAuth');
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
  .post(firebaseAuth, upload.array('photos', 10), asyncHandler(controller.create))
  .get(asyncHandler(controller.getAll));

router
  .route('/:id')
  .get(asyncHandler(controller.getOne))
  .put(firebaseAuth, upload.array('photos', 10), asyncHandler(controller.update))
  .delete(firebaseAuth, asyncHandler(controller.remove));

module.exports = router;

const Location = require('./location.model');

/**
 * Repository layer — ONLY raw DB operations.
 * No business logic here. Controllers must never touch the model directly.
 *
 * `.lean()` returns plain JS objects instead of Mongoose Documents, giving
 * significantly faster serialization on list endpoints.
 */

const create = async (data) => Location.create(data);

/**
 * Return all locations belonging to a specific Firebase user.
 * Sorted newest-first. Uses .lean() for optimal read performance.
 */
const findByUser = async (firebaseUid) =>
  Location.find({ firebaseUid }).sort({ createdAt: -1 }).lean();

/** Admin-only full scan (no auth filter). */
const findAll = async (filter = {}) =>
  Location.find(filter).sort({ createdAt: -1 }).lean();

/** Find a single document by Mongo _id. Returns a lean plain object. */
const findById = async (id) => Location.findById(id).lean();

const updateById = async (id, data) =>
  Location.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = async (id) => Location.findByIdAndDelete(id);

module.exports = { create, findAll, findByUser, findById, updateById, deleteById };

const Location = require('./location.model');

/**
 * Repository layer — ONLY raw DB operations.
 * No business logic here. Controllers must never touch the model directly.
 */

const create = async (data) => Location.create(data);

const findAll = async (filter = {}) =>
  Location.find(filter).sort({ createdAt: -1 });

const findById = async (id) => Location.findById(id);

const updateById = async (id, data) =>
  Location.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = async (id) => Location.findByIdAndDelete(id);

module.exports = { create, findAll, findById, updateById, deleteById };

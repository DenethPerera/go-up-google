const locationService = require('./location.service');

/**
 * Controller layer — only HTTP concerns (req/res).
 * No business logic or DB calls here.
 */

const create = async (req, res) => {
  const location = await locationService.createLocation({
    fields: { ...req.body, firebaseUid: req.uid },
    files: req.files,
  });
  res.status(201).json({ success: true, data: location });
};

const getAll = async (req, res) => {
  const locations = await locationService.getAllLocations();
  res.status(200).json({ success: true, count: locations.length, data: locations });
};

const getOne = async (req, res) => {
  const location = await locationService.getLocationById(req.params.id);
  res.status(200).json({ success: true, data: location });
};

const update = async (req, res) => {
  const location = await locationService.updateLocation(req.params.id, {
    fields: req.body,
    files: req.files,
    firebaseUid: req.uid,
  });
  res.status(200).json({ success: true, data: location });
};

const remove = async (req, res) => {
  await locationService.deleteLocation(req.params.id, req.uid);
  res.status(200).json({ success: true, message: 'Location deleted successfully.' });
};

module.exports = { create, getAll, getOne, update, remove };

const cloudinary = require('../../config/cloudinary');
const locationRepository = require('./location.repository');

/**
 * Upload a single file buffer to Cloudinary using upload_stream.
 * Returns the secure_url of the uploaded asset.
 *
 * @param {Buffer} buffer  - File buffer from multer memoryStorage
 * @param {string} folder  - Cloudinary folder (e.g. 'locations')
 * @returns {Promise<string>} secure_url
 */
const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 900, crop: 'limit', quality: 'auto:good' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

/**
 * Create a new location.
 * Uploads all photo buffers to Cloudinary before persisting.
 */
const createLocation = async ({ fields, files }) => {
  // Upload photos concurrently
  const photoUrls = await Promise.all(
    (files || []).map((file) => uploadBufferToCloudinary(file.buffer, 'locations'))
  );

  // Parse social JSON string sent from the frontend FormData
  let social = {};
  if (fields.social) {
    try {
      social = JSON.parse(fields.social);
    } catch {
      social = {};
    }
  }

  const locationData = {
    name: fields.name,
    address: fields.address,
    firebaseUid: fields.firebaseUid,
    contact: fields.contact || '',
    website: fields.website || '',
    category: fields.category || '',
    description: fields.description || '',
    email: fields.email || '',
    workingHours: fields.workingHours || '',
    social,
    photos: photoUrls,
    latitude: fields.latitude ? Number(fields.latitude) : undefined,
    longitude: fields.longitude ? Number(fields.longitude) : undefined,
  };

  return locationRepository.create(locationData);
};

const getAllLocations = async () => locationRepository.findAll();

const getLocationById = async (id) => {
  const location = await locationRepository.findById(id);
  if (!location) {
    const err = new Error('Location not found.');
    err.statusCode = 404;
    throw err;
  }
  return location;
};

const updateLocation = async (id, { fields, files, firebaseUid }) => {
  const existing = await getLocationById(id); // throws 404 if not found

  if (existing.firebaseUid !== firebaseUid) {
    const err = new Error('Unauthorized. You do not own this location.');
    err.statusCode = 403;
    throw err;
  }

  let newPhotoUrls = [];
  if (files && files.length > 0) {
    newPhotoUrls = await Promise.all(
      files.map((file) => uploadBufferToCloudinary(file.buffer, 'locations'))
    );
  }

  let social = existing.social;
  if (fields.social) {
    try {
      social = JSON.parse(fields.social);
    } catch {
      /* keep existing */
    }
  }

  const updateData = {
    ...(fields.name && { name: fields.name }),
    ...(fields.address && { address: fields.address }),
    ...(fields.contact !== undefined && { contact: fields.contact }),
    ...(fields.website !== undefined && { website: fields.website }),
    ...(fields.category !== undefined && { category: fields.category }),
    ...(fields.description !== undefined && { description: fields.description }),
    ...(fields.email !== undefined && { email: fields.email }),
    ...(fields.workingHours !== undefined && { workingHours: fields.workingHours }),
    ...(fields.latitude !== undefined && { latitude: fields.latitude ? Number(fields.latitude) : null }),
    ...(fields.longitude !== undefined && { longitude: fields.longitude ? Number(fields.longitude) : null }),
    social,
    // Append new photos to existing ones
    ...(newPhotoUrls.length > 0 && { $push: { photos: { $each: newPhotoUrls } } }),
  };

  return locationRepository.updateById(id, updateData);
};

const deleteLocation = async (id, firebaseUid) => {
  const existing = await getLocationById(id); // throws 404 if not found
  if (existing.firebaseUid !== firebaseUid) {
    const err = new Error('Unauthorized. You do not own this location.');
    err.statusCode = 403;
    throw err;
  }
  return locationRepository.deleteById(id);
};

module.exports = {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
};

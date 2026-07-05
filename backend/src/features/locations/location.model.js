const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema(
  {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Full address is required'],
      trim: true,
    },
    firebaseUid: {
      type: String,
      required: [true, 'Firebase User ID is required'],
      index: true,
    },
    contact: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    workingHours: {
      type: String,
      trim: true,
      default: '',
    },
    social: {
      type: socialMediaSchema,
      default: () => ({}),
    },
    photos: {
      type: [String], // Cloudinary secure_url strings
      default: [],
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    versionKey: false,
  }
);

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;

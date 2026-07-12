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

// ── Per-platform sync tracking ──────────────────────────────────────────────
// Each entry tracks the sync lifecycle for one platform (google, facebook, etc.)
const syncStatusSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ['google', 'facebook', 'bing', 'yelp', 'appleMaps'],
    },
    state: {
      type: String,
      enum: ['idle', 'syncing', 'success', 'failed'],
      default: 'idle',
    },
    lastSyncedAt: {
      type: Date,
      default: null,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    // Platform-specific external ID returned after first successful sync.
    // Google: the location resource name, e.g. 'locations/123456789'
    externalId: {
      type: String,
      default: '',
    },
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
      type: Object,
      default: {},
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
    /**
     * Per-platform sync state.
     * Initialized as empty — entries are added when the user first triggers
     * a sync for a given platform. Each entry tracks state, timestamps,
     * errors, and the external platform ID.
     */
    syncStatus: {
      type: [syncStatusSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
    versionKey: false,
  }
);

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;

const multer = require('multer');

/**
 * Keep files in RAM only — no disk writes.
 * The buffer is streamed directly to Cloudinary in the service layer.
 */
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: jpeg, jpg, png, webp.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: 10,                  // max 10 photos per submission
  },
});

module.exports = upload;

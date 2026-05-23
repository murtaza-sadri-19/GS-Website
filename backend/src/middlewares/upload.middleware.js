const multer  = require('multer');
const { error } = require('../utils/response');

// All MIME types the system ever accepts — usage-specific filtering happens in the service
const GLOBALLY_ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
]);

// Global ceiling — usage-based limits are enforced again in the service
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (GLOBALLY_ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        Object.assign(new Error(`Unsupported file type: ${file.mimetype}`), { statusCode: 400 }),
        false
      );
    }
  },
});

/**
 * Wraps multer.single('file') and converts MulterErrors into standard JSON responses.
 * Attach to any route that expects a single file upload under the field name "file".
 */
const uploadSingle = (req, res, next) => {
  multerInstance.single('file')(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return error(res, `File too large — maximum allowed size is 25 MB`, err.message, 400);
      }
      return error(res, 'File upload error', err.message, 400);
    }

    // fileFilter rejection or any other upload error
    return error(res, err.message || 'File upload failed', null, err.statusCode || 400);
  });
};

module.exports = { uploadSingle };

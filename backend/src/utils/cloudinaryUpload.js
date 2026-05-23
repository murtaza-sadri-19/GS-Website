const cloudinary = require('../config/cloudinary');

/**
 * Upload a Buffer to Cloudinary and return the full result object.
 * Wraps upload_stream in a Promise.
 */
function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

module.exports = { uploadToCloudinary };

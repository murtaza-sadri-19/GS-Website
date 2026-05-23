const { error } = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
  console.error(`[${req.method}] ${req.originalUrl} —`, err.message || err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'An unexpected error occurred' : err.message;
  const detail = err.detail || err.message || null;

  return error(res, message, detail, statusCode);
};

module.exports = errorMiddleware;

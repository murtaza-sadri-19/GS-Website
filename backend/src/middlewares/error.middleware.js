const { error } = require('../utils/response');

const isDev = process.env.NODE_ENV !== 'production';

const errorMiddleware = (err, req, res, next) => {
  console.error(`[${req.method}] ${req.originalUrl} —`, err.message || err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'An unexpected error occurred' : err.message;

  // Never leak internal error details (DB errors, stack traces) to clients on a
  // 500 in production. Intentional, client-safe details (err.detail) are always
  // passed through; raw err.message is only exposed for 500s during development.
  let detail = err.detail || null;
  if (!detail && statusCode === 500) {
    detail = isDev ? err.message : null;
  } else if (!detail) {
    detail = err.message || null;
  }

  return error(res, message, detail, statusCode);
};

module.exports = errorMiddleware;

const rateLimit = require('express-rate-limit');
const { error } = require('../utils/response');

const handler = (req, res) =>
  error(res, 'Too many requests — please slow down and try again later', null, 429);

const isDev = process.env.NODE_ENV === 'development';

/**
 * General API limiter — generous ceiling for normal browsing/admin use.
 * Applied globally in app.js.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: isDev ? 999999 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/**
 * Strict limiter for authentication endpoints (brute-force protection).
 * Applied on /auth/login and /auth/change-password.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 999999 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/**
 * Limiter for unauthenticated public writes (contact form, page-view beacon).
 */
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: isDev ? 999999 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

module.exports = { apiLimiter, authLimiter, publicWriteLimiter };

const { Router } = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { authLimiter } = require('../../middlewares/rateLimit.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('./auth.schema');

const router = Router();

// Public — rate-limited against brute force
router.post('/login',           authLimiter, validate(loginSchema),           authController.login);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema),  authController.forgotPassword);
router.post('/reset-password',  authLimiter, validate(resetPasswordSchema),   authController.resetPassword);

// Protected
router.get('/me',                authMiddleware,              authController.me);
router.post('/change-password',  authMiddleware, authLimiter, validate(changePasswordSchema), authController.changePassword);
router.post('/logout',           authMiddleware,              authController.logout);

module.exports = router;

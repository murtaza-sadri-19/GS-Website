const { Router } = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = Router();

// Public
router.post('/login', authController.login);

// Protected
router.get('/me', authMiddleware, authController.me);
router.post('/change-password', authMiddleware, authController.changePassword);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;

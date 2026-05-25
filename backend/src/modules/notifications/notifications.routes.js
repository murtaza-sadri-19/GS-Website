const { Router } = require('express');
const ctrl       = require('./notifications.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router = Router();

// Authenticated user's own inbox
router.get('/',             auth, ctrl.list);
router.get('/unread-count', auth, ctrl.unreadCount);
router.post('/read-all',    auth, ctrl.markAllRead);
router.patch('/:id/read',   auth, ctrl.markRead);

// Admin broadcast to a specific user
router.post('/', auth, allow('CENTRAL_ADMIN'), ctrl.create);

module.exports = router;

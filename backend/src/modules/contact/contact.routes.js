const { Router } = require('express');
const ctrl       = require('./contact.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');
const { publicWriteLimiter } = require('../../middlewares/rateLimit.middleware');

const router = Router();

// Public submit (rate-limited)
router.post('/', publicWriteLimiter, ctrl.submit);

// Admin inbox
router.get('/submissions',            auth, allow('CENTRAL_ADMIN'), ctrl.list);
router.patch('/submissions/:id/read', auth, allow('CENTRAL_ADMIN'), ctrl.markRead);
router.delete('/submissions/:id',     auth, allow('CENTRAL_ADMIN'), ctrl.remove);

module.exports = router;

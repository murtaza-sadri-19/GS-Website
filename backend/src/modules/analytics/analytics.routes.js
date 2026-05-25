const { Router } = require('express');
const ctrl       = require('./analytics.controller');
const { publicWriteLimiter } = require('../../middlewares/rateLimit.middleware');

const router = Router();

router.get('/visitor-count', ctrl.visitorCount);
router.post('/page-view',    publicWriteLimiter, ctrl.pageView);

module.exports = router;

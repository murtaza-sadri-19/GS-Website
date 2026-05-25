const { Router } = require('express');
const ctrl       = require('./seo.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router = Router();

// Admin list (registered before /:pageKey)
router.get('/', auth, allow('CENTRAL_ADMIN', 'CONTENT_EDITOR'), ctrl.list);

// Public read of a single page's SEO
router.get('/:pageKey', ctrl.getByKey);

// Admin upsert
router.put('/:pageKey', auth, allow('CENTRAL_ADMIN', 'CONTENT_EDITOR'), ctrl.upsert);

module.exports = router;

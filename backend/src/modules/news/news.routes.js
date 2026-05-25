const { Router }       = require('express');
const newsController   = require('./news.controller');
const authMiddleware   = require('../../middlewares/auth.middleware');
const { allow }        = require('../../middlewares/role.middleware');
const { validate }     = require('../../middlewares/validate.middleware');
const { createNewsSchema, updateNewsSchema, patchStatusSchema } = require('./news.schema');

const router = Router();

// Public
router.get('/',           newsController.list);
router.get('/slug/:slug', newsController.getBySlug);
router.get('/:id',        newsController.getOne);

// Admin only
router.post(  '/',           authMiddleware, allow('CENTRAL_ADMIN'), validate(createNewsSchema),  newsController.create);
router.put(   '/:id',        authMiddleware, allow('CENTRAL_ADMIN'), validate(updateNewsSchema),  newsController.update);
router.patch( '/:id/status', authMiddleware, allow('CENTRAL_ADMIN'), validate(patchStatusSchema), newsController.patchStatus);
router.delete('/:id',        authMiddleware, allow('CENTRAL_ADMIN'),                              newsController.remove);

module.exports = router;

const { Router }         = require('express');
const alertsController   = require('./alerts.controller');
const authMiddleware     = require('../../middlewares/auth.middleware');
const { allow }          = require('../../middlewares/role.middleware');

const router = Router();

// Public — active alerts for marquee display
router.get('/', alertsController.list);
router.get('/:id', alertsController.getOne);

// Admin only
router.post(  '/',             authMiddleware, allow('CENTRAL_ADMIN'), alertsController.create);
router.put(   '/:id',          authMiddleware, allow('CENTRAL_ADMIN'), alertsController.update);
router.patch( '/:id/toggle',   authMiddleware, allow('CENTRAL_ADMIN'), alertsController.toggle);
router.delete('/:id',          authMiddleware, allow('CENTRAL_ADMIN'), alertsController.remove);

module.exports = router;

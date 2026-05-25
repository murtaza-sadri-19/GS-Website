const { Router }        = require('express');
const tendersController = require('./tenders.controller');
const authMiddleware    = require('../../middlewares/auth.middleware');
const { allow }         = require('../../middlewares/role.middleware');

const router = Router();

router.get('/',           tendersController.list);
router.get('/:id',        tendersController.getOne);

router.post(  '/',           authMiddleware, allow('CENTRAL_ADMIN'), tendersController.create);
router.put(   '/:id',        authMiddleware, allow('CENTRAL_ADMIN'), tendersController.update);
router.patch( '/:id/status', authMiddleware, allow('CENTRAL_ADMIN'), tendersController.patchStatus);
router.delete('/:id',        authMiddleware, allow('CENTRAL_ADMIN'), tendersController.remove);

module.exports = router;

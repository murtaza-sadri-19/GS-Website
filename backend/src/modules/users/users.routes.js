const { Router } = require('express');
const usersController = require('./users.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { allow } = require('../../middlewares/role.middleware');

const router = Router();

// All users routes require authentication + CENTRAL_ADMIN role
const guard = [authMiddleware, allow('CENTRAL_ADMIN')];

router.get('/',            ...guard, usersController.list);
router.get('/:id',         ...guard, usersController.getOne);
router.post('/',           ...guard, usersController.create);
router.put('/:id',         ...guard, usersController.update);
router.patch('/:id/status',...guard, usersController.patchStatus);
router.delete('/:id',      ...guard, usersController.remove);

module.exports = router;

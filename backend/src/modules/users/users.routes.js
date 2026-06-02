const { Router } = require('express');
const usersController = require('./users.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { allow } = require('../../middlewares/role.middleware');

const router = Router();

const adminGuard      = [authMiddleware, allow('CENTRAL_ADMIN')];
const adminOrHodGuard = [authMiddleware, allow('CENTRAL_ADMIN', 'HOD')];

// Roles list — any authenticated user (needed for create forms)
router.get('/roles', authMiddleware, usersController.listRoles);

// CENTRAL_ADMIN: full CRUD over all users
// HOD: list + create restricted to own department's TEACHERs (enforced in controller)
router.get('/',             ...adminOrHodGuard, usersController.list);
router.get('/:id',          ...adminGuard,      usersController.getOne);
router.post('/',            ...adminOrHodGuard, usersController.create);
router.put('/:id',          ...adminGuard,      usersController.update);
router.patch('/:id/status', ...adminOrHodGuard, usersController.patchStatus);
router.delete('/:id',       ...adminGuard,      usersController.remove);

module.exports = router;

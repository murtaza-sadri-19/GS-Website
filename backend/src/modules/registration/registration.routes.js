const { Router } = require('express');
const ctrl       = require('./registration.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router = Router();

// HOD / Admin (HOD scoped to own department in service)
router.get('/',            auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.list);
router.post('/',           auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.create);
router.put('/:id/approve', auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.approve);
router.put('/:id/reject',  auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.reject);

module.exports = router;

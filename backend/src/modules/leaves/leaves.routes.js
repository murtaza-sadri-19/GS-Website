const { Router } = require('express');
const ctrl       = require('./leaves.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router = Router();

// Teacher — own leaves
router.get('/me', auth, allow('TEACHER'), ctrl.listMine);
router.post('/',  auth, allow('TEACHER'), ctrl.apply);

// HOD / Admin — review queue (HOD scoped to own department in service)
router.get('/',           auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.listForReview);
router.put('/:id/approve', auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.approve);
router.put('/:id/reject',  auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.reject);

module.exports = router;

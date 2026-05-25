const { Router } = require('express');
const ctrl       = require('./timetables.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router = Router();

// Teacher — own teaching slots (before /:id)
router.get('/me', auth, allow('TEACHER'), ctrl.listMine);

// Read (any authenticated user — students/faculty/HOD view schedules)
router.get('/',    auth, ctrl.list);
router.get('/:id', auth, ctrl.getOne);

// HOD / Admin — manage (ownership enforced in service)
router.post('/',            auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.create);
router.put('/:id',          auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.update);
router.put('/:id/entries',  auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.replaceEntries);
router.delete('/:id',       auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.remove);

module.exports = router;

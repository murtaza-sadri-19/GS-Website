const { Router } = require('express');
const ctrl       = require('./deptSubjects.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router   = Router();
const hodAdmin = [auth, allow('HOD', 'CENTRAL_ADMIN')];

// Public: anyone with auth can list (for department page, timetable, etc.)
router.get('/',                   auth, ctrl.list);

// HOD faculty list (for assignment dropdown)
router.get('/faculty',            ...hodAdmin, ctrl.getFaculty);

// HOD CRUD
router.post('/',                  ...hodAdmin, ctrl.create);
router.put('/:id',                ...hodAdmin, ctrl.update);
router.delete('/:id',             ...hodAdmin, ctrl.remove);
router.patch('/:id/assign-faculty', ...hodAdmin, ctrl.assignFaculty);

module.exports = router;

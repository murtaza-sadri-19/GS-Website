const svc = require('./deptSubjects.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try {
    return success(res, 'Subjects fetched', await svc.list(req.query));
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    return success(res, 'Subject created', await svc.create(req.body, req.user), 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    return success(res, 'Subject updated', await svc.update(parseInt(req.params.id), req.body, req.user));
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await svc.remove(parseInt(req.params.id), req.user);
    return success(res, 'Subject deleted', null);
  } catch (err) { next(err); }
}

async function assignFaculty(req, res, next) {
  try {
    const { faculty_user_id } = req.body;
    return success(res, 'Faculty assigned', await svc.assignFaculty(parseInt(req.params.id), faculty_user_id || null, req.user));
  } catch (err) { next(err); }
}

async function getFaculty(req, res, next) {
  try {
    const deptId = req.query.department_id || req.user.department_id;
    return success(res, 'Faculty fetched', await svc.getFacultyForDept(parseInt(deptId)));
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove, assignFaculty, getFaculty };

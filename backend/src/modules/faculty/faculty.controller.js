const facultyService    = require('./faculty.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, department_id, department_slug } = req.query;
    const result = await facultyService.listFaculty({ page, pageSize, department_id, department_slug });
    return success(res, 'Faculty profiles fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const profile = await facultyService.getProfile(parseInt(req.params.id));
    return success(res, 'Faculty profile fetched successfully', profile);
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const profile = await facultyService.getMyProfile(req.user);
    return success(res, 'Faculty profile fetched successfully', profile);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const profile = await facultyService.createProfile(req.body, req.user);
    return success(res, 'Faculty profile created successfully', profile, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const profile = await facultyService.updateProfile(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Faculty profile updated successfully', profile);
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const profile = await facultyService.updateMyProfile(req.body, req.user);
    return success(res, 'Faculty profile updated successfully', profile);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required in request body', null, 400);
    const profile = await facultyService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'Faculty profile status updated successfully', profile);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await facultyService.softDelete(parseInt(req.params.id), req.user);
    return success(res, 'Faculty profile deleted successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, getMe, create, update, updateMe, patchStatus, remove };

const deptService = require('./departments.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const departments = await deptService.listDepartments();
    return success(res, 'Departments fetched successfully', departments);
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req, res, next) {
  try {
    const dept = await deptService.getDeptBySlug(req.params.slug);
    return success(res, 'Department fetched successfully', dept);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, short_name, description, vision, mission, image_file_id } = req.body;

    if (!name) {
      return error(res, 'name is required', null, 400);
    }

    const dept = await deptService.createDepartment(
      { name, short_name, description, vision, mission, image_file_id },
      req.user
    );

    return success(res, 'Department created successfully', dept, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, short_name, description, vision, mission, image_file_id } = req.body;

    const dto = {};
    if (name          !== undefined) dto.name           = name;
    if (short_name    !== undefined) dto.short_name     = short_name;
    if (description   !== undefined) dto.description    = description;
    if (vision        !== undefined) dto.vision         = vision;
    if (mission       !== undefined) dto.mission        = mission;
    if (image_file_id !== undefined) dto.image_file_id  = image_file_id;

    const dept = await deptService.updateDepartment(parseInt(req.params.id), dto, req.user);
    return success(res, 'Department updated successfully', dept);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      return error(res, 'status must be ACTIVE or INACTIVE', null, 400);
    }

    const dept = await deptService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, `Department status updated to ${status}`, dept);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await deptService.softDelete(parseInt(req.params.id), req.user);
    return success(res, 'Department deactivated successfully', null);
  } catch (err) {
    next(err);
  }
}

async function assignHod(req, res, next) {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return error(res, 'user_id is required', null, 400);
    }

    const dept = await deptService.assignHod(parseInt(req.params.id), parseInt(user_id), req.user);
    return success(res, 'HOD assigned successfully', dept);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getBySlug, create, update, patchStatus, remove, assignHod };

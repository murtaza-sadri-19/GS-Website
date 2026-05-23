const usersService = require('./users.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { q, role, department_id, status, page, pageSize } = req.query;
    const result = await usersService.listUsers({ q, role, department_id, status, page, pageSize });
    return success(res, 'Users fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const user = await usersService.getUser(parseInt(req.params.id));
    return success(res, 'User fetched successfully', user);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, email, phone, role_id, department_id } = req.body;

    if (!name || !email || !role_id) {
      return error(res, 'name, email, and role_id are required', null, 400);
    }

    const result = await usersService.createUser(
      { name, email, phone, role_id: parseInt(role_id), department_id: department_id ? parseInt(department_id) : undefined },
      req.user
    );

    return success(res, 'User created successfully', result, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, phone, role_id, department_id } = req.body;

    const dto = {};
    if (name        !== undefined) dto.name          = name;
    if (phone       !== undefined) dto.phone         = phone;
    if (role_id     !== undefined) dto.role_id       = parseInt(role_id);
    if (department_id !== undefined) dto.department_id = department_id ? parseInt(department_id) : null;

    const user = await usersService.updateUser(parseInt(req.params.id), dto, req.user);
    return success(res, 'User updated successfully', user);
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

    const user = await usersService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, `User status updated to ${status}`, user);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await usersService.softDelete(parseInt(req.params.id), req.user);
    return success(res, 'User deactivated successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, patchStatus, remove };

const usersService = require('./users.service');
const { success, error } = require('../../utils/response');

async function listRoles(req, res, next) {
  try {
    const roles = await usersService.getRoles(req.user.role);
    return success(res, 'Roles fetched', roles);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { q, role, department_id, status, page, pageSize } = req.query;
    const filter = { q, role, department_id, status, page, pageSize };

    // HOD sees only their department's TEACHERs
    if (req.user.role === 'HOD') {
      filter.department_id = req.user.department_id;
      filter.role = 'TEACHER';
    }

    const result = await usersService.listUsers(filter);
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

    // HOD: may only create TEACHER accounts in their own department
    if (req.user.role === 'HOD') {
      const teacherRole = await usersService.getRoleByName('TEACHER');
      if (!teacherRole || parseInt(role_id) !== teacherRole.id) {
        return error(res, 'HOD can only create Teacher accounts', null, 403);
      }
      const hodDeptId = req.user.department_id;
      if (!hodDeptId) {
        return error(res, 'HOD account has no department assigned', null, 400);
      }
      if (department_id && parseInt(department_id) !== parseInt(hodDeptId)) {
        return error(res, 'HOD can only create teachers in their own department', null, 403);
      }
      const result = await usersService.createUser(
        { name, email, phone, role_id: teacherRole.id, department_id: parseInt(hodDeptId) },
        req.user
      );
      return success(res, 'Teacher account created successfully', result, 201);
    }

    // CENTRAL_ADMIN: unrestricted
    const result = await usersService.createUser(
      {
        name,
        email,
        phone,
        role_id: parseInt(role_id),
        department_id: department_id ? parseInt(department_id) : undefined,
      },
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
    if (name          !== undefined) dto.name          = name;
    if (phone         !== undefined) dto.phone         = phone;
    if (role_id       !== undefined) dto.role_id       = parseInt(role_id);
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

    // HOD: may only deactivate TEACHER accounts in their own department
    if (req.user.role === 'HOD') {
      const target = await usersService.getUser(parseInt(req.params.id));
      if (target.role !== 'TEACHER') {
        return error(res, 'HOD can only change status of Teacher accounts', null, 403);
      }
      if (String(target.department_id) !== String(req.user.department_id)) {
        return error(res, 'HOD can only manage teachers in their own department', null, 403);
      }
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

module.exports = { listRoles, list, getOne, create, update, patchStatus, remove };

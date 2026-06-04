const deptService    = require('./departments.service');
const settingsService = require('../settings/settings.service');
const { success, error } = require('../../utils/response');
const { httpError }  = require('../../utils/errors');

const ALLOWED_SECTIONS = ['about', 'obe', 'curriculum', 'research', 'timetables', 'achievements', 'infrastructure', 'gallery'];

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
    const { name, short_name, description, vision, mission, image_file_id, contact_email, contact_phone, established_year, location } = req.body;

    const dto = {};
    if (name             !== undefined) dto.name             = name;
    if (short_name       !== undefined) dto.short_name       = short_name;
    if (description      !== undefined) dto.description      = description;
    if (vision           !== undefined) dto.vision           = vision;
    if (mission          !== undefined) dto.mission          = mission;
    if (image_file_id    !== undefined) dto.image_file_id    = image_file_id;
    if (contact_email    !== undefined) dto.contact_email    = contact_email;
    if (contact_phone    !== undefined) dto.contact_phone    = contact_phone;
    if (established_year !== undefined) dto.established_year = established_year;
    if (location         !== undefined) dto.location         = location;

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

// ── Department section content (per-dept CMS) ─────────────────────────────────

async function getSection(req, res, next) {
  try {
    const { slug, section } = req.params;
    if (!ALLOWED_SECTIONS.includes(section)) return error(res, 'Unknown section', null, 400);
    const data = await settingsService.getCmsSection(`dept.${slug}.${section}`);
    return success(res, 'Section fetched', data ?? {});
  } catch (err) { next(err); }
}

async function saveSection(req, res, next) {
  try {
    const { slug, section } = req.params;
    if (!ALLOWED_SECTIONS.includes(section)) return error(res, 'Unknown section', null, 400);

    // HOD may only write their own department
    if (req.user.role === 'HOD') {
      const dept = await deptService.getDeptBySlug(slug).catch(() => null);
      if (!dept || Number(dept.id) !== Number(req.user.department_id)) {
        return error(res, 'You can only edit your own department', null, 403);
      }
    }

    await settingsService.setCmsSection(`dept.${slug}.${section}`, req.body, req.user);
    return success(res, 'Section saved', req.body);
  } catch (err) { next(err); }
}

module.exports = { list, getBySlug, create, update, patchStatus, remove, assignHod, getSection, saveSection };

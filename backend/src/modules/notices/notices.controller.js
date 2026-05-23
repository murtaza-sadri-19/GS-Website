const noticesService     = require('./notices.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, notice_type, department_id, q } = req.query;
    const result = await noticesService.listNotices({
      page,
      pageSize: pageSize || limit, // accept both ?pageSize= and ?limit=
      notice_type,
      department_id,
      q,
    });
    return success(res, 'Notices fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const notice = await noticesService.getNotice(parseInt(req.params.id));
    return success(res, 'Notice fetched successfully', notice);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const notice = await noticesService.createNotice(req.body, req.user);
    return success(res, 'Notice created successfully', notice, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const notice = await noticesService.updateNotice(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Notice updated successfully', notice);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required in request body', null, 400);
    const notice = await noticesService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'Notice status updated successfully', notice);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await noticesService.archiveNotice(parseInt(req.params.id), req.user);
    return success(res, 'Notice archived successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, patchStatus, remove };

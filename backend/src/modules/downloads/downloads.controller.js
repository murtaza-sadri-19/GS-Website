const downloadsService   = require('./downloads.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, category, department_id, q } = req.query;
    const result = await downloadsService.listDownloads({
      page,
      pageSize: pageSize || limit,
      category,
      department_id,
      q,
    });
    return success(res, 'Downloads fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const download = await downloadsService.getDownload(parseInt(req.params.id));
    return success(res, 'Download fetched successfully', download);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const download = await downloadsService.createDownload(req.body, req.user);
    return success(res, 'Download created successfully', download, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const download = await downloadsService.updateDownload(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Download updated successfully', download);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required in request body', null, 400);
    const download = await downloadsService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'Download status updated successfully', download);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await downloadsService.softDelete(parseInt(req.params.id), req.user);
    return success(res, 'Download deleted successfully', null);
  } catch (err) {
    next(err);
  }
}

async function incrementCount(req, res, next) {
  try {
    const download = await downloadsService.incrementCount(parseInt(req.params.id));
    return success(res, 'Download count incremented', download);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, patchStatus, remove, incrementCount };

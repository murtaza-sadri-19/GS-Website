const galleryService     = require('./gallery.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, department_id, q } = req.query;
    const result = await galleryService.listGallery({
      page,
      pageSize: pageSize || limit,
      department_id,
      q,
    });
    return success(res, 'Gallery fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const item = await galleryService.getItem(parseInt(req.params.id));
    return success(res, 'Gallery item fetched successfully', item);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const item = await galleryService.createItem(req.body, req.user);
    return success(res, 'Gallery item created successfully', item, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const item = await galleryService.updateItem(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Gallery item updated successfully', item);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required in request body', null, 400);
    const item = await galleryService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'Gallery item status updated successfully', item);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await galleryService.softDelete(parseInt(req.params.id), req.user);
    return success(res, 'Gallery item deleted successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, patchStatus, remove };

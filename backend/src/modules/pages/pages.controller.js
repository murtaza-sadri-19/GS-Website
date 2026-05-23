const pagesService       = require('./pages.service');
const { success, error } = require('../../utils/response');

async function getBySlug(req, res, next) {
  try {
    const page = await pagesService.getPublicPage(req.params.slug);
    return success(res, 'Page fetched successfully', page);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const pages = await pagesService.listPages();
    return success(res, 'Pages fetched successfully', pages);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const page = await pagesService.createPage(req.body, req.user);
    return success(res, 'Page created successfully', page, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const page = await pagesService.updatePage(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Page updated successfully', page);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required in request body', null, 400);
    const page = await pagesService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'Page status updated successfully', page);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await pagesService.softDelete(parseInt(req.params.id), req.user);
    return success(res, 'Page deleted successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = { getBySlug, list, create, update, patchStatus, remove };

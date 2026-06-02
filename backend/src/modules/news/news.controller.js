const newsService        = require('./news.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, category, q } = req.query;
    // Admins see all statuses; public only sees PUBLISHED
    const adminRoles = ['CENTRAL_ADMIN', 'SUPER_ADMIN'];
    const statusFilter = (req.user && adminRoles.includes(req.user.role))
      ? req.query.status || undefined
      : 'PUBLISHED';
    const result = await newsService.listNews({ page, pageSize: pageSize || limit, status: statusFilter, category, q });
    return success(res, 'News articles fetched successfully', result);
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    const article = await newsService.getNewsBySlug(req.params.slug);
    return success(res, 'News article fetched successfully', article);
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const article = await newsService.getNews(parseInt(req.params.id));
    return success(res, 'News article fetched successfully', article);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const article = await newsService.createNews(req.body, req.user);
    return success(res, 'News article created successfully', article, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const article = await newsService.updateNews(parseInt(req.params.id), req.body, req.user);
    return success(res, 'News article updated successfully', article);
  } catch (err) { next(err); }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required', null, 400);
    const article = await newsService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'News article status updated successfully', article);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await newsService.deleteNews(parseInt(req.params.id), req.user);
    return success(res, 'News article archived successfully', null);
  } catch (err) { next(err); }
}

module.exports = { list, getBySlug, getOne, create, update, patchStatus, remove };

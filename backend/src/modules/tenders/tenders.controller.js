const tendersService     = require('./tenders.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, status, q } = req.query;
    return success(res, 'Tenders fetched', await tendersService.listTenders({ page, pageSize: pageSize || limit, status, q }));
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    return success(res, 'Tender fetched', await tendersService.getTender(parseInt(req.params.id)));
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    return success(res, 'Tender created', await tendersService.createTender(req.body, req.user), 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    return success(res, 'Tender updated', await tendersService.updateTender(parseInt(req.params.id), req.body, req.user));
  } catch (err) { next(err); }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required', null, 400);
    return success(res, 'Tender status updated', await tendersService.setStatus(parseInt(req.params.id), status, req.user));
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await tendersService.deleteTender(parseInt(req.params.id), req.user);
    return success(res, 'Tender archived', null);
  } catch (err) { next(err); }
}

module.exports = { list, getOne, create, update, patchStatus, remove };

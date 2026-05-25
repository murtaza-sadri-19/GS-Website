const svc = require('./gallery.albums.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try { return success(res, 'Albums fetched', await svc.list(req.query)); } catch (err) { next(err); }
}
async function getBySlug(req, res, next) {
  try { return success(res, 'Album fetched', await svc.getBySlug(req.params.slug)); } catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return success(res, 'Album created', await svc.create(req.body, req.user), 201); } catch (err) { next(err); }
}
async function update(req, res, next) {
  try { return success(res, 'Album updated', await svc.update(parseInt(req.params.id), req.body, req.user)); } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { await svc.remove(parseInt(req.params.id), req.user); return success(res, 'Album removed', null); } catch (err) { next(err); }
}

module.exports = { list, getBySlug, create, update, remove };

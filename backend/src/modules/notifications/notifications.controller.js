const svc = require('./notifications.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try { return success(res, 'Notifications fetched', await svc.listForUser(req.user.id, req.query)); } catch (err) { next(err); }
}
async function unreadCount(req, res, next) {
  try { return success(res, 'Unread count', await svc.unreadCount(req.user.id)); } catch (err) { next(err); }
}
async function markRead(req, res, next) {
  try { await svc.markRead(parseInt(req.params.id), req.user.id); return success(res, 'Marked read', null); } catch (err) { next(err); }
}
async function markAllRead(req, res, next) {
  try { await svc.markAllRead(req.user.id); return success(res, 'All marked read', null); } catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return success(res, 'Notification created', await svc.create(req.body), 201); } catch (err) { next(err); }
}

module.exports = { list, unreadCount, markRead, markAllRead, create };

const svc = require('./contact.service');
const { success } = require('../../utils/response');

async function submit(req, res, next) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null;
    await svc.submit(req.body, Array.isArray(ip) ? ip[0] : ip);
    return success(res, 'Thank you — your message has been received', null, 201);
  } catch (err) { next(err); }
}
async function list(req, res, next) {
  try { return success(res, 'Submissions fetched', await svc.list(req.query)); } catch (err) { next(err); }
}
async function markRead(req, res, next) {
  try { await svc.markRead(parseInt(req.params.id), req.user); return success(res, 'Marked as read', null); } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { await svc.remove(parseInt(req.params.id), req.user); return success(res, 'Submission deleted', null); } catch (err) { next(err); }
}

module.exports = { submit, list, markRead, remove };

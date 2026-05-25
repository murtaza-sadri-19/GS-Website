const svc = require('./analytics.service');
const { success } = require('../../utils/response');

async function visitorCount(req, res, next) {
  try { return success(res, 'Visitor count fetched', await svc.getVisitorCount()); } catch (err) { next(err); }
}
async function pageView(req, res, next) {
  try { return success(res, 'Recorded', await svc.recordPageView()); } catch (err) { next(err); }
}

module.exports = { visitorCount, pageView };

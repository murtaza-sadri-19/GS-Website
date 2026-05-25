const svc = require('./chatbot.service');
const { success } = require('../../utils/response');

async function getConfig(req, res, next) {
  try { return success(res, 'Chatbot config fetched', await svc.getConfig()); } catch (err) { next(err); }
}
async function updateConfig(req, res, next) {
  try { return success(res, 'Chatbot config saved', await svc.updateConfig(req.body, req.user)); } catch (err) { next(err); }
}
async function listResponses(req, res, next) {
  try { return success(res, 'Responses fetched', await svc.listResponses(req.query)); } catch (err) { next(err); }
}
async function createResponse(req, res, next) {
  try { return success(res, 'Response created', await svc.createResponse(req.body, req.user), 201); } catch (err) { next(err); }
}
async function updateResponse(req, res, next) {
  try { return success(res, 'Response updated', await svc.updateResponse(parseInt(req.params.id), req.body, req.user)); } catch (err) { next(err); }
}
async function deleteResponse(req, res, next) {
  try { await svc.deleteResponse(parseInt(req.params.id), req.user); return success(res, 'Response deleted', null); } catch (err) { next(err); }
}

module.exports = { getConfig, updateConfig, listResponses, createResponse, updateResponse, deleteResponse };

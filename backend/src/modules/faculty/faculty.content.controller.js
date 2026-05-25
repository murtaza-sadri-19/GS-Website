const svc = require('./faculty.content.service');
const { success } = require('../../utils/response');

// Public — list a faculty profile's content by profile id
const listPublic = (resource) => async (req, res, next) => {
  try {
    const items = await svc.listByFacultyId(resource, parseInt(req.params.id));
    return success(res, `${resource} fetched successfully`, items);
  } catch (err) { next(err); }
};

// TEACHER — own content
const listMine = (resource) => async (req, res, next) => {
  try {
    const items = await svc.listForUser(resource, req.user.id);
    return success(res, `${resource} fetched successfully`, items);
  } catch (err) { next(err); }
};

const createMine = (resource) => async (req, res, next) => {
  try {
    const item = await svc.create(resource, req.user.id, req.body, req.user);
    return success(res, `${resource} created successfully`, item, 201);
  } catch (err) { next(err); }
};

const updateMine = (resource) => async (req, res, next) => {
  try {
    const item = await svc.update(resource, req.user.id, parseInt(req.params.itemId), req.body, req.user);
    return success(res, `${resource} updated successfully`, item);
  } catch (err) { next(err); }
};

const removeMine = (resource) => async (req, res, next) => {
  try {
    await svc.remove(resource, req.user.id, parseInt(req.params.itemId), req.user);
    return success(res, `${resource} deleted successfully`, null);
  } catch (err) { next(err); }
};

module.exports = { listPublic, listMine, createMine, updateMine, removeMine };

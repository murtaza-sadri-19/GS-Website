const svc = require('./page-sections.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page_key, all } = req.query;
    if (!page_key) return res.status(400).json({ message: 'page_key query param required' });
    const rows = all === '1'
      ? await svc.getAllSectionsForPage(page_key)
      : await svc.getSectionsForPage(page_key);
    return success(res, 'Sections fetched', rows);
  } catch (err) { next(err); }
}

async function stats(req, res, next) {
  try {
    return success(res, 'Live stats', await svc.getLiveStats());
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const section = await svc.createSection(req.body, req.user);
    return success(res, 'Section created', section, 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const section = await svc.updateSection(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Section updated', section);
  } catch (err) { next(err); }
}

async function reorder(req, res, next) {
  try {
    const { page_key, ordered_ids } = req.body;
    const sections = await svc.reorderSections(page_key, ordered_ids, req.user);
    return success(res, 'Sections reordered', sections);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await svc.deleteSection(parseInt(req.params.id), req.user);
    return success(res, 'Section deleted', null);
  } catch (err) { next(err); }
}

module.exports = { list, stats, create, update, reorder, remove };

const filesService = require('./files.service');
const { success, error } = require('../../utils/response');

async function upload(req, res, next) {
  try {
    if (!req.file) {
      return error(res, 'No file provided — use field name "file" in multipart/form-data', null, 400);
    }

    const usage = req.body.usage || 'notices';

    const VALID_USAGES = ['notices', 'downloads', 'gallery', 'faculty', 'events', 'departments', 'exam', 'placement'];
    if (!VALID_USAGES.includes(usage)) {
      return error(res, `Invalid usage "${usage}". Valid values: ${VALID_USAGES.join(', ')}`, null, 400);
    }

    const file = await filesService.uploadFile(req.file, req.user.id, usage);
    return success(res, 'File uploaded successfully', file, 201);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { page, pageSize } = req.query;
    const result = await filesService.listFiles({ page, pageSize });
    return success(res, 'Files fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const file = await filesService.getFile(parseInt(req.params.id), req.user);
    return success(res, 'File fetched successfully', file);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await filesService.deleteFile(parseInt(req.params.id), req.user);
    return success(res, 'File deleted successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, list, getOne, remove };

/**
 * Files Service — Universal Attachment Registry
 *
 * Supports two attachment types:
 *   FILE          → binary upload stored on LOCAL disk or CLOUDINARY
 *   EXTERNAL_LINK → URL-only reference, no binary stored here
 *
 * Both types are registered in the `files` table and return a file_id
 * that dependent modules (notices, downloads, events, …) reference via FK.
 *
 * Migration 012 must be applied before using EXTERNAL_LINK functionality.
 */

const fs                 = require('fs');
const path               = require('path');
const pool               = require('../../config/db');
const cloudinary         = require('../../config/cloudinary');
const { uploadToCloudinary } = require('../../utils/cloudinaryUpload');
const writeAudit         = require('../../utils/audit');
const env                = require('../../config/env');
const { assertExternalUrl, guessMimeFromUrl } = require('../../utils/urlValidator');

const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

function isCloudinaryConfigured() {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  return Boolean(
    cloudName && cloudName !== 'your_cloud_name' &&
    apiKey    && apiKey    !== 'your_api_key' &&
    apiSecret && apiSecret !== 'your_api_secret'
  );
}

async function uploadToLocalDisk(buffer, sanitizedName) {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  const ext      = path.extname(sanitizedName);
  const base     = path.basename(sanitizedName, ext);
  const stored   = `${base}_${Date.now()}${ext}`;
  const destPath = path.join(UPLOADS_DIR, stored);
  fs.writeFileSync(destPath, buffer);
  return {
    public_id:  stored,
    secure_url: `http://localhost:${env.port}/uploads/${stored}`,
  };
}

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ── Usage-based validation config ─────────────────────────────────────────────

const IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DOC_MIMES   = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const USAGE_CONFIG = {
  gallery:     { mimes: IMAGE_MIMES,                      maxMB: 2  },
  faculty:     { mimes: IMAGE_MIMES,                      maxMB: 2  },
  events:      { mimes: IMAGE_MIMES,                      maxMB: 2  },
  departments: { mimes: IMAGE_MIMES,                      maxMB: 2  },
  notices:     { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  exam:        { mimes: ['application/pdf'],               maxMB: 10 },
  placement:   { mimes: DOC_MIMES,                        maxMB: 10 },
  downloads:   { mimes: [...DOC_MIMES, 'application/zip', 'application/x-zip-compressed'], maxMB: 25 },
  tenders:     { mimes: [...DOC_MIMES],                   maxMB: 10 },
  labs:        { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  achievements:{ mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  research:    { mimes: DOC_MIMES,                        maxMB: 25 },
  cms:         { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  chatbot:     { mimes: [...DOC_MIMES],                   maxMB: 25 },
};

const DEFAULT_USAGE_CONFIG = USAGE_CONFIG.notices;

const VALID_USAGES = Object.keys(USAGE_CONFIG);

// Tables that hold FK references to files.id — used for safe-delete check
const FILE_REFERENCE_CHECKS = [
  { table: 'notices',           col: 'file_id'                 },
  { table: 'downloads',         col: 'file_id'                 },
  { table: 'exam_documents',    col: 'file_id'                 },
  { table: 'placement_records', col: 'file_id'                 },
  { table: 'events',            col: 'cover_image_file_id'     },
  { table: 'gallery',           col: 'file_id'                 },
  { table: 'departments',       col: 'image_file_id'           },
  { table: 'faculty_profiles',  col: 'profile_image_file_id'   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Fetch a file record (joined with uploader name).
 * Handles both old schema (no attachment_type) and new schema via COALESCE.
 */
async function fetchFile(id) {
  const [rows] = await pool.execute(
    `SELECT
       f.id,
       COALESCE(f.attachment_type, 'FILE') AS attachment_type,
       f.original_name,
       f.stored_name,
       f.file_url,
       f.external_url,
       f.thumbnail_url,
       f.alt_text,
       f.meta_title,
       f.meta_description,
       f.file_type,
       f.file_size,
       f.storage_type,
       f.uploaded_by,
       f.created_at,
       u.name AS uploader_name
     FROM files f
     INNER JOIN users u ON f.uploaded_by = u.id
     WHERE f.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function isReferenced(fileId) {
  const refs = await Promise.all(
    FILE_REFERENCE_CHECKS.map(async ({ table, col }) => {
      const [rows] = await pool.execute(
        `SELECT 1 FROM ${table} WHERE ${col} = ? LIMIT 1`,
        [fileId]
      );
      return rows[0] ? table : null;
    })
  );
  return refs.filter(Boolean);
}

// ── Service: Upload real file ─────────────────────────────────────────────────

/**
 * Accepts a multer-processed file, validates it, stores it (Cloudinary or local),
 * inserts a row in `files` with attachment_type = 'FILE', and returns the record.
 *
 * @param {object} reqFile   - multer file object (buffer, mimetype, size, originalname)
 * @param {number} uploadedBy - user id
 * @param {string} [usage]   - usage key for config lookup
 */
async function uploadFile(reqFile, uploadedBy, usage = 'notices') {
  if (!reqFile) throw httpError('No file provided', 400);

  const { originalname, mimetype, size, buffer } = reqFile;
  const config = USAGE_CONFIG[usage] || DEFAULT_USAGE_CONFIG;

  // Usage-based MIME validation
  if (!config.mimes.includes(mimetype)) {
    throw httpError(
      `File type "${mimetype}" is not allowed for usage "${usage}". Allowed: ${config.mimes.join(', ')}`,
      400
    );
  }

  // Usage-based size validation
  const maxBytes = config.maxMB * 1024 * 1024;
  if (size > maxBytes) {
    throw httpError(
      `File size ${(size / 1024 / 1024).toFixed(2)} MB exceeds the ${config.maxMB} MB limit for usage "${usage}"`,
      400
    );
  }

  const sanitizedName = sanitizeFilename(originalname);
  const isImage = IMAGE_MIMES.includes(mimetype);

  let uploadResult;
  let storageType;

  if (isCloudinaryConfigured()) {
    const resourceType = isImage ? 'image' : 'raw';
    try {
      uploadResult = await uploadToCloudinary(buffer, {
        resource_type:   resourceType,
        folder:          `college-website/${usage}`,
        public_id:       sanitizedName.replace(/\.[^.]+$/, ''),
        use_filename:    true,
        unique_filename: true,
      });
      storageType = 'CLOUDINARY';
    } catch (err) {
      console.error('Cloudinary upload error:', err.message);
      console.warn('[files] Cloudinary upload failed — falling back to local disk storage');
      uploadResult = await uploadToLocalDisk(buffer, sanitizedName);
      storageType  = 'LOCAL';
    }
  } else {
    console.warn('[files] Cloudinary not configured — falling back to local disk storage');
    uploadResult = await uploadToLocalDisk(buffer, sanitizedName);
    storageType  = 'LOCAL';
  }

  const [result] = await pool.execute(
    `INSERT INTO files
       (attachment_type, original_name, stored_name, file_url, file_type, file_size, storage_type, uploaded_by)
     VALUES ('FILE', ?, ?, ?, ?, ?, ?, ?)`,
    [sanitizedName, uploadResult.public_id, uploadResult.secure_url, mimetype, size, storageType, uploadedBy]
  );

  const newId = result.insertId;

  await writeAudit({
    userId:      uploadedBy,
    action:      'CREATE',
    module:      'files',
    recordId:    newId,
    description: `Uploaded file "${sanitizedName}" (id=${newId}, type=${mimetype}, size=${size}, storage=${storageType})`,
  });

  return await fetchFile(newId);
}

// ── Service: Register external link ──────────────────────────────────────────

/**
 * Registers an external URL as an attachment record in `files`.
 * No binary data is stored — the URL itself is the attachment.
 *
 * @param {object} dto
 * @param {string}  dto.external_url    - Required. The external URL.
 * @param {string}  [dto.original_name] - Display name (defaults to URL hostname + path tail).
 * @param {string}  [dto.alt_text]      - Accessible description.
 * @param {string}  [dto.thumbnail_url] - Optional thumbnail / preview URL.
 * @param {string}  [dto.meta_title]    - Optional display title.
 * @param {string}  [dto.meta_description] - Optional description.
 * @param {string}  [dto.usage]         - Usage context for audit logging.
 * @param {number}  uploadedBy          - User ID registering the link.
 * @returns {Promise<object>} The created file record.
 */
async function registerExternalLink(dto, uploadedBy) {
  const {
    external_url,
    original_name,
    alt_text,
    thumbnail_url,
    meta_title,
    meta_description,
    usage = 'external',
  } = dto;

  if (!external_url || typeof external_url !== 'string' || !external_url.trim()) {
    throw httpError('external_url is required', 400);
  }

  // Validate URL (throws on failure)
  assertExternalUrl(external_url.trim());

  // If thumbnail_url is provided, also validate it
  if (thumbnail_url && thumbnail_url.trim()) {
    assertExternalUrl(thumbnail_url.trim());
  }

  // Derive a display name from the URL if not provided
  let displayName = (original_name || '').trim();
  if (!displayName) {
    try {
      const urlObj   = new URL(external_url.trim());
      const pathTail = urlObj.pathname.split('/').filter(Boolean).pop() || '';
      displayName = pathTail || urlObj.hostname;
    } catch {
      displayName = 'external-link';
    }
  }

  // Best-effort MIME type from URL extension
  const guessedMime = guessMimeFromUrl(external_url.trim());

  const [result] = await pool.execute(
    `INSERT INTO files
       (attachment_type, original_name, stored_name, file_url, external_url,
        thumbnail_url, alt_text, meta_title, meta_description,
        file_type, file_size, storage_type, uploaded_by)
     VALUES ('EXTERNAL_LINK', ?, NULL, ?, ?, ?, ?, ?, ?, ?, NULL, 'EXTERNAL', ?)`,
    [
      displayName,
      external_url.trim(),          // file_url = external_url for unified access
      external_url.trim(),          // external_url (dedicated column)
      thumbnail_url ? thumbnail_url.trim() : null,
      alt_text      ? alt_text.trim()      : null,
      meta_title    ? meta_title.trim()    : null,
      meta_description ? meta_description.trim() : null,
      guessedMime   || null,
      uploadedBy,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId:      uploadedBy,
    action:      'CREATE',
    module:      'files',
    recordId:    newId,
    description: `Registered external link "${displayName}" (id=${newId}, url=${external_url.trim()}, usage=${usage})`,
  });

  return await fetchFile(newId);
}

// ── Service: List ─────────────────────────────────────────────────────────────

async function listFiles({ page = 1, pageSize = 20, attachment_type } = {}) {
  page     = Math.max(1, parseInt(page) || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
  const offset = (page - 1) * pageSize;

  const conditions = [];
  const params     = [];

  if (attachment_type && ['FILE', 'EXTERNAL_LINK'].includes(attachment_type)) {
    conditions.push('COALESCE(f.attachment_type, \'FILE\') = ?');
    params.push(attachment_type);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT
         f.id,
         COALESCE(f.attachment_type, 'FILE') AS attachment_type,
         f.original_name, f.stored_name, f.file_url, f.external_url,
         f.thumbnail_url, f.alt_text, f.meta_title, f.meta_description,
         f.file_type, f.file_size, f.storage_type, f.uploaded_by, f.created_at,
         u.name AS uploader_name
       FROM files f
       INNER JOIN users u ON f.uploaded_by = u.id
       ${where}
       ORDER BY f.created_at DESC
       LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(`SELECT COUNT(*) AS total FROM files f ${where}`, params),
  ]);

  const total = countRows[0].total;
  return {
    files: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

// ── Service: Get one ──────────────────────────────────────────────────────────

async function getFile(id, currentUser) {
  const file = await fetchFile(id);
  if (!file) throw httpError('File not found', 404);

  // Allow any authenticated user to view file metadata, ensuring HODs, Faculty,
  // and other portal roles can load and manage items containing attachments.
  return file;
}

// ── Service: Delete ───────────────────────────────────────────────────────────

async function deleteFile(id, currentUser) {
  const file = await fetchFile(id);
  if (!file) throw httpError('File not found', 404);

  if (Number(file.uploaded_by) !== Number(currentUser.id) && currentUser.role !== 'CENTRAL_ADMIN') {
    throw httpError('You do not have permission to delete this file', 403);
  }

  // Reference check — refuse if any module still points to this file
  const refs = await isReferenced(id);
  if (refs.length > 0) {
    throw httpError(`File is still referenced by: ${refs.join(', ')}`, 409);
  }

  // For real uploads: delete the stored binary
  if (file.attachment_type === 'FILE') {
    if (file.storage_type === 'CLOUDINARY' && file.stored_name) {
      try {
        const isImage = IMAGE_MIMES.includes(file.file_type);
        await cloudinary.uploader.destroy(file.stored_name, {
          resource_type: isImage ? 'image' : 'raw',
        });
      } catch (err) {
        console.warn(`Cloudinary asset delete failed for file id=${id} (${file.stored_name}):`, err.message);
      }
    } else if (file.storage_type === 'LOCAL' && file.stored_name) {
      try {
        const localPath = path.join(UPLOADS_DIR, file.stored_name);
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      } catch (err) {
        console.warn(`Local file delete failed for file id=${id} (${file.stored_name}):`, err.message);
      }
    }
  }
  // For EXTERNAL_LINK: nothing to delete from storage — just remove the DB row

  await pool.execute('DELETE FROM files WHERE id = ?', [id]);

  await writeAudit({
    userId:      currentUser.id,
    action:      'DELETE',
    module:      'files',
    recordId:    id,
    description: `Deleted ${file.attachment_type === 'EXTERNAL_LINK' ? 'external link' : 'file'} id=${id} ("${file.original_name}")`,
  });
}

// ── Service: Update external link metadata ────────────────────────────────────

/**
 * Updates metadata fields on an EXTERNAL_LINK attachment.
 * Only the owner or CENTRAL_ADMIN can do this.
 */
async function updateExternalLink(id, dto, currentUser) {
  const file = await fetchFile(id);
  if (!file) throw httpError('Attachment not found', 404);
  if (file.attachment_type !== 'EXTERNAL_LINK') {
    throw httpError('Only EXTERNAL_LINK attachments can be updated via this endpoint', 400);
  }
  if (Number(file.uploaded_by) !== Number(currentUser.id) && currentUser.role !== 'CENTRAL_ADMIN') {
    throw httpError('You do not have permission to update this attachment', 403);
  }

  const fields = [];
  const params = [];

  if (dto.external_url !== undefined && dto.external_url !== null) {
    assertExternalUrl(dto.external_url.trim());
    fields.push('external_url = ?', 'file_url = ?');
    params.push(dto.external_url.trim(), dto.external_url.trim());
  }
  if (dto.original_name !== undefined) { fields.push('original_name = ?');    params.push(dto.original_name?.trim() || file.original_name); }
  if (dto.alt_text      !== undefined) { fields.push('alt_text = ?');          params.push(dto.alt_text?.trim()      || null); }
  if (dto.thumbnail_url !== undefined) {
    if (dto.thumbnail_url) assertExternalUrl(dto.thumbnail_url.trim());
    fields.push('thumbnail_url = ?');
    params.push(dto.thumbnail_url?.trim() || null);
  }
  if (dto.meta_title       !== undefined) { fields.push('meta_title = ?');       params.push(dto.meta_title?.trim()       || null); }
  if (dto.meta_description !== undefined) { fields.push('meta_description = ?'); params.push(dto.meta_description?.trim() || null); }

  if (fields.length === 0) return file;

  params.push(id);
  await pool.execute(`UPDATE files SET ${fields.join(', ')} WHERE id = ?`, params);

  await writeAudit({
    userId:      currentUser.id,
    action:      'UPDATE',
    module:      'files',
    recordId:    id,
    description: `Updated external link id=${id} (fields: ${fields.map(f => f.split(' ')[0]).join(', ')})`,
  });

  return await fetchFile(id);
}

module.exports = {
  uploadFile,
  registerExternalLink,
  updateExternalLink,
  listFiles,
  getFile,
  deleteFile,
  VALID_USAGES,
};

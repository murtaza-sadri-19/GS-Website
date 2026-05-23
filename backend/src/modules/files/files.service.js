const pool               = require('../../config/db');
const cloudinary         = require('../../config/cloudinary');
const { uploadToCloudinary } = require('../../utils/cloudinaryUpload');
const writeAudit         = require('../../utils/audit');

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
};

const DEFAULT_USAGE_CONFIG = USAGE_CONFIG.notices;

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

async function fetchFile(id) {
  const [rows] = await pool.execute(
    `SELECT f.id, f.original_name, f.stored_name, f.file_url, f.file_type,
            f.file_size, f.storage_type, f.uploaded_by, f.created_at,
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
      // table and col are hardcoded internal strings — not user input
      const [rows] = await pool.execute(
        `SELECT 1 FROM ${table} WHERE ${col} = ? LIMIT 1`,
        [fileId]
      );
      return rows[0] ? table : null;
    })
  );
  return refs.filter(Boolean);
}

// ── Service functions ─────────────────────────────────────────────────────────

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
    throw httpError(`File size ${(size / 1024 / 1024).toFixed(2)} MB exceeds the ${config.maxMB} MB limit for usage "${usage}"`, 400);
  }

  const sanitizedName = sanitizeFilename(originalname);

  // Cloudinary upload — image types get resource_type 'image', everything else 'raw'
  const isImage    = IMAGE_MIMES.includes(mimetype);
  const resourceType = isImage ? 'image' : 'raw';

  let cloudResult;
  try {
    cloudResult = await uploadToCloudinary(buffer, {
      resource_type: resourceType,
      folder:        `college-website/${usage}`,
      public_id:     sanitizedName.replace(/\.[^.]+$/, ''), // strip extension — Cloudinary adds it
      use_filename:  true,
      unique_filename: true,
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    throw httpError('File storage failed — please try again', 502);
  }

  const [result] = await pool.execute(
    `INSERT INTO files (original_name, stored_name, file_url, file_type, file_size, storage_type, uploaded_by)
     VALUES (?, ?, ?, ?, ?, 'CLOUDINARY', ?)`,
    [sanitizedName, cloudResult.public_id, cloudResult.secure_url, mimetype, size, uploadedBy]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: uploadedBy,
    action: 'CREATE',
    module: 'files',
    recordId: newId,
    description: `Uploaded file "${sanitizedName}" (id=${newId}, type=${mimetype}, size=${size})`,
  });

  return await fetchFile(newId);
}

async function listFiles({ page = 1, pageSize = 20 } = {}) {
  page     = Math.max(1, parseInt(page) || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
  const offset = (page - 1) * pageSize;

  // LIMIT / OFFSET are inlined as validated integers — never raw user input
  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT f.id, f.original_name, f.stored_name, f.file_url, f.file_type,
              f.file_size, f.storage_type, f.uploaded_by, f.created_at,
              u.name AS uploader_name
       FROM files f
       INNER JOIN users u ON f.uploaded_by = u.id
       ORDER BY f.created_at DESC
       LIMIT ${pageSize} OFFSET ${offset}`
    ),
    pool.execute('SELECT COUNT(*) AS total FROM files'),
  ]);

  const total = countRows[0].total;
  return {
    files: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getFile(id, currentUser) {
  const file = await fetchFile(id);
  if (!file) throw httpError('File not found', 404);

  if (Number(file.uploaded_by) !== Number(currentUser.id) && currentUser.role !== 'CENTRAL_ADMIN') {
    throw httpError('You do not have permission to view this file', 403);
  }

  return file;
}

async function deleteFile(id, currentUser) {
  const file = await fetchFile(id);
  if (!file) throw httpError('File not found', 404);

  // Ownership check
  if (Number(file.uploaded_by) !== Number(currentUser.id) && currentUser.role !== 'CENTRAL_ADMIN') {
    throw httpError('You do not have permission to delete this file', 403);
  }

  // Reference check — refuse if any module still points to this file
  const refs = await isReferenced(id);
  if (refs.length > 0) {
    throw httpError(`File is still referenced by: ${refs.join(', ')}`, 409);
  }

  // Delete the Cloudinary asset (log warning on failure but continue with row deletion)
  if (file.storage_type === 'CLOUDINARY' && file.stored_name) {
    try {
      const isImage = IMAGE_MIMES.includes(file.file_type);
      await cloudinary.uploader.destroy(file.stored_name, {
        resource_type: isImage ? 'image' : 'raw',
      });
    } catch (err) {
      console.warn(`Cloudinary asset delete failed for file id=${id} (${file.stored_name}):`, err.message);
    }
  }

  // Delete the DB row
  await pool.execute('DELETE FROM files WHERE id = ?', [id]);

  await writeAudit({
    userId: currentUser.id,
    action: 'DELETE',
    module: 'files',
    recordId: id,
    description: `Deleted file id=${id} ("${file.original_name}")`,
  });
}

module.exports = { uploadFile, listFiles, getFile, deleteFile };

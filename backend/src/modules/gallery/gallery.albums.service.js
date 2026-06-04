const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const slugUtil   = require('../../utils/slug');

const { httpError } = require('../../utils/errors');

function assertOwnsDept(actor, deptId) {
  if (actor.role === 'HOD' && deptId && Number(actor.department_id) !== Number(deptId)) {
    throw httpError('HOD can only manage albums for their own department', 403);
  }
}

async function fetchById(id) {
  const [rows] = await pool.execute(
    `SELECT a.*,
            f.file_url AS cover_url,
            COALESCE(f.attachment_type, 'FILE') AS cover_attachment_type,
            f.original_name AS cover_original_name,
            d.name AS department_name
       FROM gallery_albums a
       LEFT JOIN files f ON a.cover_file_id = f.id
       LEFT JOIN departments d ON a.department_id = d.id
      WHERE a.id = ?`, [id]
  );
  return rows[0] || null;
}

async function list({ department_id, status } = {}) {
  const conds = [];
  const params = [];
  if (status) { conds.push('a.status = ?'); params.push(status); }
  else        { conds.push("a.status = 'ACTIVE'"); }
  if (department_id) { conds.push('a.department_id = ?'); params.push(parseInt(department_id)); }
  const where = `WHERE ${conds.join(' AND ')}`;
  const [rows] = await pool.execute(
    `SELECT a.*,
            f.file_url AS cover_url,
            COALESCE(f.attachment_type, 'FILE') AS cover_attachment_type,
            f.original_name AS cover_original_name,
            (SELECT COUNT(*) FROM gallery g WHERE g.album_id = a.id) AS photo_count
       FROM gallery_albums a
       LEFT JOIN files f ON a.cover_file_id = f.id
       ${where} ORDER BY a.event_date DESC, a.id DESC`, params
  );
  return rows;
}

async function getBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT a.*,
            f.file_url AS cover_url,
            COALESCE(f.attachment_type, 'FILE') AS cover_attachment_type,
            f.original_name AS cover_original_name
       FROM gallery_albums a
       LEFT JOIN files f ON a.cover_file_id = f.id WHERE a.slug = ?`, [slug]
  );
  const album = rows[0];
  if (!album) throw httpError('Album not found', 404);
  const [images] = await pool.execute(
    `SELECT g.id, g.title, g.description, gf.file_url AS image_url
       FROM gallery g INNER JOIN files gf ON g.file_id = gf.id
      WHERE g.album_id = ? AND g.status = 'ACTIVE' ORDER BY g.created_at DESC`, [album.id]
  );
  return { ...album, images };
}

async function create(dto, actor) {
  const { title, description, cover_file_id, department_id, event_date, status = 'ACTIVE' } = dto;
  if (!title || !title.trim()) throw httpError('title is required', 400);
  assertOwnsDept(actor, department_id);
  const slug = await slugUtil.ensureUniqueSlug('gallery_albums', slugUtil.slugify(title));
  const [result] = await pool.execute(
    `INSERT INTO gallery_albums (title, slug, description, cover_file_id, department_id, event_date, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title.trim(), slug, description || null, cover_file_id || null,
     department_id || (actor.role === 'HOD' ? actor.department_id : null), event_date || null, status, actor.id]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'gallery.albums', recordId: result.insertId,
    description: `Created album "${title.trim()}"` });
  return fetchById(result.insertId);
}

async function update(id, dto, actor) {
  const album = await fetchById(id);
  if (!album) throw httpError('Album not found', 404);
  assertOwnsDept(actor, album.department_id);
  const fields = ['title', 'description', 'cover_file_id', 'department_id', 'event_date', 'status'];
  const cols = fields.filter((f) => dto[f] !== undefined);
  if (cols.length) {
    await pool.execute(`UPDATE gallery_albums SET ${cols.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((f) => dto[f]), id]);
  }
  const newValues = {
    title: dto.title !== undefined ? dto.title : album.title,
    description: dto.description !== undefined ? dto.description : album.description,
    cover_file_id: dto.cover_file_id !== undefined ? dto.cover_file_id : album.cover_file_id,
    department_id: dto.department_id !== undefined ? dto.department_id : album.department_id,
    event_date: dto.event_date !== undefined ? dto.event_date : album.event_date,
    status: dto.status !== undefined ? dto.status : album.status,
  };

  const changed = [];
  if (newValues.title !== album.title) changed.push('title');
  if (newValues.description !== album.description) changed.push('description');
  if (String(newValues.cover_file_id) !== String(album.cover_file_id)) changed.push('cover_file_id');
  if (String(newValues.department_id) !== String(album.department_id)) changed.push('department_id');
  if (String(newValues.event_date) !== String(album.event_date)) changed.push('event_date');
  if (newValues.status !== album.status) changed.push('status');

  const oldValue = {};
  const newValue = {};
  if (changed.includes('title'))         { oldValue.title = album.title; newValue.title = newValues.title; }
  if (changed.includes('description'))   { oldValue.description = album.description; newValue.description = newValues.description; }
  if (changed.includes('cover_file_id')) { oldValue.cover_file_id = album.cover_file_id; newValue.cover_file_id = newValues.cover_file_id; }
  if (changed.includes('department_id')) { oldValue.department_id = album.department_id; newValue.department_id = newValues.department_id; }
  if (changed.includes('event_date'))    { oldValue.event_date = album.event_date; newValue.event_date = newValues.event_date; }
  if (changed.includes('status'))        { oldValue.status = album.status; newValue.status = newValues.status; }

  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'gallery.albums', recordId: id, description: `Updated album id=${id}`,
    changedFields: changed.length ? changed : null,
    oldValue: changed.length ? oldValue : null,
    newValue: changed.length ? newValue : null,
  });
  return fetchById(id);
}

async function remove(id, actor) {
  const album = await fetchById(id);
  if (!album) throw httpError('Album not found', 404);
  assertOwnsDept(actor, album.department_id);
  await pool.execute("UPDATE gallery_albums SET status = 'INACTIVE' WHERE id = ?", [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'gallery.albums', recordId: id, description: `Deactivated album id=${id}`,
    changedFields: ['status'],
    oldValue: { status: album.status },
    newValue: { status: 'INACTIVE' },
  });
}

module.exports = { list, getBySlug, create, update, remove };

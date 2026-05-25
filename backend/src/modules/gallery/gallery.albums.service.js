const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const slugUtil   = require('../../utils/slug');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

function assertOwnsDept(actor, deptId) {
  if (actor.role === 'HOD' && deptId && Number(actor.department_id) !== Number(deptId)) {
    throw httpError('HOD can only manage albums for their own department', 403);
  }
}

async function fetchById(id) {
  const [rows] = await pool.execute(
    `SELECT a.*, f.file_url AS cover_url, d.name AS department_name
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
    `SELECT a.*, f.file_url AS cover_url,
            (SELECT COUNT(*) FROM gallery g WHERE g.album_id = a.id) AS photo_count
       FROM gallery_albums a
       LEFT JOIN files f ON a.cover_file_id = f.id
       ${where} ORDER BY a.event_date DESC, a.id DESC`, params
  );
  return rows;
}

async function getBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT a.*, f.file_url AS cover_url FROM gallery_albums a
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
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'gallery.albums', recordId: id, description: `Updated album id=${id}` });
  return fetchById(id);
}

async function remove(id, actor) {
  const album = await fetchById(id);
  if (!album) throw httpError('Album not found', 404);
  assertOwnsDept(actor, album.department_id);
  await pool.execute("UPDATE gallery_albums SET status = 'INACTIVE' WHERE id = ?", [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'gallery.albums', recordId: id, description: `Deactivated album id=${id}` });
}

module.exports = { list, getBySlug, create, update, remove };

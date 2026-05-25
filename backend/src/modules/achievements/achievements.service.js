const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };
const COLS = `a.*, d.name AS department_name, f.file_url AS image_url`;
const FROM = `FROM department_achievements a INNER JOIN departments d ON a.department_id = d.id
              LEFT JOIN files f ON a.image_file_id = f.id`;

function assertOwnsDept(actor, deptId) {
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(deptId)) {
    throw httpError('HOD can only manage achievements for their own department', 403);
  }
}

async function fetchById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS} ${FROM} WHERE a.id = ?`, [id]);
  return rows[0] || null;
}

async function list({ department_id, status, all } = {}) {
  const conds = [];
  const params = [];
  if (department_id) { conds.push('a.department_id = ?'); params.push(parseInt(department_id)); }
  if (status)        { conds.push('a.status = ?'); params.push(status); }
  else if (!all)     { conds.push("a.status = 'PUBLISHED'"); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT ${COLS} ${FROM} ${where} ORDER BY a.achievement_year DESC, a.id DESC`, params
  );
  return rows;
}

async function getOne(id) {
  const a = await fetchById(id);
  if (!a) throw httpError('Achievement not found', 404);
  return a;
}

async function create(dto, actor) {
  const { department_id, title, description, achievement_year, category, image_file_id, status = 'PUBLISHED' } = dto;
  if (!department_id) throw httpError('department_id is required', 400);
  if (!title || !title.trim()) throw httpError('title is required', 400);
  assertOwnsDept(actor, department_id);
  const [result] = await pool.execute(
    `INSERT INTO department_achievements
       (department_id, title, description, achievement_year, category, image_file_id, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [department_id, title.trim(), description || null, achievement_year || null,
     category || null, image_file_id || null, status, actor.id]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'achievements', recordId: result.insertId,
    description: `Created achievement "${title.trim()}"` });
  return fetchById(result.insertId);
}

async function update(id, dto, actor) {
  const a = await fetchById(id);
  if (!a) throw httpError('Achievement not found', 404);
  assertOwnsDept(actor, a.department_id);
  const fields = ['title', 'description', 'achievement_year', 'category', 'image_file_id', 'status'];
  const cols = fields.filter((f) => dto[f] !== undefined);
  if (cols.length) {
    await pool.execute(`UPDATE department_achievements SET ${cols.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((f) => dto[f]), id]);
  }
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'achievements', recordId: id, description: `Updated achievement id=${id}` });
  return fetchById(id);
}

async function setStatus(id, status, actor) {
  if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) throw httpError('Invalid status', 400);
  const a = await fetchById(id);
  if (!a) throw httpError('Achievement not found', 404);
  assertOwnsDept(actor, a.department_id);
  await pool.execute('UPDATE department_achievements SET status = ? WHERE id = ?', [status, id]);
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'achievements', recordId: id, description: `Status→${status} id=${id}` });
  return fetchById(id);
}

async function remove(id, actor) {
  const a = await fetchById(id);
  if (!a) throw httpError('Achievement not found', 404);
  assertOwnsDept(actor, a.department_id);
  await pool.execute("UPDATE department_achievements SET status = 'ARCHIVED' WHERE id = ?", [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'achievements', recordId: id, description: `Archived achievement id=${id}` });
}

module.exports = { list, getOne, create, update, setStatus, remove };

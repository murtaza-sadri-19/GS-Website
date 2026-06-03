const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');
const COLS = `l.*, d.name AS department_name, f.file_url AS image_url`;
const FROM = `FROM labs l INNER JOIN departments d ON l.department_id = d.id
              LEFT JOIN files f ON l.image_file_id = f.id`;

function assertOwnsDept(actor, deptId) {
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(deptId)) {
    throw httpError('HOD can only manage labs for their own department', 403);
  }
}

async function fetchById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS} ${FROM} WHERE l.id = ?`, [id]);
  return rows[0] || null;
}

async function list({ department_id, include_inactive } = {}) {
  const conds = [];
  const params = [];
  if (!include_inactive) conds.push('l.is_active = 1');
  if (department_id) { conds.push('l.department_id = ?'); params.push(parseInt(department_id)); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT ${COLS} ${FROM} ${where} ORDER BY l.name ASC`, params);
  return rows;
}

async function getOne(id) {
  const lab = await fetchById(id);
  if (!lab) throw httpError('Lab not found', 404);
  return lab;
}

async function create(dto, actor) {
  const { department_id, name, description, equipment_list, incharge, capacity, image_file_id } = dto;
  if (!department_id) throw httpError('department_id is required', 400);
  if (!name || !name.trim()) throw httpError('name is required', 400);
  assertOwnsDept(actor, department_id);
  const [result] = await pool.execute(
    `INSERT INTO labs (department_id, name, description, equipment_list, incharge, capacity, image_file_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [department_id, name.trim(), description || null, equipment_list || null,
     incharge || null, capacity || null, image_file_id || null, actor.id]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'labs', recordId: result.insertId,
    description: `Created lab "${name.trim()}"` });
  return fetchById(result.insertId);
}

async function update(id, dto, actor) {
  const lab = await fetchById(id);
  if (!lab) throw httpError('Lab not found', 404);
  assertOwnsDept(actor, lab.department_id);
  const fields = ['name', 'description', 'equipment_list', 'incharge', 'capacity', 'image_file_id', 'is_active'];
  const cols = fields.filter((f) => dto[f] !== undefined);
  if (cols.length) {
    await pool.execute(`UPDATE labs SET ${cols.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((f) => dto[f]), id]);
  }
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'labs', recordId: id, description: `Updated lab id=${id}` });
  return fetchById(id);
}

async function remove(id, actor) {
  const lab = await fetchById(id);
  if (!lab) throw httpError('Lab not found', 404);
  assertOwnsDept(actor, lab.department_id);
  await pool.execute('UPDATE labs SET is_active = 0 WHERE id = ?', [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'labs', recordId: id, description: `Deactivated lab id=${id}` });
}

module.exports = { list, getOne, create, update, remove };

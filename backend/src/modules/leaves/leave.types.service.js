/**
 * Leave Types — CRUD
 */
const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { httpError } = require('../../utils/errors');

async function list() {
  const [rows] = await pool.execute(
    'SELECT * FROM leave_types ORDER BY name ASC'
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.execute('SELECT * FROM leave_types WHERE id = ?', [id]);
  if (!rows[0]) throw httpError('Leave type not found', 404);
  return rows[0];
}

async function create(dto, actor) {
  const { name, code, description = null, color = '#0b2545', is_active = 1 } = dto;
  if (!name?.trim()) throw httpError('name is required', 400);
  if (!code?.trim()) throw httpError('code is required', 400);

  const [result] = await pool.execute(
    'INSERT INTO leave_types (name, code, description, color, is_active) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), code.trim().toUpperCase(), description, color, is_active ? 1 : 0]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'leave_types', recordId: result.insertId,
    description: `Created leave type "${name}" (${code})` });
  return getById(result.insertId);
}

async function update(id, dto, actor) {
  const existing = await getById(id);
  const name       = dto.name        !== undefined ? dto.name.trim()        : existing.name;
  const code       = dto.code        !== undefined ? dto.code.trim().toUpperCase() : existing.code;
  const description = dto.description !== undefined ? dto.description       : existing.description;
  const color      = dto.color       !== undefined ? dto.color              : existing.color;
  const is_active  = dto.is_active   !== undefined ? (dto.is_active ? 1 : 0) : existing.is_active;

  await pool.execute(
    'UPDATE leave_types SET name = ?, code = ?, description = ?, color = ?, is_active = ? WHERE id = ?',
    [name, code, description, color, is_active, id]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'leave_types', recordId: id,
    description: `Updated leave type id=${id}` });
  return getById(id);
}

async function remove(id, actor) {
  await getById(id); // throws 404 if not found
  // Check if any policies depend on this type
  const [pols] = await pool.execute('SELECT COUNT(*) AS cnt FROM leave_policies WHERE leave_type_id = ?', [id]);
  if (pols[0].cnt > 0) throw httpError('Cannot delete: leave type has active policies. Remove policies first.', 409);

  await pool.execute('DELETE FROM leave_types WHERE id = ?', [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'leave_types', recordId: id,
    description: `Deleted leave type id=${id}` });
}

module.exports = { list, getById, create, update, remove };

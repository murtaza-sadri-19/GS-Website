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
  const newValues = {
    name: dto.name !== undefined ? dto.name : lab.name,
    description: dto.description !== undefined ? dto.description : lab.description,
    equipment_list: dto.equipment_list !== undefined ? dto.equipment_list : lab.equipment_list,
    incharge: dto.incharge !== undefined ? dto.incharge : lab.incharge,
    capacity: dto.capacity !== undefined ? dto.capacity : lab.capacity,
    image_file_id: dto.image_file_id !== undefined ? dto.image_file_id : lab.image_file_id,
    is_active: dto.is_active !== undefined ? dto.is_active : lab.is_active,
  };

  const changed = [];
  if (newValues.name !== lab.name) changed.push('name');
  if (newValues.description !== lab.description) changed.push('description');
  if (newValues.equipment_list !== lab.equipment_list) changed.push('equipment_list');
  if (newValues.incharge !== lab.incharge) changed.push('incharge');
  if (newValues.capacity !== lab.capacity) changed.push('capacity');
  if (String(newValues.image_file_id) !== String(lab.image_file_id)) changed.push('image_file_id');
  if (String(newValues.is_active) !== String(lab.is_active)) changed.push('is_active');

  const oldValue = {};
  const newValue = {};
  if (changed.includes('name'))           { oldValue.name = lab.name; newValue.name = newValues.name; }
  if (changed.includes('description'))    { oldValue.description = lab.description; newValue.description = newValues.description; }
  if (changed.includes('equipment_list')) { oldValue.equipment_list = lab.equipment_list; newValue.equipment_list = newValues.equipment_list; }
  if (changed.includes('incharge'))       { oldValue.incharge = lab.incharge; newValue.incharge = newValues.incharge; }
  if (changed.includes('capacity'))       { oldValue.capacity = lab.capacity; newValue.capacity = newValues.capacity; }
  if (changed.includes('image_file_id'))  { oldValue.image_file_id = lab.image_file_id; newValue.image_file_id = newValues.image_file_id; }
  if (changed.includes('is_active'))      { oldValue.is_active = lab.is_active; newValue.is_active = newValues.is_active; }

  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'labs', recordId: id, description: `Updated lab id=${id}`,
    changedFields: changed.length ? changed : null,
    oldValue: changed.length ? oldValue : null,
    newValue: changed.length ? newValue : null,
  });
  return fetchById(id);
}

async function remove(id, actor) {
  const lab = await fetchById(id);
  if (!lab) throw httpError('Lab not found', 404);
  assertOwnsDept(actor, lab.department_id);
  await pool.execute('UPDATE labs SET is_active = 0 WHERE id = ?', [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'labs', recordId: id, description: `Deactivated lab id=${id}`,
    changedFields: ['is_active'],
    oldValue: { is_active: lab.is_active },
    newValue: { is_active: 0 },
  });
}

module.exports = { list, getOne, create, update, remove };

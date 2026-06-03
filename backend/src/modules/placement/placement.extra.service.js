/**
 * Structured placement entities — companies / drives / internships / yearly stats.
 * Table-driven CRUD (table + columns from internal whitelist, values parameterized).
 */
const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

const RESOURCES = {
  companies: {
    table: 'companies',
    fields: ['name', 'sector', 'website', 'logo_file_id', 'contact_email', 'contact_phone', 'is_active'],
    required: ['name'], order: 'name ASC', createdBy: false,
  },
  drives: {
    table: 'placement_drives',
    fields: ['company_id', 'title', 'job_title', 'ctc_lpa', 'eligibility', 'drive_date', 'registration_deadline', 'is_active'],
    required: ['title'], order: 'drive_date DESC, id DESC', createdBy: true,
  },
  internships: {
    table: 'internships',
    fields: ['company_id', 'student_enrollment_no', 'student_name', 'title', 'duration_months', 'stipend', 'start_date', 'end_date', 'status', 'report_file_id'],
    required: ['title'], order: 'start_date DESC, id DESC', createdBy: true,
  },
};

function cfg(resource) {
  const c = RESOURCES[resource];
  if (!c) throw httpError(`Unknown placement resource '${resource}'`, 400);
  return c;
}

async function list(resource) {
  const c = cfg(resource);
  const [rows] = await pool.execute(`SELECT * FROM ${c.table} ORDER BY ${c.order}`);
  return rows;
}

async function create(resource, dto, actor) {
  const c = cfg(resource);
  for (const r of c.required) {
    if (dto[r] === undefined || String(dto[r]).trim() === '') throw httpError(`${r} is required`, 400);
  }
  const cols = c.fields.filter((f) => dto[f] !== undefined);
  const allCols = [...cols, ...(c.createdBy ? ['created_by'] : [])];
  const values = [...cols.map((f) => dto[f]), ...(c.createdBy ? [actor.id] : [])];
  const [result] = await pool.execute(
    `INSERT INTO ${c.table} (${allCols.join(', ')}) VALUES (${allCols.map(() => '?').join(', ')})`,
    values
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: `placement.${resource}`, recordId: result.insertId,
    description: `Created ${resource} id=${result.insertId}` });
  const [rows] = await pool.execute(`SELECT * FROM ${c.table} WHERE id = ?`, [result.insertId]);
  return rows[0];
}

async function update(resource, id, dto, actor) {
  const c = cfg(resource);
  const [exist] = await pool.execute(`SELECT id FROM ${c.table} WHERE id = ?`, [id]);
  if (!exist[0]) throw httpError(`${resource} not found`, 404);
  const cols = c.fields.filter((f) => dto[f] !== undefined);
  if (!cols.length) throw httpError('No updatable fields provided', 400);
  await pool.execute(`UPDATE ${c.table} SET ${cols.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`,
    [...cols.map((f) => dto[f]), id]);
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: `placement.${resource}`, recordId: id,
    description: `Updated ${resource} id=${id}` });
  const [rows] = await pool.execute(`SELECT * FROM ${c.table} WHERE id = ?`, [id]);
  return rows[0];
}

async function remove(resource, id, actor) {
  const c = cfg(resource);
  const [result] = await pool.execute(`DELETE FROM ${c.table} WHERE id = ?`, [id]);
  if (result.affectedRows === 0) throw httpError(`${resource} not found`, 404);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: `placement.${resource}`, recordId: id,
    description: `Deleted ${resource} id=${id}` });
}

// ── Yearly stats (upsert by academic_year) ────────────────────────────────────
async function listStats() {
  const [rows] = await pool.execute('SELECT * FROM placement_year_stats ORDER BY academic_year DESC');
  return rows;
}

async function upsertStats(dto, actor) {
  const { academic_year, total_students, students_placed, placement_pct,
          highest_package, average_package, companies_visited } = dto;
  if (!academic_year) throw httpError('academic_year is required', 400);
  await pool.execute(
    `INSERT INTO placement_year_stats
       (academic_year, total_students, students_placed, placement_pct, highest_package, average_package, companies_visited)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       total_students=VALUES(total_students), students_placed=VALUES(students_placed),
       placement_pct=VALUES(placement_pct), highest_package=VALUES(highest_package),
       average_package=VALUES(average_package), companies_visited=VALUES(companies_visited)`,
    [academic_year, total_students ?? null, students_placed ?? null, placement_pct ?? null,
     highest_package ?? null, average_package ?? null, companies_visited ?? null]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'placement.stats', description: `Upserted stats ${academic_year}` });
  const [rows] = await pool.execute('SELECT * FROM placement_year_stats WHERE academic_year = ?', [academic_year]);
  return rows[0];
}

module.exports = { list, create, update, remove, listStats, upsertStats };

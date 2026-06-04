/**
 * Faculty content sub-resources — publications / research / qualifications.
 *
 * Table-driven so all three share one safe implementation. `table` and column
 * names come from the internal RESOURCES whitelist (never user input); values
 * are always parameterized. Every row is scoped by `faculty_id`, which is how
 * ownership is enforced — a TEACHER may only touch rows under their own profile.
 */
const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

const RESOURCES = {
  publications: {
    table: 'faculty_publications',
    fields: ['title', 'venue_type', 'journal_name', 'publication_year', 'authors', 'link', 'citations', 'status'],
    required: ['title'],
    order: 'publication_year DESC, id DESC',
  },
  research: {
    table: 'faculty_research',
    fields: ['title', 'research_area', 'description', 'start_year', 'end_year', 'status', 'funding_agency', 'funding_amount'],
    required: ['title'],
    order: 'start_year DESC, id DESC',
  },
  qualifications: {
    table: 'faculty_qualifications',
    fields: ['degree', 'institution', 'year', 'specialization'],
    required: ['degree', 'institution'],
    order: 'year DESC, id DESC',
  },
};

function cfg(resource) {
  const c = RESOURCES[resource];
  if (!c) throw httpError(`Unknown faculty resource '${resource}'`, 400);
  return c;
}

/**
 * Resolve the faculty_profiles.id for a TEACHER user.
 * Auto-provisions a minimal profile row on first write if one doesn't exist,
 * so a newly created TEACHER account can immediately add content.
 */
async function facultyIdForUser(userId, { autoProvision = false } = {}) {
  const [rows] = await pool.execute('SELECT id FROM faculty_profiles WHERE user_id = ?', [userId]);
  if (rows[0]) return rows[0].id;

  if (!autoProvision) {
    throw httpError('No faculty profile exists for this account. Ask an admin or HOD to create your profile first.', 404);
  }

  // Auto-provision: need the user's department_id to satisfy the FK
  const [uRows] = await pool.execute(
    'SELECT id, name, department_id FROM users WHERE id = ?',
    [userId]
  );
  const user = uRows[0];
  if (!user) throw httpError('User not found', 404);
  if (!user.department_id) {
    throw httpError('Cannot create faculty profile: your account has no department assigned. Contact admin.', 400);
  }

  const [result] = await pool.execute(
    `INSERT INTO faculty_profiles (user_id, department_id, designation, status)
     VALUES (?, ?, 'Faculty', 'ACTIVE')`,
    [userId, user.department_id]
  );
  await writeAudit({
    userId,
    action: 'CREATE',
    module: 'faculty',
    recordId: result.insertId,
    description: `Auto-provisioned faculty profile for user id=${userId} (dept=${user.department_id})`,
  });
  return result.insertId;
}

async function listByFacultyId(resource, facultyId) {
  const c = cfg(resource);
  const [rows] = await pool.execute(
    `SELECT * FROM ${c.table} WHERE faculty_id = ? ORDER BY ${c.order}`,
    [facultyId]
  );
  return rows;
}

async function listForUser(resource, userId) {
  // If no profile exists yet, return empty list — not a 404.
  // A newly-onboarded teacher hasn't done anything wrong.
  const [rows] = await pool.execute('SELECT id FROM faculty_profiles WHERE user_id = ?', [userId]);
  if (!rows[0]) return [];
  return listByFacultyId(resource, rows[0].id);
}

async function create(resource, userId, dto, actor) {
  const c = cfg(resource);
  const facultyId = await facultyIdForUser(userId, { autoProvision: true });

  for (const r of c.required) {
    if (dto[r] === undefined || dto[r] === null || String(dto[r]).trim() === '') {
      throw httpError(`${r} is required`, 400);
    }
  }

  const cols = c.fields.filter((f) => dto[f] !== undefined);
  const placeholders = ['?', ...cols.map(() => '?')];
  const values = [facultyId, ...cols.map((f) => dto[f])];

  const [result] = await pool.execute(
    `INSERT INTO ${c.table} (faculty_id${cols.length ? ', ' + cols.join(', ') : ''})
     VALUES (${placeholders.join(', ')})`,
    values
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: `faculty.${resource}`, recordId: result.insertId,
    description: `Created ${resource} id=${result.insertId} for faculty=${facultyId}` });

  const [rows] = await pool.execute(`SELECT * FROM ${c.table} WHERE id = ?`, [result.insertId]);
  return rows[0];
}

async function update(resource, userId, itemId, dto, actor) {
  const c = cfg(resource);
  const facultyId = await facultyIdForUser(userId);

  // Ownership: the row must belong to this faculty profile
  const [own] = await pool.execute(`SELECT id FROM ${c.table} WHERE id = ? AND faculty_id = ?`, [itemId, facultyId]);
  if (!own[0]) throw httpError(`${resource} item not found`, 404);

  const cols = c.fields.filter((f) => dto[f] !== undefined);
  if (cols.length === 0) throw httpError('No updatable fields provided', 400);

  await pool.execute(
    `UPDATE ${c.table} SET ${cols.map((f) => `${f} = ?`).join(', ')} WHERE id = ? AND faculty_id = ?`,
    [...cols.map((f) => dto[f]), itemId, facultyId]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: `faculty.${resource}`, recordId: itemId,
    description: `Updated ${resource} id=${itemId}` });

  const [rows] = await pool.execute(`SELECT * FROM ${c.table} WHERE id = ?`, [itemId]);
  return rows[0];
}

async function remove(resource, userId, itemId, actor) {
  const c = cfg(resource);
  const facultyId = await facultyIdForUser(userId);
  const [result] = await pool.execute(`DELETE FROM ${c.table} WHERE id = ? AND faculty_id = ?`, [itemId, facultyId]);
  if (result.affectedRows === 0) throw httpError(`${resource} item not found`, 404);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: `faculty.${resource}`, recordId: itemId,
    description: `Deleted ${resource} id=${itemId}` });
}

module.exports = { listByFacultyId, listForUser, create, update, remove };

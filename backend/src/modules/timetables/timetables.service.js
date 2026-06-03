const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

async function fetchTimetable(id) {
  const [rows] = await pool.execute('SELECT * FROM timetables WHERE id = ?', [id]);
  return rows[0] || null;
}

async function fetchWithEntries(id) {
  const tt = await fetchTimetable(id);
  if (!tt) return null;
  const [entries] = await pool.execute(
    `SELECT te.*, u.name AS faculty_name
       FROM timetable_entries te
       LEFT JOIN users u ON te.faculty_user_id = u.id
      WHERE te.timetable_id = ?
      ORDER BY FIELD(te.day_of_week,'Mon','Tue','Wed','Thu','Fri','Sat'), te.period_no`,
    [id]
  );
  return { ...tt, entries };
}

function assertOwnsDept(actor, deptId) {
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(deptId)) {
    throw httpError('HOD can only manage timetables for their own department', 403);
  }
}

async function list({ department_id, section_id, semester, academic_year } = {}) {
  const conds = ['t.is_active = 1'];
  const params = [];
  if (department_id) { conds.push('t.department_id = ?'); params.push(parseInt(department_id)); }
  if (section_id)    { conds.push('t.section_id = ?');    params.push(parseInt(section_id)); }
  if (semester)      { conds.push('t.semester = ?');      params.push(parseInt(semester)); }
  if (academic_year) { conds.push('t.academic_year = ?'); params.push(academic_year); }
  const [rows] = await pool.execute(
    `SELECT t.*, d.name AS department_name FROM timetables t
       INNER JOIN departments d ON t.department_id = d.id
      WHERE ${conds.join(' AND ')} ORDER BY t.created_at DESC`,
    params
  );
  return rows;
}

async function getOne(id) {
  const tt = await fetchWithEntries(id);
  if (!tt) throw httpError('Timetable not found', 404);
  return tt;
}

// Teacher's own teaching slots across all timetables
async function listMine(actor) {
  const [rows] = await pool.execute(
    `SELECT te.*, t.department_id, t.semester, t.section_id, t.academic_year
       FROM timetable_entries te
       INNER JOIN timetables t ON te.timetable_id = t.id
      WHERE te.faculty_user_id = ?
      ORDER BY FIELD(te.day_of_week,'Mon','Tue','Wed','Thu','Fri','Sat'), te.period_no`,
    [actor.id]
  );
  return rows;
}

async function create(dto, actor) {
  const { department_id, course_id, section_id, semester, academic_year, title } = dto;
  if (!department_id) throw httpError('department_id is required', 400);
  assertOwnsDept(actor, department_id);
  const [result] = await pool.execute(
    `INSERT INTO timetables (department_id, course_id, section_id, semester, academic_year, title, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [department_id, course_id || null, section_id || null, semester || null,
     academic_year || null, title || null, actor.id]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'timetables', recordId: result.insertId,
    description: `Created timetable id=${result.insertId} for dept=${department_id}` });
  return fetchWithEntries(result.insertId);
}

async function update(id, dto, actor) {
  const tt = await fetchTimetable(id);
  if (!tt) throw httpError('Timetable not found', 404);
  assertOwnsDept(actor, tt.department_id);

  const fields = ['course_id', 'section_id', 'semester', 'academic_year', 'title', 'is_active'];
  const cols = fields.filter((f) => dto[f] !== undefined);
  if (cols.length) {
    await pool.execute(
      `UPDATE timetables SET ${cols.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`,
      [...cols.map((f) => dto[f]), id]
    );
  }
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'timetables', recordId: id,
    description: `Updated timetable id=${id}` });
  return fetchWithEntries(id);
}

// Replace all entries for a timetable (HOD edits the grid as a whole)
async function replaceEntries(id, entries, actor) {
  const tt = await fetchTimetable(id);
  if (!tt) throw httpError('Timetable not found', 404);
  assertOwnsDept(actor, tt.department_id);
  if (!Array.isArray(entries)) throw httpError('entries must be an array', 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM timetable_entries WHERE timetable_id = ?', [id]);
    for (const e of entries) {
      if (!e.day_of_week || e.period_no === undefined) continue;
      await conn.execute(
        `INSERT INTO timetable_entries
           (timetable_id, day_of_week, period_no, subject_label, faculty_user_id, room, start_time, end_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, e.day_of_week, e.period_no, e.subject_label || null, e.faculty_user_id || null,
         e.room || null, e.start_time || null, e.end_time || null]
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'timetables', recordId: id,
    description: `Replaced ${entries.length} entries on timetable id=${id}` });
  return fetchWithEntries(id);
}

async function remove(id, actor) {
  const tt = await fetchTimetable(id);
  if (!tt) throw httpError('Timetable not found', 404);
  assertOwnsDept(actor, tt.department_id);
  await pool.execute('DELETE FROM timetables WHERE id = ?', [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'timetables', recordId: id,
    description: `Deleted timetable id=${id}` });
}

module.exports = { list, getOne, listMine, create, update, replaceEntries, remove };

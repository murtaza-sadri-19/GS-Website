/**
 * Placement Student Offers Controller
 * Handles individual student placement offer records (placement_student_offers table).
 */
const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { success, error } = require('../../utils/response');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

async function list(req, res, next) {
  try {
    const { page = 1, pageSize = 100, academic_year, branch, q } = req.query;
    const pg   = Math.max(1, parseInt(page) || 1);
    const ps   = Math.min(200, Math.max(1, parseInt(pageSize) || 100));
    const offset = (pg - 1) * ps;

    const conds = [];
    const params = [];
    if (academic_year) { conds.push('academic_year = ?'); params.push(academic_year); }
    if (branch)        { conds.push('branch = ?');        params.push(branch); }
    if (q && q.trim()) {
      conds.push('(student_name LIKE ? OR enrollment_no LIKE ? OR company_name LIKE ?)');
      const like = `%${q.trim()}%`;
      params.push(like, like, like);
    }
    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

    const [[rows], [countRows]] = await Promise.all([
      pool.execute(
        `SELECT pso.*, u.name AS created_by_name
         FROM placement_student_offers pso
         INNER JOIN users u ON pso.created_by = u.id
         ${where}
         ORDER BY pso.created_at DESC
         LIMIT ${ps} OFFSET ${offset}`,
        params
      ),
      pool.execute(`SELECT COUNT(*) AS total FROM placement_student_offers ${where}`, params),
    ]);

    const total = countRows[0].total;
    return success(res, 'Offers fetched', {
      offers: rows,
      pagination: { total, page: pg, pageSize: ps, totalPages: Math.ceil(total / ps) },
    });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { student_name, enrollment_no, branch, company_name, ctc_lpa, academic_year, offer_status, offer_date } = req.body;

    if (!student_name?.trim()) throw httpError('student_name is required', 400);
    if (!enrollment_no?.trim()) throw httpError('enrollment_no is required', 400);
    if (!company_name?.trim()) throw httpError('company_name is required', 400);

    const [result] = await pool.execute(
      `INSERT INTO placement_student_offers
         (student_name, enrollment_no, branch, company_name, ctc_lpa, academic_year, offer_status, offer_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_name.trim(),
        enrollment_no.trim(),
        branch?.trim() || null,
        company_name.trim(),
        ctc_lpa ? parseFloat(ctc_lpa) : null,
        academic_year?.trim() || null,
        offer_status || 'Placed',
        offer_date || null,
        req.user.id,
      ]
    );

    await writeAudit({
      userId: req.user.id, action: 'CREATE', module: 'placement_offers',
      recordId: result.insertId,
      description: `Created offer for ${student_name.trim()} at ${company_name.trim()}`,
    });

    const [[newRow]] = await pool.execute(
      'SELECT * FROM placement_student_offers WHERE id = ?', [result.insertId]
    );
    return success(res, 'Offer created', newRow, 201);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (!id) throw httpError('Invalid id', 400);

    const [[row]] = await pool.execute('SELECT * FROM placement_student_offers WHERE id = ?', [id]);
    if (!row) throw httpError('Offer not found', 404);

    await pool.execute('DELETE FROM placement_student_offers WHERE id = ?', [id]);
    await writeAudit({
      userId: req.user.id, action: 'DELETE', module: 'placement_offers',
      recordId: id,
      description: `Deleted offer for ${row.student_name} at ${row.company_name}`,
    });

    return success(res, 'Offer deleted', null);
  } catch (err) { next(err); }
}

module.exports = { list, create, remove };

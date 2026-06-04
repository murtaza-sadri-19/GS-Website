/**
 * Leave Balance — computed dynamically from policies + approved leave requests.
 *
 * GET /leaves/balance         — own balance for TEACHER/HOD
 * GET /leaves/balance/:userId — HOD sees any teacher in their dept; ADMIN sees anyone
 *
 * Algorithm:
 *   allocated = policy.max_days for (role, dept_or_null, academic_year)
 *   consumed  = SUM(days_count) of approved leave_requests in that academic year
 *   remaining = allocated - consumed
 */
const pool = require('../../config/db');
const { httpError } = require('../../utils/errors');
const { currentAcademicYear } = require('./leave.policies.service');

async function getBalance(userId, deptId, role, academicYear) {
  const year = academicYear || currentAcademicYear();

  /*
   * For each active leave type, find the best-matching policy:
   *   1. Department-specific policy (department_id = deptId) for this role/year
   *   2. Global policy (department_id IS NULL) for this role/year
   *   3. Global TEACHER policy as fallback for HOD
   * Then compute consumed days from approved leave_requests.
   */
  const [rows] = await pool.execute(`
    SELECT
      lt.id              AS leave_type_id,
      lt.name            AS leave_type,
      lt.code,
      lt.color,
      lt.is_active,
      COALESCE(
        (SELECT max_days FROM leave_policies
          WHERE leave_type_id = lt.id AND role = ? AND department_id = ? AND academic_year = ?
          LIMIT 1),
        (SELECT max_days FROM leave_policies
          WHERE leave_type_id = lt.id AND role = ? AND department_id IS NULL AND academic_year = ?
          LIMIT 1),
        0
      ) AS allocated,
      COALESCE(
        (SELECT requires_attachment FROM leave_policies
          WHERE leave_type_id = lt.id AND role = ? AND department_id = ? AND academic_year = ?
          LIMIT 1),
        (SELECT requires_attachment FROM leave_policies
          WHERE leave_type_id = lt.id AND role = ? AND department_id IS NULL AND academic_year = ?
          LIMIT 1),
        0
      ) AS requires_attachment,
      COALESCE(
        (SELECT SUM(lr.days_count)
          FROM leave_requests lr
          WHERE lr.user_id = ?
            AND lr.status = 'approved'
            AND (lr.leave_type_id = lt.id OR lr.leave_type = lt.name)
            AND lr.academic_year = ?
        ), 0
      ) AS consumed
    FROM leave_types lt
    WHERE lt.is_active = 1
    ORDER BY lt.name ASC
  `, [
    role, deptId, year,      // dept-specific policy lookup
    role, year,              // global policy fallback
    role, deptId, year,      // dept-specific attachment rule
    role, year,              // global attachment rule fallback
    userId, year,            // consumed calculation
  ]);

  return rows
    .filter(r => Number(r.allocated) > 0)  // only show types with a policy
    .map(r => ({
      leave_type_id:      r.leave_type_id,
      leave_type:         r.leave_type,
      code:               r.code,
      color:              r.color,
      requires_attachment: !!r.requires_attachment,
      allocated:          Number(r.allocated),
      consumed:           Number(r.consumed),
      remaining:          Math.max(0, Number(r.allocated) - Number(r.consumed)),
      academic_year:      year,
    }));
}

async function getBalanceForUser(targetUserId, actor) {
  // Resolve target user's role and dept
  const [uRows] = await pool.execute(
    `SELECT u.id, u.department_id, r.role_name AS role
     FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
    [targetUserId]
  );
  const target = uRows[0];
  if (!target) throw httpError('User not found', 404);

  // HOD: can only see teachers in own dept
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(target.department_id)) {
    throw httpError('HOD can only view leave balance for their own department faculty', 403);
  }

  return getBalance(target.id, target.department_id, target.role, null);
}

module.exports = { getBalance, getBalanceForUser };

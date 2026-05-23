const pool = require('../../config/db');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const AUDIT_COLS = `
  al.id, al.user_id, al.action, al.module_name, al.record_id,
  al.description, al.ip_address, al.created_at,
  u.name AS user_name, u.email AS user_email
`;

const FROM_CLAUSE = `
  FROM audit_logs al
  INNER JOIN users u ON al.user_id = u.id
`;

async function listLogs({ page = 1, pageSize = 50, user_id, action, module_name } = {}) {
  page     = Math.max(1, parseInt(page)     || 1);
  pageSize = Math.min(200, Math.max(1, parseInt(pageSize) || 50));
  const offset = (page - 1) * pageSize;

  const conditions = [];
  const params     = [];

  if (user_id) {
    conditions.push('al.user_id = ?');
    params.push(parseInt(user_id));
  }
  if (action) {
    conditions.push('al.action = ?');
    params.push(action);
  }
  if (module_name) {
    conditions.push('al.module_name = ?');
    params.push(module_name);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${AUDIT_COLS} ${FROM_CLAUSE} ${where} ORDER BY al.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM audit_logs al ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    logs: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getLog(id) {
  const [rows] = await pool.execute(
    `SELECT ${AUDIT_COLS} ${FROM_CLAUSE} WHERE al.id = ?`,
    [id]
  );
  const log = rows[0];
  if (!log) throw httpError('Audit log entry not found', 404);
  return log;
}

async function getLogsByUser(userId, { page = 1, pageSize = 50 } = {}) {
  page     = Math.max(1, parseInt(page)     || 1);
  pageSize = Math.min(200, Math.max(1, parseInt(pageSize) || 50));
  const offset = (page - 1) * pageSize;

  // Verify user exists
  const [userRows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [userId]);
  if (!userRows[0]) throw httpError('User not found', 404);

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${AUDIT_COLS} ${FROM_CLAUSE} WHERE al.user_id = ? ORDER BY al.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      [userId]
    ),
    pool.execute(
      'SELECT COUNT(*) AS total FROM audit_logs al WHERE al.user_id = ?',
      [userId]
    ),
  ]);

  const total = countRows[0].total;
  return {
    user: userRows[0],
    logs: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

module.exports = { listLogs, getLog, getLogsByUser };

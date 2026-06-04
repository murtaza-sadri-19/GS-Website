const pool = require('../../config/db');
const { httpError } = require('../../utils/errors');

const AUDIT_COLS = `
  al.id, al.user_id, al.action, al.module_name, al.entity_name, al.record_id,
  al.description, al.old_value, al.new_value, al.changed_fields, al.severity,
  al.ip_address, al.user_agent, al.browser, al.os, al.device,
  al.request_url, al.request_method, al.session_id, al.status,
  al.created_at,
  u.name AS user_name, u.email AS user_email,
  r.role_name AS user_role
`;

const FROM_CLAUSE = `
  FROM audit_logs al
  INNER JOIN users u ON al.user_id = u.id
  INNER JOIN roles r ON u.role_id = r.id
`;

async function listLogs({
  page = 1, pageSize = 50,
  user_id, action, module_name, severity, status, ip_address, role,
  search, date_from, date_to,
} = {}) {
  page     = Math.max(1, parseInt(page)     || 1);
  pageSize = Math.min(200, Math.max(1, parseInt(pageSize) || 50));
  const offset = (page - 1) * pageSize;

  const conditions = [];
  const params     = [];

  if (user_id)     { conditions.push('al.user_id = ?');      params.push(parseInt(user_id)); }
  if (action)      { conditions.push('al.action = ?');        params.push(action);            }
  if (module_name) { conditions.push('al.module_name = ?');   params.push(module_name);       }
  if (severity)    { conditions.push('al.severity = ?');      params.push(severity);          }
  if (status)      { conditions.push('al.status = ?');        params.push(status);            }
  if (ip_address)  { conditions.push('al.ip_address = ?');    params.push(ip_address);        }
  if (role)        { conditions.push('r.role_name = ?');       params.push(role);             }
  if (date_from)   { conditions.push('al.created_at >= ?');   params.push(new Date(date_from)); }
  if (date_to)     {
    const to = new Date(date_to);
    to.setHours(23, 59, 59, 999);
    conditions.push('al.created_at <= ?');
    params.push(to);
  }
  if (search) {
    conditions.push('(al.description LIKE ? OR al.entity_name LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR al.ip_address LIKE ?)');
    const q = `%${search}%`;
    params.push(q, q, q, q, q);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${AUDIT_COLS} ${FROM_CLAUSE} ${where} ORDER BY al.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM audit_logs al INNER JOIN users u ON al.user_id = u.id INNER JOIN roles r ON u.role_id = r.id ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    logs: rows.map(parseJsonFields),
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
  return parseJsonFields(log);
}

async function getLogsByUser(userId, { page = 1, pageSize = 50 } = {}) {
  page     = Math.max(1, parseInt(page)     || 1);
  pageSize = Math.min(200, Math.max(1, parseInt(pageSize) || 50));
  const offset = (page - 1) * pageSize;

  const [userRows] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [userId]);
  if (!userRows[0]) throw httpError('User not found', 404);

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${AUDIT_COLS} ${FROM_CLAUSE} WHERE al.user_id = ? ORDER BY al.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      [userId]
    ),
    pool.execute('SELECT COUNT(*) AS total FROM audit_logs al WHERE al.user_id = ?', [userId]),
  ]);

  const total = countRows[0].total;
  return {
    user: userRows[0],
    logs: rows.map(parseJsonFields),
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

// Returns distinct values for filter dropdowns
async function getFilterOptions() {
  const [[actions], [modules], [severities], [statuses], [roles]] = await Promise.all([
    pool.execute('SELECT DISTINCT action FROM audit_logs ORDER BY action'),
    pool.execute('SELECT DISTINCT module_name FROM audit_logs ORDER BY module_name'),
    pool.execute("SELECT DISTINCT severity FROM audit_logs ORDER BY FIELD(severity,'low','medium','high','critical')"),
    pool.execute("SELECT DISTINCT status FROM audit_logs WHERE status IS NOT NULL ORDER BY status"),
    pool.execute(
      `SELECT DISTINCT r.role_name
       FROM audit_logs al
       INNER JOIN users u ON al.user_id = u.id
       INNER JOIN roles r ON u.role_id = r.id
       ORDER BY r.role_name`
    ),
  ]);
  return {
    actions:    actions.map(r => r.action),
    modules:    modules.map(r => r.module_name),
    severities: severities.map(r => r.severity),
    statuses:   statuses.map(r => r.status),
    roles:      roles.map(r => r.role_name),
  };
}

// Summary stats for dashboard widget
async function getStats() {
  const now = new Date();
  const last24h = new Date(now - 24 * 60 * 60 * 1000);

  const [[total], [recent], [critical], [failedLogins], topUsers, topModules] = await Promise.all([
    pool.execute('SELECT COUNT(*) AS cnt FROM audit_logs'),
    pool.execute('SELECT COUNT(*) AS cnt FROM audit_logs WHERE created_at >= ?', [last24h]),
    pool.execute("SELECT COUNT(*) AS cnt FROM audit_logs WHERE severity = 'critical'"),
    pool.execute("SELECT COUNT(*) AS cnt FROM audit_logs WHERE action = 'LOGIN' AND status = 'failure'"),
    pool.execute(
      `SELECT u.name, u.id, COUNT(*) AS cnt
       FROM audit_logs al INNER JOIN users u ON al.user_id = u.id
       WHERE al.created_at >= ?
       GROUP BY al.user_id ORDER BY cnt DESC LIMIT 5`,
      [last24h]
    ),
    pool.execute(
      `SELECT module_name, COUNT(*) AS cnt
       FROM audit_logs WHERE created_at >= ?
       GROUP BY module_name ORDER BY cnt DESC LIMIT 5`,
      [last24h]
    ),
  ]);

  return {
    total:        total[0].cnt,
    last24h:      recent[0].cnt,
    critical:     critical[0].cnt,
    failedLogins: failedLogins[0].cnt,
    topUsers:     topUsers[0],
    topModules:   topModules[0],
  };
}

// Recent activity for dashboard (last N logs)
async function getRecentActivity(limit = 15) {
  limit = Math.min(50, Math.max(1, parseInt(limit) || 15));
  const [rows] = await pool.execute(
    `SELECT ${AUDIT_COLS} ${FROM_CLAUSE} ORDER BY al.created_at DESC LIMIT ${limit}`,
    []
  );
  return rows.map(parseJsonFields);
}

function parseJsonFields(log) {
  return {
    ...log,
    old_value:      tryParse(log.old_value),
    new_value:      tryParse(log.new_value),
    changed_fields: tryParse(log.changed_fields),
  };
}

function tryParse(val) {
  if (!val) return null;
  try { return typeof val === 'string' ? JSON.parse(val) : val; } catch { return val; }
}

module.exports = { listLogs, getLog, getLogsByUser, getFilterOptions, getStats, getRecentActivity };

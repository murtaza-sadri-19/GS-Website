const pool = require('../config/db');

/**
 * Write an audit log entry. Never throws — logs the failure and continues.
 *
 * @param {{ userId, action, module, recordId?, description, ipAddress? }} opts
 */
async function writeAudit({ userId, action, module, recordId = null, description, ipAddress = null }) {
  try {
    await pool.execute(
      `INSERT INTO audit_logs (user_id, action, module_name, record_id, description, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, action, module, recordId, description, ipAddress]
    );
  } catch (err) {
    console.error(`Audit log failed [${action}/${module}]:`, err.message);
  }
}

module.exports = writeAudit;

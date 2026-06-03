const pool = require('../config/db');

// Actions that automatically get elevated severity
const CRITICAL_MODULES  = ['settings', 'seo', 'users', 'auth', 'navigation'];
const CRITICAL_ACTIONS  = ['ROLE_CHANGE', 'PERMISSION_CHANGE', 'MASS_DELETE'];
const HIGH_MODULES      = ['homepage', 'pages'];
const HIGH_ACTIONS      = ['DELETE', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_COMPLETE'];

function deriveSeverity(action, module) {
  const a = (action  || '').toUpperCase();
  const m = (module  || '').toLowerCase();
  if (CRITICAL_ACTIONS.includes(a) || CRITICAL_MODULES.includes(m)) return 'critical';
  if (HIGH_ACTIONS.includes(a)     || HIGH_MODULES.includes(m))     return 'high';
  if (['UPDATE', 'PUBLISH', 'UNPUBLISH', 'APPROVE', 'REJECT', 'REPLACE'].includes(a)) return 'medium';
  return 'low';
}

/**
 * Write an audit log entry. Never throws — logs the failure and continues.
 *
 * @param {{
 *   userId:         number,
 *   action:         string,
 *   module:         string,
 *   entityName?:    string,
 *   recordId?:      number|null,
 *   description:    string,
 *   oldValue?:      object|null,
 *   newValue?:      object|null,
 *   changedFields?: string[]|null,
 *   ipAddress?:     string|null,
 *   userAgent?:     string|null,
 *   severity?:      'low'|'medium'|'high'|'critical'
 * }} opts
 */
async function writeAudit({
  userId,
  action,
  module,
  entityName    = null,
  recordId      = null,
  description,
  oldValue      = null,
  newValue      = null,
  changedFields = null,
  ipAddress     = null,
  userAgent     = null,
  severity      = null,
}) {
  try {
    const effectiveSeverity = severity ?? deriveSeverity(action, module);
    await pool.execute(
      `INSERT INTO audit_logs
         (user_id, action, module_name, entity_name, record_id, description,
          old_value, new_value, changed_fields, severity, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        action,
        module,
        entityName,
        recordId,
        description,
        oldValue      ? JSON.stringify(oldValue)      : null,
        newValue      ? JSON.stringify(newValue)       : null,
        changedFields ? JSON.stringify(changedFields)  : null,
        effectiveSeverity,
        ipAddress,
        userAgent,
      ]
    );
  } catch (err) {
    console.error(`Audit log failed [${action}/${module}]:`, err.message);
  }
}

module.exports = writeAudit;

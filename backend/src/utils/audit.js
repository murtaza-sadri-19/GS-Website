const pool = require('../config/db');
const { getRequestContext } = require('./requestContext');

const CRITICAL_MODULES = ['settings', 'seo', 'users', 'auth', 'navigation'];
const CRITICAL_ACTIONS = ['ROLE_CHANGE', 'PERMISSION_CHANGE', 'MASS_DELETE'];
const HIGH_MODULES     = ['homepage', 'pages'];
const HIGH_ACTIONS     = ['DELETE', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_COMPLETE'];

function deriveSeverity(action, module) {
  const a = (action || '').toUpperCase();
  const m = (module || '').toLowerCase();
  if (CRITICAL_ACTIONS.includes(a) || CRITICAL_MODULES.includes(m)) return 'critical';
  if (HIGH_ACTIONS.includes(a)     || HIGH_MODULES.includes(m))     return 'high';
  if (['UPDATE', 'PUBLISH', 'UNPUBLISH', 'APPROVE', 'REJECT', 'REPLACE'].includes(a)) return 'medium';
  return 'low';
}

// Simple regex-based UA parser — no external dependency required
function parseUA(ua) {
  if (!ua) return { browser: null, os: null, device: 'Unknown' };

  // Browser — order matters: Edge before Chrome, Opera before Chrome
  let browser = 'Unknown';
  if      (/Edg\/(\d+)/.test(ua))                    browser = `Edge ${ua.match(/Edg\/(\d+)/)[1]}`;
  else if (/OPR\/(\d+)/.test(ua))                    browser = `Opera ${ua.match(/OPR\/(\d+)/)[1]}`;
  else if (/Chrome\/(\d+)/.test(ua))                  browser = `Chrome ${ua.match(/Chrome\/(\d+)/)[1]}`;
  else if (/Firefox\/(\d+)/.test(ua))                 browser = `Firefox ${ua.match(/Firefox\/(\d+)/)[1]}`;
  else if (/Version\/[\d.]+ Safari/.test(ua))         browser = 'Safari';
  else if (/MSIE|Trident/.test(ua))                   browser = 'Internet Explorer';

  // OS
  let os = 'Unknown';
  if      (/Windows NT 10\.0/.test(ua))               os = 'Windows 10/11';
  else if (/Windows NT 6\.3/.test(ua))                os = 'Windows 8.1';
  else if (/Windows NT 6/.test(ua))                   os = 'Windows';
  else if (/Mac OS X/.test(ua))                       os = 'macOS';
  else if (/Android ([\d.]+)/.test(ua))               os = `Android ${ua.match(/Android ([\d.]+)/)[1]}`;
  else if (/iPhone OS ([\d_]+)/.test(ua))             os = `iOS ${ua.match(/iPhone OS ([\d_]+)/)[1].replace(/_/g, '.')}`;
  else if (/iPad/.test(ua))                           os = 'iPadOS';
  else if (/Linux/.test(ua))                          os = 'Linux';

  // Device
  let device = 'Desktop';
  if      (/iPad/.test(ua))                           device = 'Tablet';
  else if (/Mobile|Android|iPhone|iPod/.test(ua))     device = 'Mobile';

  return { browser, os, device };
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
 *   browser?:       string|null,
 *   os?:            string|null,
 *   device?:        string|null,
 *   requestUrl?:    string|null,
 *   requestMethod?: string|null,
 *   sessionId?:     string|null,
 *   status?:        'success'|'failure',
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
  browser       = null,
  os            = null,
  device        = null,
  requestUrl    = null,
  requestMethod = null,
  sessionId     = null,
  status        = 'success',
  severity      = null,
}) {
  try {
    const context = getRequestContext();
    const resolvedIp = ipAddress ?? context?.ipAddress ?? null;
    const resolvedAgent = userAgent ?? context?.userAgent ?? null;
    const effectiveSeverity = severity ?? deriveSeverity(action, module);

    // Auto-parse UA when browser/os/device not explicitly supplied
    let b = browser, o = os, d = device;
    if (resolvedAgent && (!b || !o || !d)) {
      const parsed = parseUA(resolvedAgent);
      b = b ?? parsed.browser;
      o = o ?? parsed.os;
      d = d ?? parsed.device;
    }

    // Lightweight fallback normalisation for callers that did not go through
    // getClientIp() — strips ::ffff: prefix and maps ::1 → 127.0.0.1.
    let normalizedIp = resolvedIp;
    if (normalizedIp === '::1')                      normalizedIp = '127.0.0.1';
    else if (normalizedIp?.startsWith('::ffff:'))    normalizedIp = normalizedIp.slice(7);

    // Pass created_at explicitly as new Date() so mysql2 (timezone: '+00:00')
    // serialises it as a UTC string. Without this the column would fall back
    // to DEFAULT CURRENT_TIMESTAMP, which uses the MySQL server's local timezone
    // (IST on this server), causing a double +5:30 offset when the frontend
    // converts for display.
    await pool.execute(
      `INSERT INTO audit_logs
         (user_id, action, module_name, entity_name, record_id, description,
          old_value, new_value, changed_fields, severity,
          ip_address, user_agent, browser, os, device,
          request_url, request_method, session_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        normalizedIp,
        resolvedAgent,
        b,
        o,
        d,
        requestUrl,
        requestMethod,
        sessionId,
        status,
        new Date(), // explicit UTC timestamp via mysql2
      ]
    );
  } catch (err) {
    console.error(`Audit log failed [${action}/${module}]:`, err.message);
  }
}

module.exports = writeAudit;
module.exports.parseUA = parseUA;

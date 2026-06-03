const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

async function fetchById(id) {
  const [rows] = await pool.execute(
    `SELECT a.*, u.name AS created_by_name FROM alerts a
     INNER JOIN users u ON a.created_by = u.id
     WHERE a.id = ?`, [id]
  );
  return rows[0] || null;
}

async function listAlerts({ activeOnly = true } = {}) {
  const where = activeOnly ? 'WHERE a.is_active = 1 AND (a.expires_at IS NULL OR a.expires_at > NOW())' : '';
  const [rows] = await pool.execute(
    `SELECT a.*, u.name AS created_by_name
     FROM alerts a INNER JOIN users u ON a.created_by = u.id
     ${where} ORDER BY a.priority DESC, a.created_at DESC`
  );
  return rows;
}

async function getAlert(id) {
  const a = await fetchById(id);
  if (!a) throw httpError('Alert not found', 404);
  return a;
}

async function createAlert(dto, actor) {
  const { message, alert_type = 'INFO', link_url, priority = 0, is_active = 1, expires_at } = dto;
  if (!message?.trim()) throw httpError('message is required', 400);

  const [result] = await pool.execute(
    `INSERT INTO alerts (message, alert_type, link_url, priority, is_active, created_by, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [message.trim(), alert_type, link_url || null, priority, is_active ? 1 : 0, actor.id, expires_at || null]
  );

  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'alerts', recordId: result.insertId,
    description: `Created alert: "${message.trim().substring(0, 60)}"` });
  return fetchById(result.insertId);
}

async function updateAlert(id, dto, actor) {
  const a = await fetchById(id);
  if (!a) throw httpError('Alert not found', 404);

  const message    = dto.message    !== undefined ? dto.message.trim()  : a.message;
  const alert_type = dto.alert_type !== undefined ? dto.alert_type      : a.alert_type;
  const link_url   = dto.link_url   !== undefined ? dto.link_url        : a.link_url;
  const priority   = dto.priority   !== undefined ? dto.priority        : a.priority;
  const is_active  = dto.is_active  !== undefined ? (dto.is_active ? 1 : 0) : a.is_active;
  const expires_at = dto.expires_at !== undefined ? dto.expires_at      : a.expires_at;

  await pool.execute(
    `UPDATE alerts SET message=?, alert_type=?, link_url=?, priority=?, is_active=?, expires_at=?, updated_at=NOW()
     WHERE id=?`,
    [message, alert_type, link_url, priority, is_active, expires_at, id]
  );

  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'alerts', recordId: id,
    description: `Updated alert id=${id}` });
  return fetchById(id);
}

async function toggleActive(id, is_active, actor) {
  const a = await fetchById(id);
  if (!a) throw httpError('Alert not found', 404);

  await pool.execute('UPDATE alerts SET is_active=? WHERE id=?', [is_active ? 1 : 0, id]);
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'alerts', recordId: id,
    description: `${is_active ? 'Activated' : 'Deactivated'} alert id=${id}` });
  return fetchById(id);
}

async function deleteAlert(id, actor) {
  const a = await fetchById(id);
  if (!a) throw httpError('Alert not found', 404);

  await pool.execute('DELETE FROM alerts WHERE id=?', [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'alerts', recordId: id,
    description: `Deleted alert id=${id}` });
}

module.exports = { listAlerts, getAlert, createAlert, updateAlert, toggleActive, deleteAlert };

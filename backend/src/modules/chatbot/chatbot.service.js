const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

async function getConfig() {
  const [rows] = await pool.execute('SELECT * FROM chatbot_config WHERE id = 1');
  return rows[0] || null;
}

async function updateConfig(dto, actor) {
  const fields = ['bot_name', 'avatar_url', 'welcome_message', 'input_placeholder', 'fallback_message', 'is_active'];
  const cols = fields.filter((f) => dto[f] !== undefined);
  if (cols.length) {
    await pool.execute(
      `UPDATE chatbot_config SET ${cols.map((f) => `${f} = ?`).join(', ')} WHERE id = 1`,
      cols.map((f) => dto[f])
    );
  }
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'chatbot', description: 'Updated chatbot config' });
  return getConfig();
}

async function listResponses({ all } = {}) {
  const where = all ? '' : 'WHERE is_active = 1';
  const [rows] = await pool.execute(
    `SELECT * FROM chatbot_responses ${where} ORDER BY display_order ASC, id ASC`
  );
  return rows;
}

async function createResponse(dto, actor) {
  if (!dto.reply || !dto.reply.trim()) throw httpError('reply is required', 400);
  const [result] = await pool.execute(
    `INSERT INTO chatbot_responses (category, keywords, reply, display_order, is_active)
     VALUES (?, ?, ?, ?, ?)`,
    [dto.category || 'General', dto.keywords || null, dto.reply.trim(),
     dto.display_order ?? 0, dto.is_active === false ? 0 : 1]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'chatbot', recordId: result.insertId,
    description: `Created chatbot response id=${result.insertId}` });
  const [rows] = await pool.execute('SELECT * FROM chatbot_responses WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function updateResponse(id, dto, actor) {
  const [exist] = await pool.execute('SELECT id FROM chatbot_responses WHERE id = ?', [id]);
  if (!exist[0]) throw httpError('Response not found', 404);
  const fields = ['category', 'keywords', 'reply', 'display_order', 'is_active'];
  const cols = fields.filter((f) => dto[f] !== undefined);
  if (!cols.length) throw httpError('No updatable fields provided', 400);
  await pool.execute(`UPDATE chatbot_responses SET ${cols.map((f) => `${f} = ?`).join(', ')} WHERE id = ?`,
    [...cols.map((f) => dto[f]), id]);
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'chatbot', recordId: id, description: `Updated chatbot response id=${id}` });
  const [rows] = await pool.execute('SELECT * FROM chatbot_responses WHERE id = ?', [id]);
  return rows[0];
}

async function deleteResponse(id, actor) {
  const [result] = await pool.execute('DELETE FROM chatbot_responses WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw httpError('Response not found', 404);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'chatbot', recordId: id, description: `Deleted chatbot response id=${id}` });
}

module.exports = { getConfig, updateConfig, listResponses, createResponse, updateResponse, deleteResponse };

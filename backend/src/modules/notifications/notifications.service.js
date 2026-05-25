const pool = require('../../config/db');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

async function listForUser(userId, { unread } = {}) {
  const conds = ['user_id = ?'];
  const params = [userId];
  if (unread === 'true' || unread === true) conds.push('is_read = 0');
  const [rows] = await pool.execute(
    `SELECT * FROM notifications WHERE ${conds.join(' AND ')} ORDER BY created_at DESC LIMIT 100`, params
  );
  return rows;
}

async function unreadCount(userId) {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0', [userId]
  );
  return { count: rows[0].count };
}

async function markRead(id, userId) {
  const [result] = await pool.execute(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId]
  );
  if (result.affectedRows === 0) throw httpError('Notification not found', 404);
}

async function markAllRead(userId) {
  await pool.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0', [userId]);
}

/** Create a notification for a user (used by other modules or admin broadcast). */
async function create({ userId, title, message, link }) {
  if (!userId || !title) throw httpError('userId and title are required', 400);
  const [result] = await pool.execute(
    'INSERT INTO notifications (user_id, title, message, link) VALUES (?, ?, ?, ?)',
    [userId, title, message || null, link || null]
  );
  return { id: result.insertId };
}

module.exports = { listForUser, unreadCount, markRead, markAllRead, create };

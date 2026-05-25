const pool = require('../../config/db');

/**
 * Global site search across published content. Uses LIKE for robustness (works
 * with or without the FULLTEXT indexes from migration 010); the indexes make
 * the title/body scans fast at volume. Returns results grouped by type.
 */
async function search(q, { limit = 10 } = {}) {
  const term = (q || '').trim();
  if (term.length < 2) return { query: term, results: { notices: [], news: [], events: [], downloads: [] } };
  const like = `%${term}%`;
  const lim = Math.min(50, Math.max(1, parseInt(limit) || 10));

  const [notices, news, events, downloads] = await Promise.all([
    pool.execute(
      `SELECT id, title, slug, publish_date FROM notices
        WHERE status = 'PUBLISHED' AND (title LIKE ? OR description LIKE ?)
        ORDER BY publish_date DESC LIMIT ${lim}`, [like, like]
    ).then(([r]) => r),
    pool.execute(
      `SELECT id, title, slug, published_at FROM news
        WHERE status = 'PUBLISHED' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
        ORDER BY published_at DESC LIMIT ${lim}`, [like, like, like]
    ).then(([r]) => r),
    pool.execute(
      `SELECT id, title, slug, event_date FROM events
        WHERE status = 'PUBLISHED' AND (title LIKE ? OR description LIKE ?)
        ORDER BY event_date DESC LIMIT ${lim}`, [like, like]
    ).then(([r]) => r),
    pool.execute(
      `SELECT id, title, category FROM downloads
        WHERE status = 'ACTIVE' AND title LIKE ?
        ORDER BY created_at DESC LIMIT ${lim}`, [like]
    ).then(([r]) => r),
  ]);

  return { query: term, results: { notices, news, events, downloads } };
}

module.exports = { search };

const pool = require('../../config/db');

/** Public — total + today's counters for the footer visitor widget. */
async function getVisitorCount() {
  const [[totalRow]] = await Promise.all([
    pool.execute('SELECT total_count, last_updated FROM visitor_total WHERE id = 1'),
  ]);
  const total = totalRow[0] || { total_count: 0, last_updated: null };
  const [todayRows] = await pool.execute(
    'SELECT page_views, unique_visits FROM visitor_stats WHERE stat_date = CURDATE()'
  );
  const today = todayRows[0] || { page_views: 0, unique_visits: 0 };
  return {
    count: Number(total.total_count),
    lastUpdated: total.last_updated,
    today: { pageViews: Number(today.page_views), uniqueVisits: Number(today.unique_visits) },
  };
}

/** Public — increment total + today's page views (called by a debounced beacon). */
async function recordPageView() {
  await pool.execute('UPDATE visitor_total SET total_count = total_count + 1 WHERE id = 1');
  await pool.execute(
    `INSERT INTO visitor_stats (stat_date, page_views, unique_visits)
     VALUES (CURDATE(), 1, 1)
     ON DUPLICATE KEY UPDATE page_views = page_views + 1`
  );
  return getVisitorCount();
}

module.exports = { getVisitorCount, recordPageView };

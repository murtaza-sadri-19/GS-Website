const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

async function getByKey(pageKey) {
  const [rows] = await pool.execute('SELECT * FROM seo_metadata WHERE page_key = ?', [pageKey]);
  return rows[0] || null; // null lets the frontend fall back to defaults
}

async function list() {
  const [rows] = await pool.execute('SELECT * FROM seo_metadata ORDER BY page_key ASC');
  return rows;
}

async function upsert(pageKey, dto, actor) {
  if (!pageKey) throw httpError('page_key is required', 400);
  const sd = dto.structured_data !== undefined
    ? (typeof dto.structured_data === 'string' ? dto.structured_data : JSON.stringify(dto.structured_data))
    : null;
  await pool.execute(
    `INSERT INTO seo_metadata
       (page_key, title, description, og_title, og_description, og_image_file_id, canonical, robots, structured_data, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title=VALUES(title), description=VALUES(description), og_title=VALUES(og_title),
       og_description=VALUES(og_description), og_image_file_id=VALUES(og_image_file_id),
       canonical=VALUES(canonical), robots=VALUES(robots), structured_data=VALUES(structured_data),
       updated_by=VALUES(updated_by)`,
    [pageKey, dto.title || null, dto.description || null, dto.og_title || null,
     dto.og_description || null, dto.og_image_file_id || null, dto.canonical || null,
     dto.robots || 'index,follow', sd, actor.id]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'seo', description: `Saved SEO for page_key=${pageKey}` });
  return getByKey(pageKey);
}

module.exports = { getByKey, list, upsert };

const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { httpError } = require('../../utils/errors');

// ── Read ─────────────────────────────────────────────────────────────────────

async function getSectionsForPage(pageKey) {
  const [rows] = await pool.execute(
    `SELECT id, page_key, section_key, section_type,
            title, subtitle, content, settings_json,
            display_order, is_active, updated_at
       FROM page_sections
      WHERE page_key = ? AND is_active = 1
      ORDER BY display_order ASC, id ASC`,
    [pageKey]
  );
  return rows.map(r => ({
    ...r,
    settings_json: r.settings_json ?? null,
  }));
}

async function getAllSectionsForPage(pageKey) {
  const [rows] = await pool.execute(
    `SELECT id, page_key, section_key, section_type,
            title, subtitle, content, settings_json,
            display_order, is_active, updated_at
       FROM page_sections
      WHERE page_key = ?
      ORDER BY display_order ASC, id ASC`,
    [pageKey]
  );
  return rows;
}

async function getSection(id) {
  const [[row]] = await pool.execute(
    'SELECT * FROM page_sections WHERE id = ?', [id]
  );
  if (!row) throw httpError('Section not found', 404);
  return row;
}

// ── Write ─────────────────────────────────────────────────────────────────────

async function createSection(body, actor) {
  const { page_key, section_key, section_type = 'html',
          title, subtitle, content, settings_json,
          display_order = 0, is_active = 1 } = body;

  if (!page_key) throw httpError('page_key is required', 400);
  if (!section_key) throw httpError('section_key is required', 400);

  const settingsStr = settings_json
    ? JSON.stringify(settings_json)
    : null;

  const [res] = await pool.execute(
    `INSERT INTO page_sections
       (page_key, section_key, section_type, title, subtitle,
        content, settings_json, display_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [page_key, section_key, section_type, title ?? null,
     subtitle ?? null, content ?? null, settingsStr,
     display_order, is_active ? 1 : 0]
  );

  await writeAudit({
    userId: actor.id, action: 'CREATE', module: 'page_sections',
    recordId: res.insertId,
    description: `Created section "${section_key}" for page "${page_key}"`,
  });

  return getSection(res.insertId);
}

async function updateSection(id, body, actor) {
  const existing = await getSection(id);

  const {
    section_type, title, subtitle, content,
    settings_json, display_order, is_active,
  } = body;

  const settingsStr = settings_json !== undefined
    ? (settings_json ? JSON.stringify(settings_json) : null)
    : existing.settings_json;

  await pool.execute(
    `UPDATE page_sections SET
       section_type  = COALESCE(?, section_type),
       title         = ?,
       subtitle      = ?,
       content       = ?,
       settings_json = ?,
       display_order = COALESCE(?, display_order),
       is_active     = COALESCE(?, is_active),
       updated_at    = NOW()
     WHERE id = ?`,
    [
      section_type ?? null,
      title !== undefined ? title : existing.title,
      subtitle !== undefined ? subtitle : existing.subtitle,
      content  !== undefined ? content  : existing.content,
      settingsStr,
      display_order ?? null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      id,
    ]
  );

  await writeAudit({
    userId: actor.id, action: 'UPDATE', module: 'page_sections',
    recordId: id,
    description: `Updated section "${existing.section_key}" on page "${existing.page_key}"`,
  });

  return getSection(id);
}

async function reorderSections(pageKey, orderedIds, actor) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0)
    throw httpError('orderedIds must be a non-empty array', 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (let i = 0; i < orderedIds.length; i++) {
      await conn.execute(
        'UPDATE page_sections SET display_order = ? WHERE id = ? AND page_key = ?',
        [i, orderedIds[i], pageKey]
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  await writeAudit({
    userId: actor.id, action: 'UPDATE', module: 'page_sections',
    description: `Reordered sections for page "${pageKey}"`,
  });

  return getAllSectionsForPage(pageKey);
}

async function deleteSection(id, actor) {
  const existing = await getSection(id);
  await pool.execute('DELETE FROM page_sections WHERE id = ?', [id]);
  await writeAudit({
    userId: actor.id, action: 'DELETE', module: 'page_sections',
    recordId: id,
    description: `Deleted section "${existing.section_key}" from page "${existing.page_key}"`,
  });
}

// ── Live site stats (dynamic_data sections) ───────────────────────────────────

async function getLiveStats() {
  const [[depts]]      = await pool.execute("SELECT COUNT(*) AS n FROM departments WHERE status='ACTIVE'");
  const [[fac]]        = await pool.execute("SELECT COUNT(*) AS n FROM faculty_profiles WHERE status='ACTIVE'");
  const [[notices]]    = await pool.execute("SELECT COUNT(*) AS n FROM notices WHERE status='PUBLISHED'");
  const [[downloads]]  = await pool.execute("SELECT COUNT(*) AS n FROM downloads WHERE status='ACTIVE'");
  const [[events]]     = await pool.execute("SELECT COUNT(*) AS n FROM events WHERE status='PUBLISHED' AND start_date >= CURDATE()");
  const [[news]]       = await pool.execute("SELECT COUNT(*) AS n FROM news WHERE status='PUBLISHED'");

  // Placement stats (graceful — table may not have all columns on every install)
  let placements = 0, companies = 0;
  try {
    const [[p]] = await pool.execute("SELECT COUNT(*) AS n FROM placement_drives WHERE status='COMPLETED'");
    placements = Number(p.n);
  } catch { /* table not seeded */ }
  try {
    const [[c]] = await pool.execute("SELECT COUNT(DISTINCT company_name) AS n FROM placement_drives");
    companies = Number(c.n);
  } catch { /* table not seeded */ }

  return {
    departments:      Number(depts.n),
    faculty:          Number(fac.n),
    notices:          Number(notices.n),
    downloads:        Number(downloads.n),
    upcomingEvents:   Number(events.n),
    news:             Number(news.n),
    placements,
    companies,
    yearsOfExcellence: new Date().getFullYear() - 1952,
  };
}

module.exports = {
  getSectionsForPage,
  getAllSectionsForPage,
  getSection,
  createSection,
  updateSection,
  reorderSections,
  deleteSection,
  getLiveStats,
};

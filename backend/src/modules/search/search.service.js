/**
 * Global Site Search Service  v2
 *
 * Searches 12 content types in parallel.
 * Priority order for scoring:
 *   title exact (100) > title starts-with (80) > title contains (60)
 *   > filename contains (50) > description (30) > content (10)
 *   + word-boundary bonus (20)
 *
 * Announcements (alerts), notices, downloads, events, exam docs, news,
 * tenders, faculty, departments, pages, placements, gallery, PDF index.
 * File names (original_name) are searched for every content type that has
 * an attachment — so "TimeTable2026.pdf" is findable by filename.
 */

const pool = require('../../config/db');
const fs   = require('fs');

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreResult(item, term) {
  const title    = (item.title    || '').toLowerCase();
  const desc     = (item.description || item.excerpt || '').toLowerCase();
  const filename = (item.filename || '').toLowerCase();
  const content  = (item.content  || item.content_text || item.snippet || '').toLowerCase();
  const t        = term.toLowerCase();

  let s = 0;
  if (title === t)              s += 100;
  else if (title.startsWith(t)) s += 80;
  else if (title.includes(t))   s += 60;
  if (filename.includes(t))     s += 50;
  if (desc.includes(t))         s += 30;
  if (content.includes(t))      s += 10;

  try {
    const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    if (re.test(title))    s += 20;
    if (re.test(filename)) s += 15;
  } catch {}

  return s;
}

function scoreAndSort(items, term) {
  return items
    .map(i => ({ ...i, score: scoreResult(i, term) }))
    .sort((a, b) => b.score - a.score);
}

async function safeQuery(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    // Log so silent failures are visible in server logs
    console.error('[search] query failed:', err.message, '| SQL:', sql.slice(0, 80));
    return [];
  }
}

// ── Per-type queries ──────────────────────────────────────────────────────────

// 1. Announcements (alerts marquee)
async function searchAlerts(like, lim) {
  const rows = await safeQuery(
    `SELECT id, message AS title, link_url AS url,
            alert_type AS category, created_at AS date,
            expires_at
     FROM alerts
     WHERE is_active = 1
       AND message LIKE ?
     ORDER BY priority DESC, created_at DESC LIMIT ${lim}`,
    [like]
  );
  return rows.map(r => ({
    ...r,
    type: 'announcement',
    url: r.url || '/notices',
  }));
}

// 2. Notices — join files so filename is searchable
async function searchNotices(like, lim) {
  const rows = await safeQuery(
    `SELECT n.id, n.title, n.slug, n.description,
            n.notice_type AS category, n.publish_date AS date,
            f.original_name AS filename, f.file_url AS fileUrl,
            f.file_type AS fileType
     FROM notices n
     LEFT JOIN files f ON f.id = n.file_id
     WHERE n.status = 'PUBLISHED'
       AND (n.title LIKE ? OR n.description LIKE ? OR f.original_name LIKE ?)
     ORDER BY n.publish_date DESC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({
    ...r,
    type: 'notice',
    url: r.slug ? `/notices` : '/notices',
    isPDF: (r.fileType || '').includes('pdf'),
  }));
}

// 3. News
async function searchNews(like, lim) {
  const rows = await safeQuery(
    `SELECT id, title, slug, excerpt AS description,
            category, published_at AS date
     FROM news
     WHERE status = 'PUBLISHED'
       AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
     ORDER BY published_at DESC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({ ...r, type: 'news', url: `/news/${r.slug}` }));
}

// 4. Events
async function searchEvents(like, lim) {
  const rows = await safeQuery(
    `SELECT id, title, slug, description, event_date AS date
     FROM events
     WHERE status = 'PUBLISHED'
       AND (title LIKE ? OR description LIKE ?)
     ORDER BY event_date DESC LIMIT ${lim}`,
    [like, like]
  );
  return rows.map(r => ({ ...r, type: 'event', url: '/events' }));
}

// 5. Downloads — search title, category AND original filename
async function searchDownloads(like, lim) {
  const rows = await safeQuery(
    `SELECT d.id, d.title, d.category AS description, d.category,
            d.created_at AS date,
            f.original_name AS filename, f.file_url AS fileUrl,
            f.file_type AS fileType
     FROM downloads d
     LEFT JOIN files f ON f.id = d.file_id
     WHERE d.status = 'ACTIVE'
       AND (d.title LIKE ? OR d.category LIKE ? OR f.original_name LIKE ?)
     ORDER BY d.created_at DESC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({
    ...r,
    type: 'document',
    url: r.fileUrl || '/downloads',
    isPDF: (r.fileType || '').includes('pdf'),
  }));
}

// 6. Tenders — join files for filename search
async function searchTenders(like, lim) {
  const rows = await safeQuery(
    `SELECT t.id, t.title, t.slug, t.description, t.deadline AS date,
            f.original_name AS filename, f.file_url AS fileUrl
     FROM tenders t
     LEFT JOIN files f ON f.id = t.file_id
     WHERE t.status = 'PUBLISHED'
       AND (t.title LIKE ? OR t.description LIKE ? OR f.original_name LIKE ?)
     ORDER BY t.deadline DESC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({
    ...r,
    type: 'tender',
    url: r.fileUrl || '/tenders',
    isPDF: true,
  }));
}

// 7. Exam documents — search title, description AND filename
async function searchExamDocs(like, lim) {
  const rows = await safeQuery(
    `SELECT ed.id, ed.title, ed.document_type AS category,
            ed.description, ed.publish_date AS date,
            f.original_name AS filename, f.file_url AS fileUrl,
            f.file_type AS fileType
     FROM exam_documents ed
     LEFT JOIN files f ON f.id = ed.file_id
     WHERE ed.status = 'ACTIVE'
       AND (ed.title LIKE ? OR ed.description LIKE ? OR f.original_name LIKE ?)
     ORDER BY ed.publish_date DESC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({
    ...r,
    type: 'document',
    url: r.fileUrl || '/academics/exam-results',
    isPDF: (r.fileType || '').includes('pdf'),
  }));
}

// 8. Faculty
async function searchFaculty(like, lim) {
  const rows = await safeQuery(
    `SELECT fp.id, u.name AS title, fp.designation AS description,
            fp.specialization, d.name AS departmentName, d.slug AS departmentSlug
     FROM faculty_profiles fp
     JOIN users u ON u.id = fp.user_id
     LEFT JOIN departments d ON d.id = fp.department_id
     WHERE fp.status = 'ACTIVE' AND u.status = 'ACTIVE'
       AND (u.name LIKE ? OR fp.designation LIKE ? OR fp.specialization LIKE ?)
     ORDER BY u.name ASC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({
    ...r,
    type: 'faculty',
    url: r.departmentSlug ? `/departments/${r.departmentSlug}` : '/departments',
  }));
}

// 9. Departments
async function searchDepartments(like, lim) {
  const rows = await safeQuery(
    `SELECT id, name AS title, slug, description, short_name AS shortName
     FROM departments
     WHERE status = 'ACTIVE'
       AND (name LIKE ? OR short_name LIKE ? OR description LIKE ?)
     ORDER BY name ASC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({ ...r, type: 'department', url: `/departments/${r.slug}` }));
}

// 10. CMS Pages
async function searchPages(like, lim) {
  const rows = await safeQuery(
    `SELECT id, title, slug, meta_description AS description
     FROM pages
     WHERE status = 'PUBLISHED'
       AND (title LIKE ? OR meta_description LIKE ? OR content LIKE ?)
     ORDER BY updated_at DESC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({ ...r, type: 'page', url: `/${r.slug}` }));
}

// 11. Placements
async function searchPlacements(like, lim) {
  const rows = await safeQuery(
    `SELECT id, title, company_name AS description, record_type AS category,
            academic_year AS date
     FROM placement_records
     WHERE status = 'ACTIVE'
       AND (title LIKE ? OR company_name LIKE ? OR description LIKE ?)
     ORDER BY created_at DESC LIMIT ${lim}`,
    [like, like, like]
  );
  return rows.map(r => ({ ...r, type: 'placement', url: '/placement' }));
}

// 12. PDF text index (from search_index table)
async function searchPDFIndex(like, lim) {
  const rows = await safeQuery(
    `SELECT id, source_type, source_id, title,
            SUBSTRING(content_text, 1, 200) AS snippet, url
     FROM search_index
     WHERE (title LIKE ? OR content_text LIKE ?)
     ORDER BY indexed_at DESC LIMIT ${lim}`,
    [like, like]
  );
  return rows.map(r => ({
    ...r,
    type: 'pdf',
    description: r.snippet ? `…${r.snippet.trim()}…` : null,
    isPDF: true,
  }));
}

// ── Public search API ─────────────────────────────────────────────────────────

async function search(q, { limit = 20 } = {}) {
  const term = (q || '').trim();
  if (term.length < 2) return { query: term, results: {}, total: 0 };

  const like    = `%${term}%`;
  const perType = Math.min(15, Math.max(3, parseInt(limit) || 10));

  const [
    alerts, notices, news, events, downloads, tenders,
    examDocs, faculty, departments, pages, placements, pdfs,
  ] = await Promise.all([
    searchAlerts(like, perType),
    searchNotices(like, perType),
    searchNews(like, perType),
    searchEvents(like, perType),
    searchDownloads(like, perType),
    searchTenders(like, perType),
    searchExamDocs(like, perType),
    searchFaculty(like, perType),
    searchDepartments(like, perType),
    searchPages(like, perType),
    searchPlacements(like, perType),
    searchPDFIndex(like, perType),
  ]);

  // Merge all document-type results together and re-sort
  const allDocs = scoreAndSort(
    [...downloads, ...examDocs, ...pdfs, ...tenders],
    term
  );

  const results = {
    announcements: scoreAndSort(alerts,       term),
    notices:       scoreAndSort(notices,      term),
    news:          scoreAndSort(news,         term),
    events:        scoreAndSort(events,       term),
    documents:     allDocs,
    faculty:       scoreAndSort(faculty,      term),
    departments:   scoreAndSort(departments,  term),
    pages:         scoreAndSort(pages,        term),
    placements:    scoreAndSort(placements,   term),
  };

  const total = Object.values(results).reduce((s, a) => s + a.length, 0);
  return { query: term, results, total };
}

// ── PDF text indexing ─────────────────────────────────────────────────────────

async function indexPDF(sourceType, sourceId, fileId, title, filePath, url) {
  try {
    if (!fs.existsSync(filePath)) return;
    const pdfParse  = require('pdf-parse');
    const buffer    = fs.readFileSync(filePath);
    const { text }  = await pdfParse(buffer);
    const truncated = (text || '').substring(0, 50000);

    await pool.execute(
      `INSERT INTO search_index (source_type, source_id, file_id, title, content_text, url)
       VALUES (?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title), content_text=VALUES(content_text),
         url=VALUES(url), indexed_at=CURRENT_TIMESTAMP`,
      [sourceType, sourceId, fileId, title, truncated, url]
    );
  } catch { /* non-fatal */ }
}

module.exports = { search, indexPDF };

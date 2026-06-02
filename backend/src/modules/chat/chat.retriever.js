/**
 * RAG Retriever — pulls relevant context from MySQL for the chatbot.
 *
 * Improvements over v1:
 *  - Keyword extraction: splits question into meaningful words for LIKE matching
 *    (prevents full-question LIKE patterns that match nothing)
 *  - chatbot_responses added as primary retrieval source
 *  - Fixed column bugs: section_data→data, research_areas→research_work
 *  - Dynamic OR-based LIKE queries for multiple keywords
 */

const pool = require('../../config/db');

const MAX_ITEMS = 5;

// ── Stop words to ignore when extracting keywords ─────────────────────────────
const STOP_WORDS = new Set([
  'what', 'when', 'where', 'which', 'who', 'whom', 'how', 'why', 'the', 'and',
  'for', 'are', 'with', 'from', 'this', 'that', 'these', 'those', 'have', 'about',
  'tell', 'please', 'could', 'would', 'should', 'does', 'into', 'will', 'can',
  'you', 'your', 'our', 'its', 'was', 'were', 'has', 'had', 'not', 'but', 'any',
  'all', 'some', 'more', 'than', 'then', 'also', 'like', 'just', 'very', 'much',
  'most', 'many', 'me', 'is', 'at', 'be', 'do', 'to', 'of', 'in', 'a', 'an',
  'get', 'give', 'find', 'know', 'want', 'need', 'look', 'let', 'now', 'here',
  'there', 'him', 'her', 'his', 'she', 'his', 'they', 'them', 'we', 'my', 'its',
]);

/**
 * Extract meaningful keywords from the question for LIKE matching.
 * Returns an array of lowercase words, max 8 unique keywords.
 */
function extractKeywords(question) {
  const words = question
    .toLowerCase()
    .replace(/[?!.,;:'"()\[\]{}]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
  return [...new Set(words)].slice(0, 8);
}

/**
 * Build a dynamic WHERE clause and params for OR-based LIKE matching
 * across multiple fields and keywords.
 *
 * Example:
 *   fields = ['d.name', 'd.short_name']
 *   keywords = ['computer', 'engineering', 'hod']
 *   →  WHERE (d.name LIKE ? OR d.name LIKE ? OR d.name LIKE ?
 *             OR d.short_name LIKE ? OR d.short_name LIKE ? OR d.short_name LIKE ?)
 *   params = ['%computer%','%engineering%','%hod%','%computer%','%engineering%','%hod%']
 */
function buildOr(fields, keywords) {
  if (keywords.length === 0) return { clause: '1=0', params: [] };
  const conditions = [];
  const params = [];
  for (const field of fields) {
    for (const kw of keywords) {
      conditions.push(`${field} LIKE ?`);
      params.push(`%${kw}%`);
    }
  }
  return { clause: `(${conditions.join(' OR ')})`, params };
}

async function retrieveContext(question) {
  const keywords = extractKeywords(question);

  // Fallback: if no meaningful keywords extracted, use the raw question words
  const effectiveKw = keywords.length > 0
    ? keywords
    : [question.toLowerCase().replace(/[?!.,]/g, '').trim()];

  const deptOr       = buildOr(['d.name', 'd.short_name', 'd.description'], effectiveKw);
  const facultyOr    = buildOr(['u.name', 'fp.designation', 'fp.specialization', 'd.name'], effectiveKw);
  const noticeOr     = buildOr(['title', 'description'], effectiveKw);
  const downloadOr   = buildOr(['d.title', 'd.category'], effectiveKw);
  const eventOr      = buildOr(['title', 'description'], effectiveKw);
  const placementOr  = buildOr(['pr.title', 'pr.company_name', 'pr.description'], effectiveKw);
  const chatbotOr    = buildOr(['keywords', 'category', 'reply'], effectiveKw);

  const [
    depts,
    facultyRows,
    notices,
    downloads,
    events,
    placement,
    chatbotResponses,
    cmsRows,
    siteSettings,
  ] = await Promise.allSettled([

    // 1. Departments + HOD contact
    pool.execute(
      `SELECT d.name, d.short_name, d.description, d.vision, d.mission,
              d.contact_email, d.contact_phone, d.established_year,
              u.name AS hod_name, u.email AS hod_email, u.phone AS hod_phone
       FROM departments d
       LEFT JOIN users u ON d.hod_user_id = u.id
       WHERE d.status = 'ACTIVE' AND ${deptOr.clause}
       LIMIT ${MAX_ITEMS}`,
      deptOr.params
    ).then(([r]) => r),

    // 2. Faculty profiles
    pool.execute(
      `SELECT u.name, u.email, fp.designation, fp.specialization,
              fp.research_work, fp.qualification,
              d.name AS dept_name
       FROM faculty_profiles fp
       INNER JOIN users u  ON fp.user_id      = u.id
       LEFT  JOIN departments d ON fp.department_id = d.id
       WHERE u.status = 'ACTIVE' AND ${facultyOr.clause}
       LIMIT ${MAX_ITEMS}`,
      facultyOr.params
    ).then(([r]) => r),

    // 3. Recent published notices
    pool.execute(
      `SELECT title, description, notice_type, publish_date
       FROM notices
       WHERE status = 'PUBLISHED' AND publish_date <= CURDATE()
         AND ${noticeOr.clause}
       ORDER BY publish_date DESC
       LIMIT ${MAX_ITEMS}`,
      noticeOr.params
    ).then(([r]) => r),

    // 4. Downloads / documents
    pool.execute(
      `SELECT d.title, d.category, f.file_url, f.original_name
       FROM downloads d
       LEFT JOIN files f ON d.file_id = f.id
       WHERE d.status = 'ACTIVE' AND ${downloadOr.clause}
       ORDER BY d.created_at DESC
       LIMIT ${MAX_ITEMS}`,
      downloadOr.params
    ).then(([r]) => r),

    // 5. Events
    pool.execute(
      `SELECT title, description, event_date
       FROM events
       WHERE status = 'PUBLISHED' AND ${eventOr.clause}
       ORDER BY event_date DESC
       LIMIT ${MAX_ITEMS}`,
      eventOr.params
    ).then(([r]) => r),

    // 6. Placement records
    pool.execute(
      `SELECT pr.title, pr.company_name, pr.academic_year, pr.description, pr.record_type
       FROM placement_records pr
       WHERE pr.status = 'ACTIVE' AND ${placementOr.clause}
       ORDER BY pr.academic_year DESC
       LIMIT ${MAX_ITEMS}`,
      placementOr.params
    ).then(([r]) => r).catch(() => []),

    // 7. Chatbot FAQ responses (keyword-matched pre-written answers)
    pool.execute(
      `SELECT category, keywords, reply
       FROM chatbot_responses
       WHERE is_active = 1 AND ${chatbotOr.clause}
       ORDER BY display_order ASC
       LIMIT ${MAX_ITEMS}`,
      chatbotOr.params
    ).then(([r]) => r).catch(() => []),

    // 8. CMS sections — fixed: column is 'data' not 'section_data'
    pool.execute(
      `SELECT section_key, data
       FROM cms_sections
       WHERE section_key IN (
         'about.overview', 'about.leadership', 'home.stats', 'home.about',
         'about.vision_mission', 'about.accreditation_infra'
       )`,
      []
    ).then(([r]) => r),

    // 9. Site-wide settings
    pool.execute(
      `SELECT setting_key, setting_value
       FROM site_settings
       WHERE setting_key IN (
         'site_name', 'site_email', 'site_phone', 'site_address',
         'director_name', 'registrar_email'
       )`,
      []
    ).then(([r]) => r),
  ]);

  const safe = (r) => (r.status === 'fulfilled' ? r.value : []);

  return buildContextText({
    departments:      safe(depts),
    faculty:          safe(facultyRows),
    notices:          safe(notices),
    downloads:        safe(downloads),
    events:           safe(events),
    placement:        safe(placement),
    chatbotResponses: safe(chatbotResponses),
    cms:              safe(cmsRows),
    settings:         safe(siteSettings),
  });
}

function buildContextText({ departments, faculty, notices, downloads, events, placement, chatbotResponses, cms, settings }) {
  const lines = [];

  // ── Site settings ────────────────────────────────────────────────────────────
  if (settings.length) {
    const s = {};
    settings.forEach(r => { s[r.setting_key] = r.setting_value; });
    lines.push('## INSTITUTE CONTACT INFORMATION');
    if (s.site_name)       lines.push(`Institute: ${s.site_name}`);
    if (s.site_phone)      lines.push(`Phone: ${s.site_phone}`);
    if (s.site_email)      lines.push(`Email: ${s.site_email}`);
    if (s.site_address)    lines.push(`Address: ${s.site_address}`);
    if (s.director_name)   lines.push(`Director: ${s.director_name}`);
    if (s.registrar_email) lines.push(`Registrar Email: ${s.registrar_email}`);
  }

  // ── Chatbot FAQ answers (highest priority — pre-written verified answers) ────
  if (chatbotResponses.length) {
    lines.push('\n## VERIFIED FAQ ANSWERS');
    chatbotResponses.forEach(r => {
      lines.push(`\n### ${r.category}`);
      lines.push(r.reply);
    });
  }

  // ── CMS sections ─────────────────────────────────────────────────────────────
  cms.forEach(row => {
    try {
      const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
      if (!data) return;

      if (row.section_key === 'about.leadership' && (data.name || data.directorName)) {
        lines.push('\n## DIRECTOR / LEADERSHIP');
        lines.push(`Director: ${data.name || data.directorName || ''}`);
        if (data.designation) lines.push(`Designation: ${data.designation}`);
        if (data.message) lines.push(`Message (excerpt): ${String(data.message).replace(/<[^>]+>/g, '').substring(0, 300)}`);
      }

      if ((row.section_key === 'home.stats' || row.section_key === 'about.overview') && data.stats) {
        lines.push('\n## INSTITUTE STATISTICS');
        if (Array.isArray(data.stats)) {
          data.stats.forEach(s => lines.push(`- ${s.label || s.title}: ${s.value || s.count}`));
        }
      }

      if (row.section_key === 'about.vision_mission') {
        if (data.vision)  lines.push(`\nVision: ${String(data.vision).replace(/<[^>]+>/g, '').substring(0, 300)}`);
        if (data.mission) lines.push(`Mission: ${String(data.mission).replace(/<[^>]+>/g, '').substring(0, 300)}`);
      }

      if (row.section_key === 'about.accreditation_infra' && data.naacGrade) {
        lines.push(`\n## ACCREDITATION\nNAAC Grade: ${data.naacGrade}`);
        if (data.nbaPrograms) lines.push(`NBA Programs: ${Array.isArray(data.nbaPrograms) ? data.nbaPrograms.join(', ') : data.nbaPrograms}`);
      }
    } catch { /* skip malformed CMS */ }
  });

  // ── Departments ───────────────────────────────────────────────────────────────
  if (departments.length) {
    lines.push('\n## DEPARTMENTS');
    departments.forEach(d => {
      let line = `- **${d.name}**${d.short_name ? ` (${d.short_name})` : ''}`;
      if (d.hod_name)         line += ` | HOD: ${d.hod_name}`;
      if (d.hod_email)        line += ` | HOD Email: ${d.hod_email}`;
      if (d.hod_phone)        line += ` | HOD Phone: ${d.hod_phone}`;
      if (d.contact_email)    line += ` | Dept Email: ${d.contact_email}`;
      if (d.contact_phone)    line += ` | Dept Phone: ${d.contact_phone}`;
      if (d.established_year) line += ` | Est.: ${d.established_year}`;
      if (d.description)      line += `\n  ${String(d.description).substring(0, 200)}`;
      lines.push(line);
    });
  }

  // ── Faculty ───────────────────────────────────────────────────────────────────
  if (faculty.length) {
    lines.push('\n## FACULTY');
    faculty.forEach(f => {
      let line = `- ${f.name} (${f.dept_name || 'N/A'})`;
      if (f.designation)    line += ` — ${f.designation}`;
      if (f.email)          line += ` | ${f.email}`;
      if (f.specialization) line += ` | Specialization: ${f.specialization}`;
      if (f.qualification)  line += ` | Qualification: ${f.qualification}`;
      if (f.research_work)  line += ` | Research: ${String(f.research_work).substring(0, 100)}`;
      lines.push(line);
    });
  }

  // ── Notices ───────────────────────────────────────────────────────────────────
  if (notices.length) {
    lines.push('\n## RECENT NOTICES');
    notices.forEach(n => {
      lines.push(`- [${n.notice_type}] **${n.title}** (${String(n.publish_date).slice(0, 10)})`);
      if (n.description) lines.push(`  ${String(n.description).replace(/<[^>]+>/g, '').substring(0, 200)}`);
    });
  }

  // ── Downloads / Documents ────────────────────────────────────────────────────
  if (downloads.length) {
    lines.push('\n## DOCUMENTS & DOWNLOADS');
    downloads.forEach(d => {
      let line = `- **${d.title}** [${d.category}]`;
      if (d.file_url) line += ` → [Download](${d.file_url})`;
      lines.push(line);
    });
  }

  // ── Events ────────────────────────────────────────────────────────────────────
  if (events.length) {
    lines.push('\n## EVENTS');
    events.forEach(e => {
      lines.push(`- **${e.title}** on ${String(e.event_date).slice(0, 10)}`);
      if (e.description) lines.push(`  ${String(e.description).replace(/<[^>]+>/g, '').substring(0, 150)}`);
    });
  }

  // ── Placement ─────────────────────────────────────────────────────────────────
  if (placement.length) {
    lines.push('\n## PLACEMENT RECORDS');
    placement.forEach(p => {
      lines.push(`- ${p.academic_year}: **${p.company_name}** — ${p.title}`);
      if (p.description) lines.push(`  ${String(p.description).substring(0, 150)}`);
    });
  }

  const text = lines.join('\n').trim();
  return text || null;
}

module.exports = { retrieveContext };

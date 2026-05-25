/**
 * RAG Retriever — pulls relevant context from MySQL for the chatbot.
 *
 * Uses LIKE queries as the retrieval layer (MySQL FULLTEXT indexes from
 * migration 010 make this fast at production scale).
 *
 * Returns a structured ContextBundle that the LLM prompt builder formats.
 */

const pool = require('../../config/db');

/**
 * @typedef {Object} ContextBundle
 * @property {object[]} departments
 * @property {object[]} faculty
 * @property {object[]} notices
 * @property {object[]} downloads
 * @property {object[]} events
 * @property {object[]} placement
 * @property {object[]} cms
 * @property {string}   rawText   – final context string for the LLM
 */

const MAX_ITEMS = 5;

/** Simple keyword weight: broader multi-word query → lower LIKE-match threshold */
async function retrieveContext(question) {
  const like = `%${question}%`;

  // Run all DB lookups in parallel for speed
  const [
    depts,
    facultyRows,
    notices,
    downloads,
    events,
    placement,
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
       WHERE d.status = 'ACTIVE'
         AND (d.name LIKE ? OR d.short_name LIKE ? OR d.description LIKE ?)
       LIMIT ${MAX_ITEMS}`,
      [like, like, like]
    ).then(([r]) => r),

    // 2. Faculty profiles
    pool.execute(
      `SELECT u.name, u.email, fp.designation, fp.specialization,
              fp.research_areas, fp.qualification,
              d.name AS dept_name
       FROM faculty_profiles fp
       INNER JOIN users u  ON fp.user_id      = u.id
       LEFT  JOIN departments d ON fp.department_id = d.id
       WHERE u.status = 'ACTIVE'
         AND (u.name LIKE ? OR fp.designation LIKE ? OR fp.specialization LIKE ? OR d.name LIKE ?)
       LIMIT ${MAX_ITEMS}`,
      [like, like, like, like]
    ).then(([r]) => r),

    // 3. Recent published notices
    pool.execute(
      `SELECT title, description, notice_type, publish_date
       FROM notices
       WHERE status = 'PUBLISHED' AND publish_date <= CURDATE()
         AND (title LIKE ? OR description LIKE ?)
       ORDER BY publish_date DESC
       LIMIT ${MAX_ITEMS}`,
      [like, like]
    ).then(([r]) => r),

    // 4. Downloads / documents
    pool.execute(
      `SELECT d.title, d.category, f.file_url, f.original_name, f.mime_type
       FROM downloads d
       LEFT JOIN files f ON d.file_id = f.id
       WHERE d.status = 'ACTIVE'
         AND (d.title LIKE ? OR d.category LIKE ?)
       ORDER BY d.created_at DESC
       LIMIT ${MAX_ITEMS}`,
      [like, like]
    ).then(([r]) => r),

    // 5. Events
    pool.execute(
      `SELECT title, description, event_date, department_id
       FROM events
       WHERE status = 'PUBLISHED'
         AND (title LIKE ? OR description LIKE ?)
       ORDER BY event_date DESC
       LIMIT ${MAX_ITEMS}`,
      [like, like]
    ).then(([r]) => r),

    // 6. Placement records + companies
    pool.execute(
      `SELECT pr.title, pr.company_name, pr.academic_year, pr.description, pr.record_type
       FROM placement_records pr
       WHERE pr.status = 'ACTIVE'
         AND (pr.title LIKE ? OR pr.company_name LIKE ? OR pr.description LIKE ?)
       ORDER BY pr.academic_year DESC
       LIMIT ${MAX_ITEMS}`,
      [like, like, like]
    ).then(([r]) => r).catch(() => []),

    // 7. CMS sections: about, director message, stats, contact, hostel, fees
    pool.execute(
      `SELECT section_key, section_data
       FROM cms_sections
       WHERE section_key IN (
         'about.overview', 'about.leadership', 'home.stats', 'home.about',
         'about.vision_mission', 'about.accreditation_infra'
       )`,
      []
    ).then(([r]) => r),

    // 8. Site-wide settings (institute name, phone, email, address)
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

  // Unwrap settled results (tolerate individual query failures)
  const safe = (r) => (r.status === 'fulfilled' ? r.value : []);

  return buildContextText({
    departments: safe(depts),
    faculty:     safe(facultyRows),
    notices:     safe(notices),
    downloads:   safe(downloads),
    events:      safe(events),
    placement:   safe(placement),
    cms:         safe(cmsRows),
    settings:    safe(siteSettings),
  });
}

/** Convert the bundle into a clean text block for the LLM context window */
function buildContextText({ departments, faculty, notices, downloads, events, placement, cms, settings }) {
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

  // ── CMS sections ─────────────────────────────────────────────────────────────
  cms.forEach(row => {
    try {
      const data = typeof row.section_data === 'string'
        ? JSON.parse(row.section_data)
        : row.section_data;
      if (!data) return;

      if (row.section_key === 'about.leadership' && (data.name || data.directorName)) {
        lines.push('\n## DIRECTOR / LEADERSHIP');
        lines.push(`Director: ${data.name || data.directorName || ''}`);
        if (data.designation) lines.push(`Designation: ${data.designation}`);
        if (data.message)     lines.push(`Message (excerpt): ${String(data.message).replace(/<[^>]+>/g, '').substring(0, 300)}`);
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
      if (d.hod_name)      line += ` | HOD: ${d.hod_name}`;
      if (d.hod_email)     line += ` | HOD Email: ${d.hod_email}`;
      if (d.hod_phone)     line += ` | HOD Phone: ${d.hod_phone}`;
      if (d.contact_email) line += ` | Dept Email: ${d.contact_email}`;
      if (d.contact_phone) line += ` | Dept Phone: ${d.contact_phone}`;
      if (d.established_year) line += ` | Est.: ${d.established_year}`;
      if (d.description)   line += `\n  ${String(d.description).substring(0, 200)}`;
      lines.push(line);
    });
  }

  // ── Faculty ───────────────────────────────────────────────────────────────────
  if (faculty.length) {
    lines.push('\n## FACULTY');
    faculty.forEach(f => {
      let line = `- ${f.name} (${f.dept_name || 'Dept N/A'})`;
      if (f.designation)    line += ` - ${f.designation}`;
      if (f.email)          line += ` | ${f.email}`;
      if (f.specialization) line += ` | Specialization: ${f.specialization}`;
      if (f.qualification)  line += ` | Qualification: ${f.qualification}`;
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
      if (d.file_url) line += ` → [Download PDF](${d.file_url})`;
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

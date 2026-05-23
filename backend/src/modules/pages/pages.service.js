const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { slugify, ensureUniqueSlug } = require('../../utils/slug');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const PAGE_COLS = `
  p.id, p.title, p.slug, p.content, p.meta_title, p.meta_description,
  p.updated_by, p.status, p.created_at, p.updated_at,
  u.name AS updated_by_name
`;

const FROM_CLAUSE = `
  FROM pages p
  LEFT JOIN users u ON p.updated_by = u.id
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchPage(id) {
  const [rows] = await pool.execute(
    `SELECT ${PAGE_COLS} ${FROM_CLAUSE} WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function fetchPageBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT ${PAGE_COLS} ${FROM_CLAUSE} WHERE p.slug = ?`,
    [slug]
  );
  return rows[0] || null;
}

// ── Public ────────────────────────────────────────────────────────────────────

async function getPublicPage(slug) {
  const page = await fetchPageBySlug(slug);
  if (!page || page.status !== 'PUBLISHED') throw httpError('Page not found', 404);
  return page;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function listPages() {
  const [rows] = await pool.execute(
    `SELECT ${PAGE_COLS} ${FROM_CLAUSE} ORDER BY p.created_at ASC`
  );
  return rows;
}

async function createPage(dto, actor) {
  const { title, content, meta_title, meta_description } = dto;

  if (!title || !title.trim()) throw httpError('title is required', 400);

  // Resolve slug: use provided slug or generate from title
  let slug;
  if (dto.slug && dto.slug.trim()) {
    slug = slugify(dto.slug.trim());
    if (!slug) throw httpError('Could not generate a valid slug from the provided value', 400);
  } else {
    const base = slugify(title.trim());
    if (!base) throw httpError('Could not generate a valid slug from the provided title', 400);
    slug = base;
  }

  // Ensure uniqueness
  slug = await ensureUniqueSlug('pages', slug);

  const [result] = await pool.execute(
    `INSERT INTO pages (title, slug, content, meta_title, meta_description, updated_by, status)
     VALUES (?, ?, ?, ?, ?, ?, 'DRAFT')`,
    [
      title.trim(),
      slug,
      content          || null,
      meta_title       || null,
      meta_description || null,
      actor.id,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'pages',
    recordId: newId,
    description: `Created page "${title.trim()}" (slug: ${slug})`,
  });

  return await fetchPage(newId);
}

async function updatePage(id, dto, actor) {
  const page = await fetchPage(id);
  if (!page) throw httpError('Page not found', 404);

  // Slug: only changes when explicitly provided in the update body
  let newSlug = page.slug;
  if (dto.slug !== undefined) {
    const candidate = slugify(dto.slug.trim());
    if (!candidate) throw httpError('Could not generate a valid slug from the provided value', 400);
    if (candidate !== page.slug) {
      newSlug = await ensureUniqueSlug('pages', candidate, id);
    }
  }

  const newTitle           = dto.title           !== undefined ? (dto.title?.trim()   || page.title)  : page.title;
  const newContent         = dto.content         !== undefined ? (dto.content         || null)         : page.content;
  const newMetaTitle       = dto.meta_title      !== undefined ? (dto.meta_title      || null)         : page.meta_title;
  const newMetaDescription = dto.meta_description !== undefined ? (dto.meta_description || null)       : page.meta_description;

  if (!newTitle) throw httpError('title cannot be empty', 400);

  await pool.execute(
    `UPDATE pages
     SET title = ?, slug = ?, content = ?, meta_title = ?, meta_description = ?, updated_by = ?
     WHERE id = ?`,
    [newTitle, newSlug, newContent, newMetaTitle, newMetaDescription, actor.id, id]
  );

  const changed = [];
  if (newTitle           !== page.title)            changed.push('title');
  if (newSlug            !== page.slug)             changed.push('slug');
  if (newContent         !== page.content)          changed.push('content');
  if (newMetaTitle       !== page.meta_title)       changed.push('meta_title');
  if (newMetaDescription !== page.meta_description) changed.push('meta_description');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'pages',
    recordId: id,
    description: changed.length
      ? `Updated page id=${id} ("${page.title}"): changed [${changed.join(', ')}]`
      : `Updated page id=${id} ("${page.title}"): no changes`,
  });

  return await fetchPage(id);
}

async function setStatus(id, newStatus, actor) {
  const page = await fetchPage(id);
  if (!page) throw httpError('Page not found', 404);

  if (!['DRAFT', 'PUBLISHED'].includes(newStatus)) {
    throw httpError('status must be DRAFT or PUBLISHED', 400);
  }

  await pool.execute(
    'UPDATE pages SET status = ?, updated_by = ? WHERE id = ?',
    [newStatus, actor.id, id]
  );

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'pages',
    recordId: id,
    description: `Changed status of page id=${id} ("${page.title}") to ${newStatus}`,
  });

  return await fetchPage(id);
}

async function softDelete(id, actor) {
  const page = await fetchPage(id);
  if (!page) throw httpError('Page not found', 404);

  // pages schema has no ARCHIVED — soft delete means unpublish back to DRAFT
  await pool.execute(
    "UPDATE pages SET status = 'DRAFT', updated_by = ? WHERE id = ?",
    [actor.id, id]
  );

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'pages',
    recordId: id,
    description: `Soft-deleted page id=${id} ("${page.title}") — reverted to DRAFT`,
  });
}

module.exports = { getPublicPage, listPages, createPage, updatePage, setStatus, softDelete };

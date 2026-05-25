const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const slugUtil   = require('../../utils/slug');
const { parsePagination } = require('../../utils/pagination');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

const NEWS_COLS = `
  n.id, n.title, n.slug, n.excerpt, n.content, n.cover_img_url,
  n.category, n.author_id, n.published_at, n.status, n.created_at, n.updated_at,
  u.name AS author_name
`;
const FROM_CLAUSE = `FROM news n INNER JOIN users u ON n.author_id = u.id`;

async function fetchById(id) {
  const [rows] = await pool.execute(
    `SELECT ${NEWS_COLS} ${FROM_CLAUSE} WHERE n.id = ?`, [id]
  );
  return rows[0] || null;
}

async function listNews({ page, pageSize, status, category, q } = {}) {
  const { page: p, pageSize: ps, offset } = parsePagination({ page, pageSize });
  page = p; pageSize = ps;

  const conds = [];
  const params = [];

  if (status) { conds.push('n.status = ?'); params.push(status); }
  else         { conds.push("n.status = 'PUBLISHED'"); }

  if (category) { conds.push('n.category = ?'); params.push(category); }
  if (q) {
    conds.push('(n.title LIKE ? OR n.excerpt LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${NEWS_COLS} ${FROM_CLAUSE} ${where} ORDER BY n.published_at DESC, n.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM news n ${where}`, params
    ),
  ]);

  const total = countRows[0].total;
  return { articles: rows, pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
}

async function getNews(id) {
  const article = await fetchById(id);
  if (!article) throw httpError('News article not found', 404);
  return article;
}

async function getNewsBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT ${NEWS_COLS} ${FROM_CLAUSE} WHERE n.slug = ?`, [slug]
  );
  if (!rows[0]) throw httpError('News article not found', 404);
  return rows[0];
}

async function createNews(dto, actor) {
  const { title, excerpt, content, cover_img_url, category = 'GENERAL', published_at, status = 'DRAFT' } = dto;
  if (!title?.trim()) throw httpError('title is required', 400);

  let slug = slugUtil.slugify(title);
  const [existSlug] = await pool.execute('SELECT id FROM news WHERE slug = ?', [slug]);
  if (existSlug[0]) slug = `${slug}-${Date.now()}`;

  const [result] = await pool.execute(
    `INSERT INTO news (title, slug, excerpt, content, cover_img_url, category, author_id, published_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title.trim(), slug, excerpt || null, content || null, cover_img_url || null,
     category, actor.id, published_at || null, status]
  );

  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'news', recordId: result.insertId,
    description: `Created news article "${title.trim()}"` });
  return fetchById(result.insertId);
}

async function updateNews(id, dto, actor) {
  const article = await fetchById(id);
  if (!article) throw httpError('News article not found', 404);

  const title         = dto.title        !== undefined ? dto.title.trim()        : article.title;
  const excerpt       = dto.excerpt      !== undefined ? dto.excerpt              : article.excerpt;
  const content       = dto.content      !== undefined ? dto.content              : article.content;
  const cover_img_url = dto.cover_img_url !== undefined ? dto.cover_img_url       : article.cover_img_url;
  const category      = dto.category     !== undefined ? dto.category             : article.category;
  const published_at  = dto.published_at  !== undefined ? dto.published_at         : article.published_at;
  const status        = dto.status       !== undefined ? dto.status               : article.status;

  if (!title) throw httpError('title cannot be empty', 400);

  await pool.execute(
    `UPDATE news SET title=?, excerpt=?, content=?, cover_img_url=?, category=?, published_at=?, status=?, updated_at=NOW()
     WHERE id=?`,
    [title, excerpt, content, cover_img_url, category, published_at, status, id]
  );

  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'news', recordId: id,
    description: `Updated news article id=${id}` });
  return fetchById(id);
}

async function setStatus(id, newStatus, actor) {
  const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
  if (!validStatuses.includes(newStatus)) throw httpError(`status must be one of: ${validStatuses.join(', ')}`, 400);

  const article = await fetchById(id);
  if (!article) throw httpError('News article not found', 404);

  const publishedAt = newStatus === 'PUBLISHED' && !article.published_at ? new Date() : article.published_at;
  await pool.execute('UPDATE news SET status=?, published_at=? WHERE id=?', [newStatus, publishedAt, id]);

  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'news', recordId: id,
    description: `Changed news article id=${id} status to ${newStatus}` });
  return fetchById(id);
}

async function deleteNews(id, actor) {
  const article = await fetchById(id);
  if (!article) throw httpError('News article not found', 404);

  await pool.execute("UPDATE news SET status='ARCHIVED' WHERE id=?", [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'news', recordId: id,
    description: `Archived news article id=${id} "${article.title}"` });
}

module.exports = { listNews, getNews, getNewsBySlug, createNews, updateNews, setStatus, deleteNews };

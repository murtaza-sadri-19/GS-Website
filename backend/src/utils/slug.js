const pool = require('../config/db');

/**
 * Convert any string to a URL-safe kebab-case slug.
 * e.g. "Computer Science & Engineering" → "computer-science-engineering"
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // spaces → hyphens
    .replace(/[^\w-]+/g, '')    // strip non-word chars (keeps letters, digits, hyphens, underscores)
    .replace(/--+/g, '-')       // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '');   // trim leading / trailing hyphens
}

/**
 * Ensure a slug is unique in `tableName`.
 * Appends -1, -2 … until no collision is found.
 *
 * @param {string} tableName  - hardcoded internal value, never user input
 * @param {string} baseSlug
 * @param {number|null} excludeId - pass the row's own id when updating so it doesn't conflict with itself
 */
async function ensureUniqueSlug(tableName, baseSlug, excludeId = null) {
  let slug    = baseSlug;
  let counter = 1;

  while (true) {
    const [rows] = excludeId
      ? await pool.execute(`SELECT id FROM ${tableName} WHERE slug = ? AND id != ?`, [slug, excludeId])
      : await pool.execute(`SELECT id FROM ${tableName} WHERE slug = ?`, [slug]);

    if (!rows[0]) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
}

module.exports = { slugify, ensureUniqueSlug };

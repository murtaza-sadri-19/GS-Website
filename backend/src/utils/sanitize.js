const sanitizeHtml = require('sanitize-html');

/**
 * Allow-list for rich-text CMS / news / notice content.
 * Permits common formatting + links + images, strips scripts/styles/handlers.
 */
const RICH_TEXT_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'blockquote', 'pre', 'code',
    'strong', 'b', 'em', 'i', 'u', 's', 'span', 'div',
    'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    span: ['style'],
    div: ['style'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  // Force safe rel on links opening in new tabs
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, false),
  },
};

/** Sanitize a rich-text HTML string (returns '' for nullish input). */
function cleanHtml(dirty) {
  if (dirty === null || dirty === undefined) return dirty;
  return sanitizeHtml(String(dirty), RICH_TEXT_OPTIONS);
}

/** Strip ALL tags — for plain-text fields (titles, names) that must not contain markup. */
function cleanText(dirty) {
  if (dirty === null || dirty === undefined) return dirty;
  return sanitizeHtml(String(dirty), { allowedTags: [], allowedAttributes: {} }).trim();
}

/**
 * Return a shallow copy of `obj` with the named fields sanitized.
 * `richFields` get the rich-text allow-list; `textFields` are stripped to plain text.
 */
function sanitizeFields(obj, { richFields = [], textFields = [] } = {}) {
  const out = { ...obj };
  for (const f of richFields) if (f in out) out[f] = cleanHtml(out[f]);
  for (const f of textFields) if (f in out) out[f] = cleanText(out[f]);
  return out;
}

module.exports = { cleanHtml, cleanText, sanitizeFields };

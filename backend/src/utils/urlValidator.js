/**
 * URL Validator for external link attachments.
 *
 * Validates that a URL:
 *  - Is syntactically valid
 *  - Uses http or https protocol only
 *  - Does not point to a private/loopback address (SSRF protection)
 *  - Is not on the blocked-domain list (malicious/phishing protection)
 *  - Has an allowed extension (if extension-checking is requested)
 *
 * The validator is intentionally strict. If validation errors are too
 * restrictive for your deployment, extend ALLOWED_EXTENSIONS or
 * BLOCKED_DOMAINS rather than loosening the core logic.
 */

const { z } = require('zod');

// ── Blocked domains (phishing, malware, known-bad) ────────────────────────────
const BLOCKED_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co',  // URL shorteners (opaque destinations)
  'localhost', '127.0.0.1', '0.0.0.0',                   // loopback
  '169.254.169.254',                                      // AWS/GCP metadata endpoint
  'metadata.google.internal',                             // GCP metadata
]);

// ── Private IPv4 ranges (SSRF protection) ─────────────────────────────────────
const PRIVATE_IP_PATTERNS = [
  /^127\./,           // loopback
  /^10\./,            // RFC-1918
  /^192\.168\./,      // RFC-1918
  /^172\.(1[6-9]|2\d|3[01])\./,  // RFC-1918
  /^169\.254\./,      // link-local
  /^::1$/,            // IPv6 loopback
  /^fc00:/i,          // IPv6 ULA
  /^fe80:/i,          // IPv6 link-local
];

// ── Allowed file extensions for document attachments ─────────────────────────
const ALLOWED_DOC_EXTENSIONS = new Set([
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.txt', '.csv', '.zip', '.rar', '.7z',
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp',
]);

const ALL_ALLOWED_EXTENSIONS = new Set([
  ...ALLOWED_DOC_EXTENSIONS,
  ...ALLOWED_IMAGE_EXTENSIONS,
]);

// ── Zod schema for URL syntax ─────────────────────────────────────────────────
const urlSchema = z.string().url('Must be a valid URL (include https://)').max(2048, 'URL too long');

// ── Core validator ────────────────────────────────────────────────────────────

/**
 * Validates an external URL for use as an attachment.
 *
 * @param {string} rawUrl - The URL to validate
 * @param {object} [options]
 * @param {boolean} [options.requireExtension=false] - If true, URL path must end with a known extension
 * @param {'doc'|'image'|'any'} [options.extensionType='any'] - Which extension set to allow
 * @returns {{ valid: true, url: URL } | { valid: false, message: string }}
 */
function validateExternalUrl(rawUrl, options = {}) {
  const { requireExtension = false, extensionType = 'any' } = options;

  // Step 1: Zod syntax check
  const parsed = urlSchema.safeParse(rawUrl);
  if (!parsed.success) {
    return { valid: false, message: parsed.error.errors[0]?.message || 'Invalid URL' };
  }

  let urlObj;
  try {
    urlObj = new URL(rawUrl);
  } catch {
    return { valid: false, message: 'URL could not be parsed' };
  }

  // Step 2: Protocol check
  if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
    return { valid: false, message: 'URL must use http or https protocol' };
  }

  // Step 3: Block known-bad domains
  const hostname = urlObj.hostname.toLowerCase();
  if (BLOCKED_DOMAINS.has(hostname)) {
    return { valid: false, message: `Domain "${hostname}" is not allowed` };
  }

  // Step 4: Private IP / SSRF protection
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, message: 'URL must not point to a private or internal address' };
    }
  }

  // Step 5: Optional extension validation
  if (requireExtension) {
    const pathname = urlObj.pathname.toLowerCase();
    const dotIndex = pathname.lastIndexOf('.');
    const ext = dotIndex >= 0 ? pathname.slice(dotIndex) : '';

    const allowedSet =
      extensionType === 'doc'   ? ALLOWED_DOC_EXTENSIONS :
      extensionType === 'image' ? ALLOWED_IMAGE_EXTENSIONS :
                                  ALL_ALLOWED_EXTENSIONS;

    if (!allowedSet.has(ext)) {
      return {
        valid: false,
        message: `URL must point to an allowed file type. Allowed: ${[...allowedSet].join(', ')}`,
      };
    }
  }

  return { valid: true, url: urlObj };
}

/**
 * Throws an HTTP-compatible error if the URL fails validation.
 * Convenience wrapper for service layer.
 */
function assertExternalUrl(rawUrl, options = {}) {
  const result = validateExternalUrl(rawUrl, options);
  if (!result.valid) {
    const err = new Error(result.message);
    err.statusCode = 400;
    throw err;
  }
  return result.url;
}

/**
 * Detects likely MIME type from URL extension (best-effort, not authoritative).
 * Returns null if the extension is unknown.
 */
function guessMimeFromUrl(urlString) {
  try {
    const pathname = new URL(urlString).pathname.toLowerCase();
    const ext = pathname.slice(pathname.lastIndexOf('.'));
    const map = {
      '.pdf':  'application/pdf',
      '.doc':  'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls':  'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt':  'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.jpg':  'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png':  'image/png',
      '.gif':  'image/gif',
      '.webp': 'image/webp',
      '.svg':  'image/svg+xml',
      '.txt':  'text/plain',
      '.csv':  'text/csv',
      '.zip':  'application/zip',
    };
    return map[ext] || null;
  } catch {
    return null;
  }
}

module.exports = { validateExternalUrl, assertExternalUrl, guessMimeFromUrl };

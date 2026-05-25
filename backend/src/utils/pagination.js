/**
 * Shared pagination helper.
 *
 * Normalises page/pageSize query params and enforces server-side caps.
 * Usage:
 *   const { page, pageSize, offset } = parsePagination(req.query)
 *
 * Defaults: page=1, pageSize=20
 * Hard cap:  pageSize ≤ MAX_PAGE_SIZE (100)
 */

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

/**
 * @param {{ page?: string | number, pageSize?: string | number, limit?: string | number }} query
 * @returns {{ page: number, pageSize: number, offset: number }}
 */
function parsePagination({ page, pageSize, limit } = {}) {
  const p  = Math.max(1, parseInt(page) || 1);
  const ps = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(pageSize || limit) || DEFAULT_PAGE_SIZE));
  return { page: p, pageSize: ps, offset: (p - 1) * ps };
}

module.exports = { parsePagination, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE };

const pool = require('../config/db');
const { error } = require('../utils/response');

/**
 * Granular permission middleware (complements the coarse `allow(...roles)`).
 *
 *   router.put('/cms/:section', auth, requirePermission('cms','update'), ctrl.save)
 *
 * Resolves the caller's role → permission set from `role_permissions`, cached
 * in-memory with a short TTL to avoid a query per request. SUPER_ADMIN bypasses
 * all checks. Falls open ONLY for SUPER_ADMIN — every other role must hold the
 * exact `resource.action` (or `resource.manage`) grant.
 */

const CACHE_TTL_MS = 60 * 1000;
const cache = new Map(); // roleName -> { perms: Set<string>, expires: number }

async function loadPermissions(roleName) {
  const hit = cache.get(roleName);
  if (hit && hit.expires > Date.now()) return hit.perms;

  const [rows] = await pool.execute(
    `SELECT p.name
       FROM role_permissions rp
       JOIN roles r       ON rp.role_id = r.id
       JOIN permissions p ON rp.permission_id = p.id
      WHERE r.role_name = ?`,
    [roleName]
  );
  const perms = new Set(rows.map((r) => r.name));
  cache.set(roleName, { perms, expires: Date.now() + CACHE_TTL_MS });
  return perms;
}

/** Invalidate the cache (call after editing role_permissions at runtime). */
function clearPermissionCache() {
  cache.clear();
}

const requirePermission = (resource, action) => async (req, res, next) => {
  try {
    if (!req.user) return error(res, 'Authentication required', null, 401);
    if (req.user.role === 'SUPER_ADMIN') return next();

    const perms = await loadPermissions(req.user.role);
    if (perms.has(`${resource}.${action}`) || perms.has(`${resource}.manage`)) {
      return next();
    }
    return error(
      res,
      'You do not have permission to perform this action',
      `Missing permission '${resource}.${action}' for role '${req.user.role}'`,
      403
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { requirePermission, clearPermissionCache };

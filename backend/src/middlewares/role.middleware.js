const { error } = require('../utils/response');

/**
 * Usage: router.post('/route', auth, allow('CENTRAL_ADMIN', 'HOD'), controller)
 */
const allow = (...roles) => (req, res, next) => {
  if (!req.user) {
    return error(res, 'Authentication required', null, 401);
  }
  // SUPER_ADMIN is a superset of every role — always allowed.
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }
  if (!roles.includes(req.user.role)) {
    return error(res, 'You do not have permission to perform this action', `Role '${req.user.role}' is not allowed`, 403);
  }
  next();
};

module.exports = { allow };

const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authentication required', 'No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      department_id: payload.department_id,
    };
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', err.message, 401);
  }
};

module.exports = authMiddleware;

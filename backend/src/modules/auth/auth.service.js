const pool = require('../../config/db');
const { comparePassword, hashPassword } = require('../../utils/hash');
const { signToken } = require('../../utils/jwt');
const writeAudit = require('../../utils/audit');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

async function login(email, password, ipAddress) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, u.password_hash, u.status, u.department_id,
            r.role_name AS role
     FROM users u
     INNER JOIN roles r ON u.role_id = r.id
     WHERE u.email = ?`,
    [email]
  );

  const user = rows[0];

  // No user found — same message as wrong password (prevents email enumeration)
  if (!user) throw httpError('Invalid credentials', 401);

  const passwordMatch = await comparePassword(password, user.password_hash);
  if (!passwordMatch) throw httpError('Invalid credentials', 401);

  // Check status after password match (avoids revealing account existence)
  if (user.status !== 'ACTIVE') throw httpError('Invalid credentials', 401);

  await writeAudit({
    userId: user.id,
    action: 'LOGIN',
    module: 'auth',
    description: `User ${user.email} logged in`,
    ipAddress,
  });

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department_id: user.department_id,
  };

  const token = signToken(payload);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department_id: user.department_id,
    },
  };
}

async function getMe(userId) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, u.phone, u.status, u.department_id, u.created_at,
            r.role_name AS role
     FROM users u
     INNER JOIN roles r ON u.role_id = r.id
     WHERE u.id = ?`,
    [userId]
  );

  const user = rows[0];
  if (!user) throw httpError('User not found', 404);
  return user;
}

async function changePassword(userId, oldPassword, newPassword) {
  const [rows] = await pool.execute(
    'SELECT id, password_hash FROM users WHERE id = ?',
    [userId]
  );

  const user = rows[0];
  if (!user) throw httpError('User not found', 404);

  const match = await comparePassword(oldPassword, user.password_hash);
  if (!match) throw httpError('Current password is incorrect', 400);

  const newHash = await hashPassword(newPassword);

  await pool.execute(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [newHash, userId]
  );
}

module.exports = { login, getMe, changePassword };

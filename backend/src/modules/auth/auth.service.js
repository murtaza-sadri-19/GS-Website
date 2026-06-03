const crypto = require('crypto');
const pool = require('../../config/db');
const { comparePassword, hashPassword } = require('../../utils/hash');
const { signToken } = require('../../utils/jwt');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

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

// ─── Password Reset ──────────────────────────────────────────────────────────

/** Token lifetime: 1 hour */
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

/**
 * Generate a reset token for `email`.
 * Returns the plaintext token (caller must deliver it to the user).
 *
 * Silently succeeds even if the email is not found — this prevents user
 * enumeration: the client always sees "If that email exists, a reset link was sent."
 */
async function forgotPassword(email, ipAddress) {
  const [rows] = await pool.execute(
    'SELECT id, email FROM users WHERE email = ? AND status = ?',
    [email, 'ACTIVE']
  );

  if (!rows[0]) {
    // Return null token — caller surfaces a generic success message
    return null;
  }

  const user = rows[0];
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  // Invalidate any existing unused tokens for this user
  await pool.execute(
    'UPDATE password_reset_tokens SET used = 1 WHERE user_id = ? AND used = 0',
    [user.id]
  );

  await pool.execute(
    'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [user.id, token, expiresAt]
  );

  await writeAudit({
    userId: user.id,
    action: 'PASSWORD_RESET_REQUEST',
    module: 'auth',
    description: `Password reset requested for ${user.email}`,
    ipAddress,
  });

  return token;
}

/**
 * Validate a reset token and update the user's password.
 */
async function resetPassword(token, newPassword) {
  const [rows] = await pool.execute(
    `SELECT prt.id, prt.user_id, prt.expires_at, prt.used
     FROM password_reset_tokens prt
     WHERE prt.token = ?`,
    [token]
  );

  const record = rows[0];

  if (!record)              throw httpError('Invalid or expired reset token', 400);
  if (record.used)          throw httpError('Reset token has already been used', 400);
  if (new Date() > new Date(record.expires_at)) {
    throw httpError('Reset token has expired', 400);
  }

  const newHash = await hashPassword(newPassword);

  await pool.execute(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [newHash, record.user_id]
  );

  // Mark token as used
  await pool.execute(
    'UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
    [record.id]
  );

  await writeAudit({
    userId: record.user_id,
    action: 'PASSWORD_RESET_COMPLETE',
    module: 'auth',
    description: 'Password reset completed via token',
    ipAddress: null,
  });
}

module.exports = { login, getMe, changePassword, forgotPassword, resetPassword };

const authService = require('./auth.service');
const { success } = require('../../utils/response');
const { sendMail } = require('../../utils/mailer');
const { passwordResetEmail } = require('../../utils/emailTemplates');
const env = require('../../config/env');

async function login(req, res, next) {
  try {
    // req.body already validated + email lowercased by Zod schema
    const { email, password } = req.body;
    const result = await authService.login(email, password, req.ip);
    return success(res, 'Login successful', result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return success(res, 'User profile fetched successfully', user);
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    // req.body already validated + complexity enforced by Zod schema
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, oldPassword, newPassword);
    return success(res, 'Password changed successfully', null);
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  return success(res, 'Logged out successfully', null);
}

/**
 * POST /auth/forgot-password
 * Always returns 200 with a generic message to prevent email enumeration.
 * In development (NODE_ENV !== 'production') the token is included in the
 * response so it can be tested without an SMTP server.
 * In production, wire up an email service and send the token via email.
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const token = await authService.forgotPassword(email, req.ip);

    if (token) {
      const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;
      const { html, text } = passwordResetEmail({ resetUrl, expiresInHours: 1 });
      // Fire-and-forget — email failure must not surface to the user (prevents enumeration)
      sendMail({ to: email, subject: 'Reset your SGSITS Portal password', html, text })
        .catch(err => console.error('[auth] Password reset email failed:', err.message));
    }

    // In development also return the token so the flow can be tested without SMTP
    const devPayload = process.env.NODE_ENV !== 'production' && token
      ? { reset_token: token, note: 'Development only — configure SMTP in production' }
      : {};

    return success(res, 'If that email exists in our system, a password reset link has been sent.', devPayload);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /auth/reset-password
 * Accepts { token, newPassword } and resets the user's password.
 */
async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    return success(res, 'Password has been reset successfully. Please log in with your new password.');
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me, changePassword, logout, forgotPassword, resetPassword };

const authService  = require('./auth.service');
const { success }  = require('../../utils/response');
const { sendMail } = require('../../utils/mailer');
const { passwordResetEmail } = require('../../utils/emailTemplates');
const env          = require('../../config/env');
const getClientIp  = require('../../utils/getClientIp');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(
      email,
      password,
      getClientIp(req),
      req.headers['user-agent']
    );
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

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const token = await authService.forgotPassword(email, getClientIp(req));

    if (token) {
      const resetUrl = `${env.frontendUrl}/reset-password?token=${token}`;
      const { html, text } = passwordResetEmail({ resetUrl, expiresInHours: 1 });
      sendMail({ to: email, subject: 'Reset your SGSITS Portal password', html, text })
        .catch(err => console.error('[auth] Password reset email failed:', err.message));
    }

    const devPayload = process.env.NODE_ENV !== 'production' && token
      ? { reset_token: token, note: 'Development only — configure SMTP in production' }
      : {};

    return success(res, 'If that email exists in our system, a password reset link has been sent.', devPayload);
  } catch (err) {
    next(err);
  }
}

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

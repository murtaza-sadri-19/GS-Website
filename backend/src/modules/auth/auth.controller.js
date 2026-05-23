const authService = require('./auth.service');
const { success, error } = require('../../utils/response');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required', null, 400);
    }

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
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return error(res, 'oldPassword and newPassword are required', null, 400);
    }

    if (newPassword.length < 6) {
      return error(res, 'New password must be at least 6 characters', null, 400);
    }

    await authService.changePassword(req.user.id, oldPassword, newPassword);
    return success(res, 'Password changed successfully', null);
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  return success(res, 'Logged out successfully', null);
}

module.exports = { login, me, changePassword, logout };

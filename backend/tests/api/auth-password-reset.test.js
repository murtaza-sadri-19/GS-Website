'use strict';

/**
 * Phase 38 — Auth: Forgot Password + Reset Password
 *
 * Covers the 2 untested auth endpoints:
 *   POST /auth/forgot-password
 *   POST /auth/reset-password
 *
 * NODE_ENV !== 'production' → controller returns reset_token in response body
 * so no SMTP server is needed for testing.
 */

const { state, api, login } = require('../config');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@college.edu';
const ADMIN_PASS  = process.env.ADMIN_PASS  || 'Admin@123';

describe('Phase 38 — Auth: Forgot Password + Reset Password', () => {

  let resetToken;

  // ── POST /auth/forgot-password ─────────────────────────────────────────────

  it('38.1 forgot-password with valid email → 200 + dev reset_token', async () => {
    const res = await api(null).post('/auth/forgot-password', { email: ADMIN_EMAIL });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.message).toMatch(/password reset/i);
    // Dev mode returns token so tests don't need SMTP
    expect(res.data.data).toHaveProperty('reset_token');
    expect(typeof res.data.data.reset_token).toBe('string');
    expect(res.data.data.reset_token.length).toBeGreaterThan(10);
    resetToken = res.data.data.reset_token;
  });

  it('38.2 forgot-password with unknown email → 200 (no user-enumeration)', async () => {
    const res = await api(null).post('/auth/forgot-password', { email: 'nobody@nowhere.example' });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    // Must NOT expose a reset token for unknown emails
    expect(res.data.data?.reset_token).toBeUndefined();
  });

  it('38.3 forgot-password with invalid email format → 400', async () => {
    const res = await api(null).post('/auth/forgot-password', { email: 'not-an-email' });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.4 forgot-password with missing email body → 400', async () => {
    const res = await api(null).post('/auth/forgot-password', {});
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── POST /auth/reset-password ──────────────────────────────────────────────

  it('38.5 reset-password with valid token + strong new password → 200', async () => {
    if (!resetToken) return;
    const res = await api(null).post('/auth/reset-password', {
      token:       resetToken,
      newPassword: 'Admin@456',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.message).toMatch(/reset successfully/i);
  });

  it('38.6 can login with new password after reset', async () => {
    if (!resetToken) return;
    const res = await login(ADMIN_EMAIL, 'Admin@456');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('token');
    // Keep admin token up to date
    state.tokens.admin = res.data.data.token;
  });

  it('38.7 reset-password with already-used token → 400', async () => {
    if (!resetToken) return;
    const res = await api(null).post('/auth/reset-password', {
      token:       resetToken,
      newPassword: 'Admin@789',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
    expect(res.data.message || res.data.error || '').toMatch(/used|invalid|expired/i);
  });

  it('38.8 reset-password with garbage token → 400', async () => {
    const res = await api(null).post('/auth/reset-password', {
      token:       'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      newPassword: 'Admin@123',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('38.9 reset-password with weak password (no uppercase) → 400', async () => {
    // Need a fresh token since previous one is used
    const fp = await api(null).post('/auth/forgot-password', { email: ADMIN_EMAIL });
    const freshToken = fp.data.data?.reset_token;
    if (!freshToken) return;

    const res = await api(null).post('/auth/reset-password', {
      token:       freshToken,
      newPassword: 'alllower1',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);

    // Mark the unused fresh token as used so it doesn't interfere
    await api(null).post('/auth/reset-password', {
      token:       freshToken,
      newPassword: 'Admin@123',
    });
  });

  it('38.10 reset-password with missing newPassword → 400', async () => {
    const res = await api(null).post('/auth/reset-password', {
      token: 'sometoken',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.11 reset-password with missing token → 400', async () => {
    const res = await api(null).post('/auth/reset-password', {
      newPassword: 'Admin@123',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── Cleanup: restore admin password to original ────────────────────────────

  it('38.12 restore admin password to original (Admin@123)', async () => {
    // Attempt login with new password first
    const tryNew = await login(ADMIN_EMAIL, 'Admin@456');
    if (tryNew.status === 200) {
      const t = tryNew.data.data.token;
      const res = await api(t).post('/auth/change-password', {
        oldPassword: 'Admin@456',
        newPassword: ADMIN_PASS,
      });
      expect(res.status).toBe(200);
      // Refresh admin token
      const re = await login(ADMIN_EMAIL, ADMIN_PASS);
      if (re.status === 200) state.tokens.admin = re.data.data.token;
    } else {
      // Password was already restored in 38.9 cleanup or never changed
      const re = await login(ADMIN_EMAIL, ADMIN_PASS);
      expect(re.status).toBe(200);
      state.tokens.admin = re.data.data.token;
    }
  });

});

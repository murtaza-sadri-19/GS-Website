'use strict';

const { state, api, login } = require('../config');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@college.edu';
const ADMIN_PASS  = process.env.ADMIN_PASS  || 'Admin@123';

describe('Phase 1 — Auth', () => {

  it('1.1 Login CENTRAL_ADMIN → 200 + token stored', async () => {
    const res = await login(ADMIN_EMAIL, ADMIN_PASS);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('token');
    expect(res.data.data.user).toMatchObject({ email: ADMIN_EMAIL, role: 'CENTRAL_ADMIN' });
    state.tokens.admin = res.data.data.token;
  });

  it('1.2 GET /auth/me → 200 with user fields', async () => {
    const res = await api(state.tokens.admin).get('/auth/me');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const u = res.data.data;
    expect(u).toHaveProperty('id');
    expect(u).toMatchObject({ email: ADMIN_EMAIL, role: 'CENTRAL_ADMIN' });
    expect(u).toHaveProperty('status');
    expect(u).toHaveProperty('created_at');
  });

  it('1.3 Change password then restore it', async () => {
    const change = await api(state.tokens.admin).post('/auth/change-password', {
      oldPassword: ADMIN_PASS,
      newPassword: 'Admin@456',
    });
    expect(change.status).toBe(200);
    expect(change.data.success).toBe(true);

    const restore = await api(state.tokens.admin).post('/auth/change-password', {
      oldPassword: 'Admin@456',
      newPassword: ADMIN_PASS,
    });
    expect(restore.status).toBe(200);
    expect(restore.data.success).toBe(true);
  });

  it('1.4 POST /auth/logout → 200 (frontend-only logout)', async () => {
    const res = await api(state.tokens.admin).post('/auth/logout');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('1.5 Wrong password → 401', async () => {
    const res = await login(ADMIN_EMAIL, 'wrongpassword');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('1.6 No token on protected route → 401', async () => {
    const res = await api(null).get('/auth/me');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

});

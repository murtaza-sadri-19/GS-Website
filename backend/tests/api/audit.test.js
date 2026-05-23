'use strict';

const { state, api } = require('../config');

describe('Phase 13 — Audit Logs', () => {

  it('13.1 GET /audit-logs (admin) → 200 with logs + pagination', async () => {
    const res = await api(state.tokens.admin).get('/audit-logs');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('logs');
    expect(res.data.data).toHaveProperty('pagination');
    expect(Array.isArray(res.data.data.logs)).toBe(true);
    // Verify log entry shape
    if (res.data.data.logs.length > 0) {
      const log = res.data.data.logs[0];
      ['id', 'user_id', 'action', 'module_name', 'created_at'].forEach(field => {
        expect(log).toHaveProperty(field);
      });
    }
  });

  it('13.2 GET /audit-logs?user_id → filters to that user', async () => {
    const res = await api(state.tokens.admin).get(
      `/audit-logs?user_id=${state.ids.hodUser}`
    );
    expect(res.status).toBe(200);
    res.data.data.logs.forEach(l =>
      expect(Number(l.user_id)).toBe(Number(state.ids.hodUser))
    );
  });

  it('13.3 GET /audit-logs?action=LOGIN → all logs have LOGIN action', async () => {
    const res = await api(state.tokens.admin).get('/audit-logs?action=LOGIN');
    expect(res.status).toBe(200);
    res.data.data.logs.forEach(l => expect(l.action).toBe('LOGIN'));
  });

  it('13.4 GET /audit-logs?module_name=faculty → all logs are for faculty module', async () => {
    const res = await api(state.tokens.admin).get('/audit-logs?module_name=faculty');
    expect(res.status).toBe(200);
    res.data.data.logs.forEach(l => expect(l.module_name).toBe('faculty'));
  });

  it('13.5 GET /audit-logs with combined filters → 200', async () => {
    const res = await api(state.tokens.admin).get(
      '/audit-logs?action=CREATE&module_name=notices'
    );
    expect(res.status).toBe(200);
  });

  it('13.6 GET /audit-logs/1 → 200 or 404 depending on seed', async () => {
    const res = await api(state.tokens.admin).get('/audit-logs/1');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.data.data).toHaveProperty('id');
    }
  });

  it('13.7 GET /audit-logs/user/:userId → returns user info + logs', async () => {
    const res = await api(state.tokens.admin).get(
      `/audit-logs/user/${state.ids.hodUser}`
    );
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('user');
    expect(res.data.data).toHaveProperty('logs');
    expect(Number(res.data.data.user.id)).toBe(Number(state.ids.hodUser));
  });

  it('13.8 Non-admin (HOD) cannot access audit logs → 403', async () => {
    const res = await api(state.tokens.hod).get('/audit-logs');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

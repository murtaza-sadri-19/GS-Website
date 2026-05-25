'use strict';

const { state, api } = require('../config');

describe('Phase 19 — Alerts', () => {

  let alertId;

  it('19.1 POST /alerts (admin) → 201', async () => {
    const res = await api(state.tokens.admin).post('/alerts', {
      title:   'System Maintenance Notice',
      message: 'The portal will be down for maintenance on Sunday 2–4 AM.',
      type:    'WARNING',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    const a = res.data.data;
    expect(a).toHaveProperty('id');
    alertId = a.id;
  });

  it('19.2 GET /alerts (public) → 200 with alerts array', async () => {
    const res = await api(null).get('/alerts');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.alerts || res.data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  it('19.3 GET /alerts/:id (public) → 200 with correct alert', async () => {
    const res = await api(null).get(`/alerts/${alertId}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(alertId);
  });

  it('19.4 PUT /alerts/:id (admin) → updates message', async () => {
    const res = await api(state.tokens.admin).put(`/alerts/${alertId}`, {
      message: 'Updated: maintenance window extended to 6 AM.',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('19.5 PATCH /alerts/:id/toggle (admin) → toggles is_active', async () => {
    const before = await api(null).get(`/alerts/${alertId}`);
    const wasActive = before.data.data.is_active;

    const res = await api(state.tokens.admin).patch(`/alerts/${alertId}/toggle`, { is_active: !wasActive });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);

    // Toggle back for cleanup
    await api(state.tokens.admin).patch(`/alerts/${alertId}/toggle`, { is_active: wasActive });
  });

  it('19.6 PLACEMENT_OFFICER cannot POST /alerts → 403', async () => {
    const res = await api(state.tokens.placement).post('/alerts', {
      title:   'Unauthorized Alert',
      message: 'Should not be created.',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('19.7 TEACHER cannot DELETE /alerts/:id → 403', async () => {
    const res = await api(state.tokens.teacher).delete(`/alerts/${alertId}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('19.8 DELETE /alerts/:id (admin) → 200', async () => {
    const res = await api(state.tokens.admin).delete(`/alerts/${alertId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

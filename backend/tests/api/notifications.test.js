'use strict';

const { state, api } = require('../config');

describe('Phase 25 — Notifications', () => {

  let notifId;
  let targetUserId;

  beforeAll(async () => {
    // Get a user ID to target for notification creation (requires userId param)
    // Use teacher user ID if available, otherwise get admin's own ID
    if (state.ids.teacherUser) {
      targetUserId = state.ids.teacherUser;
    } else if (state.tokens.admin) {
      const meRes = await api(state.tokens.admin).get('/auth/me');
      targetUserId = meRes.data?.data?.id || meRes.data?.data?.user?.id || 1;
    } else {
      targetUserId = 1; // fallback to seeded admin ID
    }
  });

  it('25.1 POST /notifications (admin → specific user) → 201', async () => {
    const res = await api(state.tokens.admin).post('/notifications', {
      userId:  targetUserId,
      title:   'System Update',
      message: 'New features have been deployed. Please refresh.',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
  });

  it('25.2 GET /notifications (admin) → 200 with list', async () => {
    const res = await api(state.tokens.admin).get('/notifications');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    // listForUser returns a direct array
    const items = Array.isArray(res.data.data) ? res.data.data : (res.data.data.notifications || []);
    expect(Array.isArray(items)).toBe(true);
    if (items.length > 0) {
      notifId = items[0].id;
    }
  });

  it('25.3 GET /notifications (HOD) → 200 with their notifications', async () => {
    const res = await api(state.tokens.hod).get('/notifications');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = Array.isArray(res.data.data) ? res.data.data : (res.data.data.notifications || []);
    expect(Array.isArray(items)).toBe(true);
  });

  it('25.4 GET /notifications/unread-count (admin) → 200 with count', async () => {
    const res = await api(state.tokens.admin).get('/notifications/unread-count');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const d = res.data.data;
    expect(d).toHaveProperty('count');
    expect(typeof d.count).toBe('number');
  });

  it('25.5 PATCH /notifications/:id/read (admin) → 200', async () => {
    if (!notifId) return;
    const res = await api(state.tokens.admin).patch(`/notifications/${notifId}/read`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('25.6 POST /notifications/read-all (admin) → 200 marks all read', async () => {
    const res = await api(state.tokens.admin).post('/notifications/read-all');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('25.7 Unauthenticated GET /notifications → 401', async () => {
    const res = await api(null).get('/notifications');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('25.8 TEACHER can read their notifications → 200', async () => {
    const res = await api(state.tokens.teacher).get('/notifications');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = Array.isArray(res.data.data) ? res.data.data : (res.data.data.notifications || []);
    expect(Array.isArray(items)).toBe(true);
  });

});

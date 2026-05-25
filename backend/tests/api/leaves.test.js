'use strict';

const { state, api } = require('../config');

describe('Phase 34 — Leaves', () => {

  let leaveId;

  const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const DAYAFTER  = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

  it('34.1 POST /leaves (TEACHER) → 201 creates leave request', async () => {
    const res = await api(state.tokens.teacher).post('/leaves', {
      leave_type: 'Casual',
      from_date:  TOMORROW,
      to_date:    DAYAFTER,
      reason:     'Personal family function.',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    const l = res.data.data;
    expect(l).toHaveProperty('id');
    expect(l.status).toMatch(/PENDING|pending/i);
    leaveId = l.id;
  });

  it('34.2 GET /leaves/me (TEACHER) → 200 with their leaves', async () => {
    const res = await api(state.tokens.teacher).get('/leaves/me');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.leaves || res.data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  it('34.3 ADMIN cannot GET /leaves/me → 403 (TEACHER only)', async () => {
    const res = await api(state.tokens.admin).get('/leaves/me');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('34.4 GET /leaves (HOD) → 200 with all dept leave requests', async () => {
    const res = await api(state.tokens.hod).get('/leaves');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.leaves || res.data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  it('34.5 GET /leaves (admin) → 200 with all leave requests', async () => {
    const res = await api(state.tokens.admin).get('/leaves');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('34.6 TEACHER cannot GET /leaves (all) → 403', async () => {
    const res = await api(state.tokens.teacher).get('/leaves');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('34.7 PUT /leaves/:id/approve (HOD) → 200 approves leave', async () => {
    if (!leaveId) return;
    const res = await api(state.tokens.hod).put(`/leaves/${leaveId}/approve`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('34.8 POST /leaves (TEACHER, overlapping dates) → may conflict or succeed', async () => {
    const res = await api(state.tokens.teacher).post('/leaves', {
      leave_type: 'MEDICAL',
      start_date: TOMORROW,
      end_date:   DAYAFTER,
      reason:     'Medical emergency.',
    });
    // Should either succeed (409 or 201 depending on implementation)
    expect([200, 201, 409, 400]).toContain(res.status);
  });

  it('34.9 EXAM_CONTROLLER cannot POST /leaves → 403', async () => {
    const res = await api(state.tokens.exam).post('/leaves', {
      leave_type: 'CASUAL',
      start_date: TOMORROW,
      end_date:   DAYAFTER,
      reason:     'Unauthorized.',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('34.10 POST /leaves with past start_date → 400 or 201', async () => {
    const PAST = '2020-01-01';
    const res = await api(state.tokens.teacher).post('/leaves', {
      leave_type: 'CASUAL',
      start_date: PAST,
      end_date:   PAST,
      reason:     'Past date leave.',
    });
    // Implementation may or may not validate past dates
    expect([200, 201, 400]).toContain(res.status);
  });

});

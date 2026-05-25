'use strict';

/**
 * Phase 40 — Miscellaneous Gap Coverage
 *
 * Untested endpoints covered here:
 *   PATCH  /downloads/:id/increment-count     (analytics, public)
 *   PUT    /leaves/:id/reject                 (HOD/admin, symmetric to approve)
 *   PUT    /registration-requests/:id/reject  (HOD/admin, symmetric to approve)
 *   PATCH  /achievements/:id/status           (INACTIVE scenario)
 *   DELETE /departments/:id                   (CENTRAL_ADMIN, cascading)
 */

const { state, api } = require('../config');

describe('Phase 40 — Misc Gap Coverage', () => {

  // ── PATCH /downloads/:id/increment-count ─────────────────────────────────

  it('40.1 PATCH /downloads/:id/increment-count (public) → 200 count +1', async () => {
    const downloadId = state.ids.globalDownload;
    if (!downloadId) return;

    // Get current count
    const before = await api(null).get(`/downloads/${downloadId}`);
    const countBefore = before.data.data?.download_count ?? 0;

    const res = await api(null).patch(`/downloads/${downloadId}/increment-count`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.download_count).toBe(countBefore + 1);
  });

  it('40.2 PATCH /downloads/:id/increment-count multiple times → each increments', async () => {
    const downloadId = state.ids.globalDownload;
    if (!downloadId) return;

    const before = await api(null).get(`/downloads/${downloadId}`);
    const countBefore = before.data.data?.download_count ?? 0;

    await api(null).patch(`/downloads/${downloadId}/increment-count`);
    const res = await api(null).patch(`/downloads/${downloadId}/increment-count`);
    expect(res.status).toBe(200);
    expect(res.data.data.download_count).toBeGreaterThanOrEqual(countBefore + 2);
  });

  it('40.3 PATCH /downloads/999999/increment-count → 404', async () => {
    const res = await api(null).patch('/downloads/999999/increment-count');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── PUT /leaves/:id/reject ────────────────────────────────────────────────

  it('40.4 PUT /leaves/:id/reject (HOD) → 200 status=rejected', async () => {
    // Create a fresh leave request that we can reject
    const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const DAYAFTER  = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);

    const createRes = await api(state.tokens.teacher).post('/leaves', {
      leave_type: 'Casual',
      from_date:  TOMORROW,
      to_date:    DAYAFTER,
      reason:     'Personal errand — for rejection test.',
    });
    expect([200, 201]).toContain(createRes.status);
    const leaveId = createRes.data.data?.id;
    if (!leaveId) return;

    const res = await api(state.tokens.hod).put(`/leaves/${leaveId}/reject`, {
      review_remarks: 'Insufficient notice period.',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.status).toMatch(/rejected/i);
  });

  it('40.5 PUT /leaves/:id/reject already-approved → 409', async () => {
    const TOMORROW = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
    const DAYAFTER  = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10);

    // Create + approve a leave
    const createRes = await api(state.tokens.teacher).post('/leaves', {
      leave_type: 'Casual',
      from_date:  TOMORROW,
      to_date:    DAYAFTER,
      reason:     'Pre-approved leave for rejection conflict test.',
    });
    const leaveId = createRes.data.data?.id;
    if (!leaveId) return;

    await api(state.tokens.hod).put(`/leaves/${leaveId}/approve`);

    const res = await api(state.tokens.hod).put(`/leaves/${leaveId}/reject`);
    // Cannot reject already-approved leave
    expect(res.status).toBe(409);
    expect(res.data.success).toBe(false);
  });

  it('40.6 PUT /leaves/:id/reject (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).put('/leaves/1/reject');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('40.7 PUT /leaves/999999/reject → 404', async () => {
    const res = await api(state.tokens.hod).put('/leaves/999999/reject');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── PUT /registration-requests/:id/reject ────────────────────────────────

  it('40.8 PUT /registration-requests/:id/reject (admin) → 200', async () => {
    // Create a fresh request
    const createRes = await api(state.tokens.hod).post('/registration-requests', {
      request_type:  'FACULTY_ADDITION',
      description:   'Request for rejection test.',
      department_id: state.ids.dept,
    });
    expect([200, 201]).toContain(createRes.status);
    const reqId = createRes.data.data?.id;
    if (!reqId) return;

    const res = await api(state.tokens.admin).put(`/registration-requests/${reqId}/reject`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('40.9 PUT /registration-requests/:id/reject already-approved → 400 or 409', async () => {
    const createRes = await api(state.tokens.hod).post('/registration-requests', {
      request_type:  'INFRASTRUCTURE',
      description:   'Request that will be approved then rejected.',
      department_id: state.ids.dept,
    });
    const reqId = createRes.data.data?.id;
    if (!reqId) return;

    await api(state.tokens.admin).put(`/registration-requests/${reqId}/approve`);
    const res = await api(state.tokens.admin).put(`/registration-requests/${reqId}/reject`);
    expect([400, 409]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('40.10 PUT /registration-requests/:id/reject (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).put('/registration-requests/1/reject');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('40.11 PUT /registration-requests/999999/reject → 404', async () => {
    const res = await api(state.tokens.admin).put('/registration-requests/999999/reject');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── PATCH /achievements/:id/status INACTIVE ───────────────────────────────

  it('40.12 PATCH /achievements/:id/status ARCHIVED (admin) → 200 hidden from public', async () => {
    // Create a fresh achievement (requires department_id, title; valid statuses: DRAFT/PUBLISHED/ARCHIVED)
    const createRes = await api(state.tokens.admin).post('/achievements', {
      department_id:   state.ids.dept,
      title:           'SGSITS Wins National Award 2025',
      description:     'SGSITS team wins national award 2025.',
      category:        'INSTITUTIONAL',
      achievement_year: 2025,
    });
    expect([200, 201]).toContain(createRes.status);
    expect(createRes.data.success).toBe(true);
    const achId = createRes.data.data?.id;
    if (!achId) return;

    // Ensure it is PUBLISHED first
    await api(state.tokens.admin).patch(`/achievements/${achId}/status`, { status: 'PUBLISHED' });

    // Archive it (equivalent to hiding — ARCHIVED is not shown in public list)
    const res = await api(state.tokens.admin).patch(`/achievements/${achId}/status`, {
      status: 'ARCHIVED',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.status).toBe('ARCHIVED');

    // Should not appear in public listing (which only shows PUBLISHED)
    const listRes = await api(null).get('/achievements');
    const found = (listRes.data.data?.achievements || listRes.data.data || []).find(a => a.id === achId);
    expect(found).toBeUndefined();

    // Toggle back to PUBLISHED to confirm round-trip works
    const restore = await api(state.tokens.admin).patch(`/achievements/${achId}/status`, {
      status: 'PUBLISHED',
    });
    expect(restore.status).toBe(200);
    expect(restore.data.data.status).toBe('PUBLISHED');

    // Cleanup — set ARCHIVED then leave (DELETE soft-archives anyway)
    await api(state.tokens.admin).delete(`/achievements/${achId}`);
  });

  it('40.13 PATCH /achievements/:id/status with invalid status → 400', async () => {
    const res = await api(state.tokens.admin).patch('/achievements/1/status', {
      status: 'INACTIVE', // not a valid status
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('40.14 PATCH /achievements/:id/status (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).patch('/achievements/1/status', {
      status: 'DRAFT',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('40.15 PATCH /achievements/999999/status → 404', async () => {
    const res = await api(state.tokens.admin).patch('/achievements/999999/status', {
      status: 'ARCHIVED',
    });
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── DELETE /departments/:id ───────────────────────────────────────────────

  it('40.16 DELETE /departments/:id (admin) → 200 soft-deletes', async () => {
    // Create a FRESH test department to delete (must NOT use state.ids.dept)
    // Slug is auto-generated from name — do not send code/slug fields
    const createRes = await api(state.tokens.admin).post('/departments', {
      name:        `Temp Delete Dept ${Date.now()}`,
      short_name:  'TDD',
      description: 'Temporary department created to test DELETE endpoint.',
    });
    expect([200, 201]).toContain(createRes.status);
    expect(createRes.data.success).toBe(true);
    const deptId = createRes.data.data?.id;
    if (!deptId) return;

    const res = await api(state.tokens.admin).delete(`/departments/${deptId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('40.17 DELETE /departments/999999 → 404', async () => {
    const res = await api(state.tokens.admin).delete('/departments/999999');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('40.18 DELETE /departments/:id (HOD) → 403', async () => {
    const res = await api(state.tokens.hod).delete(`/departments/${state.ids.dept}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('40.19 DELETE /departments/:id unauthenticated → 401', async () => {
    const res = await api(null).delete(`/departments/${state.ids.dept}`);
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

});

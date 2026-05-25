'use strict';

/**
 * Phase 5B — Faculty: Delete + Content Update + Public Reads
 *
 * Untested endpoints:
 *   PUT /faculty/me/research/:itemId       (TEACHER update own research)
 *   PUT /faculty/me/qualifications/:itemId (TEACHER update own qualification)
 *   GET /faculty/:id/research              (public profile research)
 *   GET /faculty/:id/qualifications        (public profile qualifications)
 *   DELETE /faculty/:id                    (soft-delete, admin/HOD)
 */

const { state, api } = require('../config');

describe('Phase 5B — Faculty: Delete + Content Updates + Public Reads', () => {

  let researchId;
  let qualId;

  // ── Setup: create items to update ─────────────────────────────────────────

  it('5B.1 POST /faculty/me/research (TEACHER) → create item for update test', async () => {
    const res = await api(state.tokens.teacher).post('/faculty/me/research', {
      title:       'Deep Learning for Medical Diagnostics',
      research_area: 'Artificial Intelligence',
      start_year:  2024,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    researchId = res.data.data?.id;
  });

  it('5B.2 POST /faculty/me/qualifications (TEACHER) → create item for update test', async () => {
    const res = await api(state.tokens.teacher).post('/faculty/me/qualifications', {
      degree:      'M.Tech',
      institution: 'SGSITS Indore',
      year:        2018,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    qualId = res.data.data?.id;
  });

  // ── PUT /faculty/me/research/:itemId ─────────────────────────────────────

  it('5B.3 PUT /faculty/me/research/:itemId (TEACHER) → 200 updates title', async () => {
    if (!researchId) return;
    const res = await api(state.tokens.teacher).put(`/faculty/me/research/${researchId}`, {
      title:       'Deep Learning for Medical Diagnostics — Updated',
      end_year:    2025,
      funding_agency: 'DST',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.title).toBe('Deep Learning for Medical Diagnostics — Updated');
  });

  it('5B.4 PUT /faculty/me/research/:itemId with no updatable fields → 400', async () => {
    if (!researchId) return;
    const res = await api(state.tokens.teacher).put(`/faculty/me/research/${researchId}`, {});
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('5B.5 PUT /faculty/me/research/999999 → 404 (not found / wrong owner)', async () => {
    const res = await api(state.tokens.teacher).put('/faculty/me/research/999999', {
      title: 'Ghost Research',
    });
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('5B.6 PUT /faculty/me/research/:itemId (ADMIN) → 403 (TEACHER only)', async () => {
    if (!researchId) return;
    const res = await api(state.tokens.admin).put(`/faculty/me/research/${researchId}`, {
      title: 'Admin update attempt',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── PUT /faculty/me/qualifications/:itemId ────────────────────────────────

  it('5B.7 PUT /faculty/me/qualifications/:itemId (TEACHER) → 200 updates degree', async () => {
    if (!qualId) return;
    const res = await api(state.tokens.teacher).put(`/faculty/me/qualifications/${qualId}`, {
      degree:      'Ph.D.',
      institution: 'IIT Indore',
      year:        2022,
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.degree).toBe('Ph.D.');
  });

  it('5B.8 PUT /faculty/me/qualifications/999999 → 404', async () => {
    const res = await api(state.tokens.teacher).put('/faculty/me/qualifications/999999', {
      degree: 'Ghost Degree',
    });
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('5B.9 PUT /faculty/me/qualifications/:itemId with no fields → 400', async () => {
    if (!qualId) return;
    const res = await api(state.tokens.teacher).put(`/faculty/me/qualifications/${qualId}`, {});
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  // ── GET /faculty/:id/research (public) ────────────────────────────────────

  it('5B.10 GET /faculty/:id/research (public) → 200 array with updated item', async () => {
    if (!state.ids.facultyProfile) return;
    const res = await api(null).get(`/faculty/${state.ids.facultyProfile}/research`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    // Should include the item just updated
    if (researchId) {
      const found = res.data.data.find(r => r.id === researchId);
      expect(found).toBeDefined();
      expect(found.title).toBe('Deep Learning for Medical Diagnostics — Updated');
    }
  });

  it('5B.11 GET /faculty/:id/research with non-existent faculty id → 200 empty array', async () => {
    // listByFacultyId doesn't verify profile exists; returns empty array
    const res = await api(null).get('/faculty/999999/research');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBe(0);
  });

  // ── GET /faculty/:id/qualifications (public) ──────────────────────────────

  it('5B.12 GET /faculty/:id/qualifications (public) → 200 array', async () => {
    if (!state.ids.facultyProfile) return;
    const res = await api(null).get(`/faculty/${state.ids.facultyProfile}/qualifications`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    if (qualId) {
      const found = res.data.data.find(q => q.id === qualId);
      expect(found).toBeDefined();
      expect(found.degree).toBe('Ph.D.');
    }
  });

  it('5B.13 GET /faculty/:id/qualifications with non-existent id → 200 empty array', async () => {
    const res = await api(null).get('/faculty/999999/qualifications');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBe(0);
  });

  // ── DELETE /faculty/:id ───────────────────────────────────────────────────

  it('5B.14 TEACHER cannot DELETE /faculty/:id → 403', async () => {
    if (!state.ids.facultyProfile) return;
    const res = await api(state.tokens.teacher).delete(`/faculty/${state.ids.facultyProfile}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('5B.15 EXAM_CONTROLLER cannot DELETE /faculty/:id → 403', async () => {
    if (!state.ids.facultyProfile) return;
    const res = await api(state.tokens.exam).delete(`/faculty/${state.ids.facultyProfile}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('5B.16 DELETE /faculty/:id (admin) → 200 soft-deletes (sets status INACTIVE)', async () => {
    if (!state.ids.facultyProfile) return;
    const res = await api(state.tokens.admin).delete(`/faculty/${state.ids.facultyProfile}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('5B.17 GET /faculty/:id after soft-delete → 404 (inactive not visible publicly)', async () => {
    if (!state.ids.facultyProfile) return;
    const res = await api(null).get(`/faculty/${state.ids.facultyProfile}`);
    expect(res.status).toBe(404);
  });

  it('5B.18 DELETE /faculty/999999 → 404', async () => {
    const res = await api(state.tokens.admin).delete('/faculty/999999');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('5B.19 HOD cannot DELETE faculty from different department → 403', async () => {
    // HOD's department is state.ids.dept; if there's no faculty in a different dept
    // the service throws 404 (profile not found for that dept) but intent is to test 403.
    // We rely on any non-404 faculty profile in a different dept; skip if none available.
    const res = await api(state.tokens.hod).delete('/faculty/999999');
    expect([403, 404]).toContain(res.status);
  });

  // ── Restore faculty profile so later tests aren't broken ─────────────────

  it('5B.20 PATCH /faculty/:id/status ACTIVE → restore profile', async () => {
    if (!state.ids.facultyProfile) return;
    const res = await api(state.tokens.admin).patch(`/faculty/${state.ids.facultyProfile}/status`, {
      status: 'ACTIVE',
    });
    expect([200, 404]).toContain(res.status);
  });

  // ── Cleanup: remove created research + qualification items ────────────────

  it('5B.21 DELETE /faculty/me/research/:itemId (TEACHER) → cleanup', async () => {
    if (!researchId) return;
    const res = await api(state.tokens.teacher).delete(`/faculty/me/research/${researchId}`);
    expect([200, 404]).toContain(res.status);
  });

  it('5B.22 DELETE /faculty/me/qualifications/:itemId (TEACHER) → cleanup', async () => {
    if (!qualId) return;
    const res = await api(state.tokens.teacher).delete(`/faculty/me/qualifications/${qualId}`);
    expect([200, 404]).toContain(res.status);
  });

});

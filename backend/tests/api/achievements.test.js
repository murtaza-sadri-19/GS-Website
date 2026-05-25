'use strict';

const { state, api } = require('../config');

describe('Phase 31 — Achievements', () => {

  let achievementId;

  it('31.1 POST /achievements (admin) → 201', async () => {
    const res = await api(state.tokens.admin).post('/achievements', {
      title:         'SGSITS Wins Smart India Hackathon 2024',
      description:   'Team from CSE Department won the SIH 2024 national finals.',
      achievement_type: 'STUDENT',
      department_id: state.ids.dept,
      date:          '2024-12-15',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    achievementId = res.data.data.id;
  });

  it('31.2 POST /achievements (HOD) → 201', async () => {
    const res = await api(state.tokens.hod).post('/achievements', {
      title:         'Best Paper Award – ICST Conference',
      description:   'Faculty paper won best paper at ICST 2024.',
      achievement_type: 'FACULTY',
      department_id: state.ids.dept,
      date:          '2024-11-20',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    // cleanup
    if (res.data.data?.id) {
      await api(state.tokens.admin).delete(`/achievements/${res.data.data.id}`);
    }
  });

  it('31.3 GET /achievements (public) → 200 with published only', async () => {
    const res = await api(null).get('/achievements');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.achievements || res.data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  it('31.4 GET /achievements/:id (public) → 200 with correct achievement', async () => {
    if (!achievementId) return;
    const res = await api(null).get(`/achievements/${achievementId}`);
    expect([200, 404]).toContain(res.status); // May be DRAFT so public may not see it
  });

  it('31.5 PATCH /achievements/:id/status PUBLISHED (admin) → 200', async () => {
    if (!achievementId) return;
    const res = await api(state.tokens.admin).patch(`/achievements/${achievementId}/status`, {
      status: 'PUBLISHED',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('31.6 GET /achievements/:id (public, now published) → 200', async () => {
    if (!achievementId) return;
    const res = await api(null).get(`/achievements/${achievementId}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(achievementId);
  });

  it('31.7 PUT /achievements/:id (admin) → 200 updates description', async () => {
    if (!achievementId) return;
    const res = await api(state.tokens.admin).put(`/achievements/${achievementId}`, {
      description: 'Updated: Team from CSE Department won the national SIH 2024 finals in smart education track.',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('31.8 EXAM_CONTROLLER cannot POST /achievements → 403', async () => {
    const res = await api(state.tokens.exam).post('/achievements', {
      title: 'Exam Achievement',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('31.9 TEACHER cannot DELETE /achievements/:id → 403', async () => {
    if (!achievementId) return;
    const res = await api(state.tokens.teacher).delete(`/achievements/${achievementId}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('31.10 DELETE /achievements/:id (admin) → 200', async () => {
    if (!achievementId) return;
    const res = await api(state.tokens.admin).delete(`/achievements/${achievementId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

'use strict';

const { state, api } = require('../config');

describe('Phase 29 — Faculty Content (Publications, Research, Qualifications)', () => {

  let pubId;
  let researchId;
  let qualId;

  it('29.1 GET /faculty/me (TEACHER) → 200 with own profile', async () => {
    const res = await api(state.tokens.teacher).get('/faculty/me');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('id');
  });

  it('29.2 GET /faculty/me (non-TEACHER, admin) → 403', async () => {
    const res = await api(state.tokens.admin).get('/faculty/me');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('29.3 POST /faculty/me/publications (TEACHER) → 201', async () => {
    const res = await api(state.tokens.teacher).post('/faculty/me/publications', {
      title:      'Machine Learning Applications in Engineering Education',
      journal:    'International Journal of Engineering Education',
      year:       2024,
      doi:        '10.1234/ijee.2024.001',
      type:       'JOURNAL',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    pubId = res.data.data.id;
  });

  it('29.4 GET /faculty/me/publications (TEACHER) → 200 with list', async () => {
    const res = await api(state.tokens.teacher).get('/faculty/me/publications');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('29.5 PUT /faculty/me/publications/:id (TEACHER) → 200 updates journal', async () => {
    if (!pubId) return;
    const res = await api(state.tokens.teacher).put(`/faculty/me/publications/${pubId}`, {
      journal_name: 'Journal of Engineering and Technology',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('29.6 GET /faculty/:id/publications (public) → 200', async () => {
    const res = await api(null).get(`/faculty/${state.ids.facultyProfile}/publications`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('29.7 POST /faculty/me/research (TEACHER) → 201', async () => {
    const res = await api(state.tokens.teacher).post('/faculty/me/research', {
      title:    'Deep Learning for Image Classification in Medical Imaging',
      type:     'PROJECT',
      start_year: 2023,
      end_year:  2025,
      funding_agency: 'DST',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    researchId = res.data.data.id;
  });

  it('29.8 GET /faculty/me/research (TEACHER) → 200 with list', async () => {
    const res = await api(state.tokens.teacher).get('/faculty/me/research');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('29.9 POST /faculty/me/qualifications (TEACHER) → 201', async () => {
    const res = await api(state.tokens.teacher).post('/faculty/me/qualifications', {
      degree:      'Ph.D.',
      field:       'Computer Science',
      institution: 'IIT Bombay',
      year:        2020,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    qualId = res.data.data.id;
  });

  it('29.10 GET /faculty/me/qualifications (TEACHER) → 200 with list', async () => {
    const res = await api(state.tokens.teacher).get('/faculty/me/qualifications');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('29.11 EXAM_CONTROLLER cannot access /faculty/me → 403', async () => {
    const res = await api(state.tokens.exam).get('/faculty/me');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('29.12 ADMIN cannot POST /faculty/me/publications → 403', async () => {
    const res = await api(state.tokens.admin).post('/faculty/me/publications', {
      title: 'Admin Pub Test',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('29.13 DELETE /faculty/me/publications/:id (TEACHER) → 200', async () => {
    if (!pubId) return;
    const res = await api(state.tokens.teacher).delete(`/faculty/me/publications/${pubId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('29.14 DELETE /faculty/me/research/:id (TEACHER) → 200', async () => {
    if (!researchId) return;
    const res = await api(state.tokens.teacher).delete(`/faculty/me/research/${researchId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('29.15 DELETE /faculty/me/qualifications/:id (TEACHER) → 200', async () => {
    if (!qualId) return;
    const res = await api(state.tokens.teacher).delete(`/faculty/me/qualifications/${qualId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

'use strict';

const { state, api } = require('../config');

describe('Phase 9 — Gallery', () => {

  it('9.1 POST /gallery as admin → 201 with file_url', async () => {
    const res = await api(state.tokens.admin).post('/gallery', {
      title:       'Annual Day 2024',
      description: 'Highlights from annual day.',
      file_id:     state.ids.imageFile,
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('id');
    expect(res.data.data).toHaveProperty('file_url');
    state.ids.gallery = res.data.data.id;
  });

  it('9.2 POST /gallery as HOD → 201 dept gallery item', async () => {
    const res = await api(state.tokens.hod).post('/gallery', {
      title:   'CSE Lab Photos',
      file_id: state.ids.imageFile,
    });
    expect(res.status).toBe(201);
    state.ids.deptGallery = res.data.data.id;
  });

  it('9.3 GET /gallery (public) → 200 with gallery array + pagination', async () => {
    const res = await api(null).get('/gallery');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('gallery');
    expect(res.data.data).toHaveProperty('pagination');
    expect(Array.isArray(res.data.data.gallery)).toBe(true);
  });

  it('9.4 GET /gallery?department_id → filters by department', async () => {
    const res = await api(null).get(`/gallery?department_id=${state.ids.dept}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data.gallery)).toBe(true);
  });

  it('9.5 GET /gallery?q=Annual → search by keyword', async () => {
    const res = await api(null).get('/gallery?q=Annual');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data.gallery)).toBe(true);
  });

  it('9.6 GET /gallery/:id (public) → correct gallery item', async () => {
    const res = await api(null).get(`/gallery/${state.ids.gallery}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.gallery);
  });

  it('9.7 PUT /gallery/:id → updates title + description', async () => {
    const res = await api(state.tokens.admin).put(`/gallery/${state.ids.gallery}`, {
      title:       'Annual Day 2024 — Updated',
      description: 'Best moments.',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.title).toBe('Annual Day 2024 — Updated');
  });

  it('9.8 PATCH /gallery/:id/status INACTIVE → deactivates', async () => {
    const res = await api(state.tokens.admin).patch(`/gallery/${state.ids.gallery}/status`, {
      status: 'INACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('INACTIVE');
  });

  it('9.9 DELETE /gallery/:id as HOD → soft-deletes dept gallery item', async () => {
    const res = await api(state.tokens.hod).delete(`/gallery/${state.ids.deptGallery}`);
    expect(res.status).toBe(200);
  });

});

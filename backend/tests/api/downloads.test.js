'use strict';

const { state, api } = require('../config');

describe('Phase 7 — Downloads', () => {

  it('7.1 POST /downloads as admin → 201 global download', async () => {
    const res = await api(state.tokens.admin).post('/downloads', {
      title:    'Admission Form 2025',
      category: 'Form',
      file_id:  state.ids.downloadFile,
    });
    expect(res.status).toBe(201);
    expect(res.data.data).toMatchObject({ title: 'Admission Form 2025', category: 'Form' });
    expect(res.data.data.download_count).toBe(0);
    state.ids.globalDownload = res.data.data.id;
  });

  it('7.2 POST /downloads as HOD → 201 dept download (dept forced)', async () => {
    const res = await api(state.tokens.hod).post('/downloads', {
      title:    'CSE Syllabus 2025',
      category: 'Syllabus',
      file_id:  state.ids.downloadFile,
    });
    expect(res.status).toBe(201);
    expect(res.data.data.department_id).toBe(state.ids.dept);
    state.ids.deptDownload = res.data.data.id;
  });

  it('7.3 GET /downloads (public) → 200 with downloads + pagination', async () => {
    const res = await api(null).get('/downloads');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('downloads');
    expect(res.data.data).toHaveProperty('pagination');
  });

  it('7.4 GET /downloads?category=Form → only Form category', async () => {
    const res = await api(null).get('/downloads?category=Form');
    expect(res.status).toBe(200);
    res.data.data.downloads.forEach(d => expect(d.category).toBe('Form'));
  });

  it('7.5 GET /downloads?department_id → filters by department', async () => {
    const res = await api(null).get(`/downloads?department_id=${state.ids.dept}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data.downloads)).toBe(true);
  });

  it('7.6 GET /downloads/:id (public) → includes file_url', async () => {
    const res = await api(null).get(`/downloads/${state.ids.globalDownload}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.globalDownload);
    expect(res.data.data).toHaveProperty('file_url');
  });

  it('7.7 PATCH /downloads/:id/increment-count (public) → count becomes 1', async () => {
    const res = await api(null).patch(`/downloads/${state.ids.globalDownload}/increment-count`);
    expect(res.status).toBe(200);
    expect(res.data.data.download_count).toBe(1);
  });

  it('7.8 Increment again → count becomes 2', async () => {
    const res = await api(null).patch(`/downloads/${state.ids.globalDownload}/increment-count`);
    expect(res.status).toBe(200);
    expect(res.data.data.download_count).toBe(2);
  });

  it('7.9 PUT /downloads/:id as admin → updates title', async () => {
    const res = await api(state.tokens.admin).put(`/downloads/${state.ids.globalDownload}`, {
      title: 'Admission Form 2025 (Updated)',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.title).toBe('Admission Form 2025 (Updated)');
  });

  it('7.10 HOD cannot update global download (null dept) → 403', async () => {
    const res = await api(state.tokens.hod).put(`/downloads/${state.ids.globalDownload}`, {
      title: 'HOD trying to update global',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('7.11 PATCH /downloads/:id/status INACTIVE as HOD → deactivates', async () => {
    const res = await api(state.tokens.hod).patch(`/downloads/${state.ids.deptDownload}/status`, {
      status: 'INACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('INACTIVE');
  });

  it('7.12 PATCH /downloads/:id/status ACTIVE as HOD → reactivates', async () => {
    const res = await api(state.tokens.hod).patch(`/downloads/${state.ids.deptDownload}/status`, {
      status: 'ACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('ACTIVE');
  });

  it('7.13 DELETE /downloads/:id as HOD → soft delete', async () => {
    const res = await api(state.tokens.hod).delete(`/downloads/${state.ids.deptDownload}`);
    expect(res.status).toBe(200);
  });

});

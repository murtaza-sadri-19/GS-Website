'use strict';

const { state, api } = require('../config');

describe('Phase 32 — Files: External Link Registration', () => {

  let linkId;

  it('32.1 POST /files/link (admin) → 201 registers external URL', async () => {
    const res = await api(state.tokens.admin).post('/files/link', {
      external_url:  'https://www.sgsits.ac.in/syllabus.pdf',
      original_name: 'SGSITS Syllabus 2024',
      alt_text:      'Download the official SGSITS syllabus',
      meta_title:    'SGSITS Syllabus',
      usage:         'downloads',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    const f = res.data.data;
    expect(f).toHaveProperty('id');
    expect(f.attachment_type).toBe('EXTERNAL_LINK');
    expect(f.file_url).toContain('sgsits.ac.in');
    linkId = f.id;
  });

  it('32.2 GET /files/:id → 200 returns external link record', async () => {
    if (!linkId) return;
    const res = await api(state.tokens.admin).get(`/files/${linkId}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(linkId);
    expect(res.data.data.attachment_type).toBe('EXTERNAL_LINK');
  });

  it('32.3 PATCH /files/link/:id (admin) → updates metadata', async () => {
    if (!linkId) return;
    const res = await api(state.tokens.admin).patch(`/files/link/${linkId}`, {
      original_name: 'SGSITS Syllabus 2025 (Updated)',
      alt_text:      'Updated syllabus for 2025',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.original_name).toBe('SGSITS Syllabus 2025 (Updated)');
  });

  it('32.4 POST /files/link with invalid URL → 400', async () => {
    const res = await api(state.tokens.admin).post('/files/link', {
      external_url: 'not-a-valid-url',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('32.5 POST /files/link with localhost URL → 400 (security)', async () => {
    const res = await api(state.tokens.admin).post('/files/link', {
      external_url: 'http://localhost:3306/admin',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('32.6 POST /files/link with missing external_url → 400', async () => {
    const res = await api(state.tokens.admin).post('/files/link', {
      original_name: 'No URL Link',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('32.7 EXAM_CONTROLLER can register external link (any auth user allowed)', async () => {
    const res = await api(state.tokens.exam).post('/files/link', {
      external_url:  'https://www.example.com/exam-timetable.pdf',
      original_name: 'Exam Timetable',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    // cleanup
    if (res.data.data?.id) {
      await api(state.tokens.exam).delete(`/files/${res.data.data.id}`);
    }
  });

  it('32.8 PATCH /files/link/:id on a FILE attachment → 400', async () => {
    // imageFile is a real upload, not EXTERNAL_LINK
    if (!state.ids.imageFile) return;
    const res = await api(state.tokens.admin).patch(`/files/link/${state.ids.imageFile}`, {
      original_name: 'Should Fail',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('32.9 DELETE /files/link/:id (admin) → 200', async () => {
    if (!linkId) return;
    const res = await api(state.tokens.admin).delete(`/files/${linkId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

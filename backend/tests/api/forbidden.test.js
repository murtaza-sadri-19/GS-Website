'use strict';

const { state, api } = require('../config');

const TODAY = new Date().toISOString().slice(0, 10);

describe('Phase 14 — Forbidden Access Cases', () => {

  it('14.1 TEACHER cannot POST /notices → 403', async () => {
    const res = await api(state.tokens.teacher).post('/notices', {
      title:        'Test',
      notice_type:  'GENERAL',
      publish_date: TODAY,
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('14.2 TEACHER cannot GET /users → 403', async () => {
    const res = await api(state.tokens.teacher).get('/users');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('14.3 EXAM_CONTROLLER cannot POST /downloads → 403', async () => {
    const res = await api(state.tokens.exam).post('/downloads', {
      title:    'Test',
      category: 'Form',
      file_id:  state.ids.downloadFile,
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('14.4 PLACEMENT_OFFICER cannot POST /events → 403', async () => {
    const res = await api(state.tokens.placement).post('/events', {
      title:      'Test Event',
      event_date: '2025-05-01',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('14.5 HOD managing own dept faculty → 200 (same dept, NOT 403)', async () => {
    // HOD and faculty_profile are in the same department — this must succeed.
    // To get a true 403, you would need a faculty from a different department (see TESTING_NOTES.md).
    const deactivate = await api(state.tokens.hod).patch(
      `/faculty/${state.ids.facultyProfile}/status`,
      { status: 'INACTIVE' }
    );
    expect(deactivate.status).toBe(200);
    // Reactivate so later tests still see this profile as ACTIVE
    await api(state.tokens.admin).patch(
      `/faculty/${state.ids.facultyProfile}/status`,
      { status: 'ACTIVE' }
    );
  });

  it('14.6 No token on protected route → 401', async () => {
    const res = await api(null).post('/notices', { title: 'Test' });
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('14.7 Invalid/garbage token → 401', async () => {
    const res = await api('invalid.token.here').get('/users');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('14.8 EXAM_CONTROLLER cannot POST /placement/records → 403', async () => {
    const res = await api(state.tokens.exam).post('/placement/records', {
      title:       'Test',
      record_type: 'NOTICE',
      description: 'Test',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('14.9 PLACEMENT_OFFICER cannot POST /exam/documents → 403', async () => {
    const res = await api(state.tokens.placement).post('/exam/documents', {
      title:         'Test',
      document_type: 'NOTICE',
      file_id:       state.ids.examFile,
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

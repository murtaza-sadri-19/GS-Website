'use strict';

const { state, api } = require('../config');

const TODAY = new Date().toISOString().slice(0, 10);

describe('Phase 11 — Exam Documents', () => {

  it('11.1 POST /exam/documents NOTICE → 201 status ACTIVE', async () => {
    const res = await api(state.tokens.exam).post('/exam/documents', {
      title:         'Mid-Term Exam Notification',
      document_type: 'NOTICE',
      description:   'Mid-term exams will be held from 20th Feb.',
      file_id:       state.ids.examFile,
      publish_date:  TODAY,
    });
    expect(res.status).toBe(201);
    expect(res.data.data).toMatchObject({ document_type: 'NOTICE', status: 'ACTIVE' });
    state.ids.examNoticeDoc = res.data.data.id;
  });

  it('11.2 POST /exam/documents TIMETABLE → 201', async () => {
    const res = await api(state.tokens.exam).post('/exam/documents', {
      title:         'Mid-Term Timetable Feb 2025',
      document_type: 'TIMETABLE',
      file_id:       state.ids.examFile,
    });
    expect(res.status).toBe(201);
    state.ids.timetable = res.data.data.id;
  });

  it('11.3 POST /exam/documents RESULT → 201', async () => {
    const res = await api(state.tokens.exam).post('/exam/documents', {
      title:         'Semester 3 Results',
      document_type: 'RESULT',
      file_id:       state.ids.examFile,
    });
    expect(res.status).toBe(201);
    state.ids.result = res.data.data.id;
  });

  it('11.4 POST /exam/documents ACADEMIC_CALENDAR → 201', async () => {
    const res = await api(state.tokens.exam).post('/exam/documents', {
      title:         'Academic Calendar 2025-26',
      document_type: 'ACADEMIC_CALENDAR',
      file_id:       state.ids.examFile,
    });
    expect(res.status).toBe(201);
  });

  it('11.5 GET /exam/documents (public) → 200 with documents + pagination', async () => {
    const res = await api(null).get('/exam/documents');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('documents');
    expect(res.data.data).toHaveProperty('pagination');
  });

  it('11.6 GET /exam/notices → 200', async () => {
    const res = await api(null).get('/exam/notices');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data.documents)).toBe(true);
  });

  it('11.7 GET /exam/timetables → 200', async () => {
    const res = await api(null).get('/exam/timetables');
    expect(res.status).toBe(200);
  });

  it('11.8 GET /exam/results → 200', async () => {
    const res = await api(null).get('/exam/results');
    expect(res.status).toBe(200);
  });

  it('11.9 GET /exam/academic-calendar → 200', async () => {
    const res = await api(null).get('/exam/academic-calendar');
    expect(res.status).toBe(200);
  });

  it('11.10 GET /exam/documents/:id (public) → correct document', async () => {
    const res = await api(null).get(`/exam/documents/${state.ids.timetable}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.timetable);
    expect(res.data.data).toHaveProperty('file_url');
  });

  it('11.11 PUT /exam/documents/:id → updates title', async () => {
    const res = await api(state.tokens.exam).put(`/exam/documents/${state.ids.timetable}`, {
      title: 'Mid-Term Timetable Feb 2025 (Revised)',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.title).toBe('Mid-Term Timetable Feb 2025 (Revised)');
  });

  it('11.12 PUT with document_type change → 400', async () => {
    const res = await api(state.tokens.exam).put(`/exam/documents/${state.ids.timetable}`, {
      document_type: 'RESULT',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('11.13 PATCH /exam/documents/:id/status INACTIVE → deactivates', async () => {
    const res = await api(state.tokens.exam).patch(
      `/exam/documents/${state.ids.result}/status`,
      { status: 'INACTIVE' }
    );
    expect(res.status).toBe(200);
  });

  it('11.14 DELETE /exam/documents/:id → soft delete', async () => {
    const res = await api(state.tokens.exam).delete(`/exam/documents/${state.ids.examNoticeDoc}`);
    expect(res.status).toBe(200);
  });

  it('11.15 CENTRAL_ADMIN cannot create exam documents → 403', async () => {
    const res = await api(state.tokens.admin).post('/exam/documents', {
      title:         'Test',
      document_type: 'NOTICE',
      file_id:       state.ids.examFile,
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

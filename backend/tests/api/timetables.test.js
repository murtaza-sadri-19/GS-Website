'use strict';

const { state, api } = require('../config');

describe('Phase 35 — Timetables', () => {

  let timetableId;

  it('35.1 POST /timetables (HOD) → 201 creates timetable', async () => {
    const res = await api(state.tokens.hod).post('/timetables', {
      name:          'B.Tech CSE 3rd Sem — Odd 2025',
      department_id: state.ids.dept,
      semester:      3,
      academic_year: '2025-2026',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    timetableId = res.data.data.id;
  });

  it('35.2 GET /timetables (authenticated) → 200 with list', async () => {
    const res = await api(state.tokens.admin).get('/timetables');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.timetables || res.data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  it('35.3 GET /timetables/:id (authenticated) → 200 with entries', async () => {
    if (!timetableId) return;
    const res = await api(state.tokens.admin).get(`/timetables/${timetableId}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(timetableId);
  });

  it('35.4 GET /timetables/me (TEACHER) → 200 with own timetable', async () => {
    const res = await api(state.tokens.teacher).get('/timetables/me');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('35.5 GET /timetables (unauthenticated) → 401', async () => {
    const res = await api(null).get('/timetables');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('35.6 PUT /timetables/:id (HOD) → 200 updates timetable', async () => {
    if (!timetableId) return;
    const res = await api(state.tokens.hod).put(`/timetables/${timetableId}`, {
      name: 'B.Tech CSE 3rd Sem — Odd 2025 (Revised)',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('35.7 PUT /timetables/:id/entries (HOD) → 200 adds schedule entries', async () => {
    if (!timetableId) return;
    const res = await api(state.tokens.hod).put(`/timetables/${timetableId}/entries`, {
      entries: [
        { day: 'MONDAY',    period: 1, subject: 'Data Structures', teacher_id: null, room: '101' },
        { day: 'MONDAY',    period: 2, subject: 'Algorithms',      teacher_id: null, room: '102' },
        { day: 'TUESDAY',   period: 1, subject: 'DBMS',            teacher_id: null, room: '103' },
      ],
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('35.8 EXAM_CONTROLLER cannot POST /timetables → 403', async () => {
    const res = await api(state.tokens.exam).post('/timetables', {
      name: 'Exam Timetable',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('35.9 TEACHER cannot DELETE /timetables/:id → 403', async () => {
    if (!timetableId) return;
    const res = await api(state.tokens.teacher).delete(`/timetables/${timetableId}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('35.10 DELETE /timetables/:id (HOD) → 200', async () => {
    if (!timetableId) return;
    const res = await api(state.tokens.hod).delete(`/timetables/${timetableId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

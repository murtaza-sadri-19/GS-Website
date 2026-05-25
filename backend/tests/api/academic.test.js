'use strict';

const { state, api } = require('../config');

describe('Phase 33 — Academic (Sessions, Courses, Sections, Subjects)', () => {

  let sessionId;
  let courseId;
  let sectionId;
  let subjectId;

  it('33.1 GET /academic/sessions (public) → 200 with sessions array', async () => {
    const res = await api(null).get('/academic/sessions');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('33.2 GET /academic/sessions/latest (public) → 200 with latest session', async () => {
    const res = await api(null).get('/academic/sessions/latest');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33.3 POST /academic/sessions (admin) → 201 creates new session', async () => {
    const ts = Date.now() % 10000;
    const res = await api(state.tokens.admin).post('/academic/sessions', {
      start_month: 7,
      start_year:  2020 + (ts % 5),
      end_month:   6,
      end_year:    2021 + (ts % 5),
    });
    expect([200, 201, 409]).toContain(res.status);
    if ((res.status === 201 || res.status === 200) && res.data.data?.id) {
      expect(res.data.success).toBe(true);
      sessionId = res.data.data.id;
    }
    // Fallback: if 409 (already exists), fetch any existing session for subsequent tests
    if (!sessionId) {
      const listRes = await api(null).get('/academic/sessions');
      if (listRes.data.data?.length) sessionId = listRes.data.data[0].id;
    }
  });

  it('33.4 POST /academic/sessions (EXAM_CONTROLLER) → 201', async () => {
    const ts = Date.now() % 10000;
    const res = await api(state.tokens.exam).post('/academic/sessions', {
      start_month: 8,
      start_year:  2030 + (ts % 5),
      end_month:   5,
      end_year:    2031 + (ts % 5),
    });
    expect([200, 201, 409]).toContain(res.status);
    if (res.status === 201 || res.status === 200) {
      expect(res.data.success).toBe(true);
    }
  });

  it('33.5 HOD cannot POST /academic/sessions → 403', async () => {
    const res = await api(state.tokens.hod).post('/academic/sessions', {
      name:       'HOD Session',
      start_year: 2025,
      end_year:   2026,
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33.6 TEACHER cannot POST /academic/sessions → 403', async () => {
    const res = await api(state.tokens.teacher).post('/academic/sessions', {
      name: 'Teacher Session',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33.7 GET /academic/courses (authenticated) → 200', async () => {
    const res = await api(state.tokens.admin).get('/academic/courses');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33.8 POST /academic/courses (admin) → 201', async () => {
    const res = await api(state.tokens.admin).post('/academic/courses', {
      course_name:    'B.Tech CSE',
      course_code:    `BTECH-CSE-${Date.now()}`,
      specialization: 'Computer Science',
      department_id:  state.ids.dept,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    courseId = res.data.data.id;
  });

  it('33.9 GET /academic/sections (authenticated) → 200', async () => {
    const res = await api(state.tokens.admin).get('/academic/sections');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33.10 POST /academic/sections (HOD) → 201 or 200', async () => {
    if (!courseId) return;
    // Service requires: department_id, course_id, count (creates sections A, B, ... based on count)
    const res = await api(state.tokens.hod).post('/academic/sections', {
      department_id: state.ids.dept,
      course_id:     courseId,
      count:         2,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    const sections = res.data.data;
    if (Array.isArray(sections) && sections.length > 0) sectionId = sections[0].id;
  });

  it('33.11 TEACHER cannot POST /academic/sections → 403', async () => {
    const res = await api(state.tokens.teacher).post('/academic/sections', {
      name: 'B',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33.12 GET /academic/subjects (authenticated) → 200', async () => {
    const res = await api(state.tokens.admin).get('/academic/subjects');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33.13 POST /academic/subjects (admin) → 201', async () => {
    if (!courseId || !sessionId) return;
    // Service requires: session_id, subject_code, subject_name, semester, department_id, course_id
    const res = await api(state.tokens.admin).post('/academic/subjects', {
      subject_name:  'Data Structures and Algorithms',
      subject_code:  `DSA-${Date.now()}`,
      session_id:    sessionId,
      course_id:     courseId,
      department_id: state.ids.dept,
      semester:      3,
      subject_type:  'Regular',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    subjectId = res.data.data.id;
  });

  it('33.14 PLACEMENT_OFFICER cannot POST /academic/subjects → 403', async () => {
    const res = await api(state.tokens.placement).post('/academic/subjects', {
      name: 'Unauthorized Subject',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33.15 Unauthenticated GET /academic/courses → 401', async () => {
    const res = await api(null).get('/academic/courses');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('33.16 GET /academic/students (admin) → 200', async () => {
    const res = await api(state.tokens.admin).get('/academic/students');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

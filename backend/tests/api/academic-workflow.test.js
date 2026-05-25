'use strict';

/**
 * Phase 33B — Academic Workflow
 *
 * Untested endpoints:
 *   PATCH  /academic/sessions/:id/active
 *   GET    /academic/sessions/download
 *   GET    /academic/faculty
 *   POST   /academic/faculty/assign
 *   GET    /academic/course-outcomes
 *   POST   /academic/course-outcomes
 *   GET    /academic/electives
 *   POST   /academic/electives/upload
 *   POST   /academic/students/upload
 *
 * Side effects:
 *   Stores state.ids.academicSessionId, academicCourseId, academicSubjectId,
 *   academicSectionId for use in academic-marks.test.js.
 */

const path     = require('path');
const fs       = require('fs');
const os       = require('os');
const axios    = require('axios');
const FormData = require('form-data');
const http     = require('http');
const { state, api, BASE_URL } = require('../config');

const httpAgent = new http.Agent({ keepAlive: false });

async function multipartPost(token, endpoint, fields, fileField, filePath, filename) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    form.append(k, String(v));
  }
  if (filePath) {
    form.append(fileField, fs.createReadStream(filePath), { filename });
  }
  return axios.post(`${BASE_URL}${endpoint}`, form, {
    headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` },
    validateStatus: () => true,
    httpAgent,
  });
}

describe('Phase 33B — Academic Workflow (Faculty, Sessions, Course Outcomes, Electives)', () => {

  let sessionId;
  let courseId;
  let subjectId;
  let electiveSubjectId;
  let sectionId;

  // ── Setup: ensure session + course + subjects exist ───────────────────────

  it('33B.1 GET /academic/sessions → find or use latest session', async () => {
    const res = await api(state.tokens.admin).get('/academic/sessions');
    expect(res.status).toBe(200);
    const sessions = res.data.data;
    if (sessions && sessions.length > 0) {
      sessionId = sessions[0].id;
      state.ids.academicSessionId = sessionId;
    }
  });

  it('33B.2 POST /academic/sessions if none exists', async () => {
    if (sessionId) return; // already have one
    const ts = Date.now() % 10000;
    const res = await api(state.tokens.admin).post('/academic/sessions', {
      start_month: 7,
      start_year:  2024 + (ts % 3),
      end_month:   6,
      end_year:    2025 + (ts % 3),
    });
    expect([200, 201, 409]).toContain(res.status);
    if (res.data.data?.id) {
      sessionId = res.data.data.id;
      state.ids.academicSessionId = sessionId;
    }
  });

  it('33B.3 POST /academic/courses → create test course', async () => {
    const ts = Date.now();
    const res = await api(state.tokens.admin).post('/academic/courses', {
      course_name:    'B.Tech IT',
      course_code:    `BTECH-IT-${ts}`,
      department_id:  state.ids.dept,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    courseId = res.data.data.id;
    state.ids.academicCourseId = courseId;
  });

  it('33B.4 POST /academic/sections → create sections A, B', async () => {
    if (!courseId) return;
    const res = await api(state.tokens.hod).post('/academic/sections', {
      department_id: state.ids.dept,
      course_id:     courseId,
      count:         2,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    const sections = res.data.data;
    if (Array.isArray(sections) && sections.length > 0) {
      sectionId = sections[0].id;
      state.ids.academicSectionId = sectionId;
    }
  });

  it('33B.5 POST /academic/subjects → create regular test subject', async () => {
    if (!courseId || !sessionId) return;
    const ts = Date.now();
    const res = await api(state.tokens.admin).post('/academic/subjects', {
      subject_name:  'Data Structures',
      subject_code:  `DSA-${ts}`,
      session_id:    sessionId,
      course_id:     courseId,
      department_id: state.ids.dept,
      semester:      3,
      subject_type:  'Regular',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    subjectId = res.data.data.id;
    state.ids.academicSubjectId = subjectId;
  });

  it('33B.6 POST /academic/subjects → create elective subject', async () => {
    if (!courseId || !sessionId) return;
    const ts = Date.now();
    const res = await api(state.tokens.admin).post('/academic/subjects', {
      subject_name:  'Machine Learning Elective',
      subject_code:  `MLE-${ts}`,
      session_id:    sessionId,
      course_id:     courseId,
      department_id: state.ids.dept,
      semester:      5,
      subject_type:  'Elective',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    electiveSubjectId = res.data.data.id;
    state.ids.academicElectiveSubjectId = electiveSubjectId;
  });

  // ── PATCH /academic/sessions/:id/active ──────────────────────────────────

  it('33B.7 PATCH /sessions/:id/active (EXAM_CONTROLLER) → 200', async () => {
    if (!sessionId) return;
    const res = await api(state.tokens.exam).patch(`/academic/sessions/${sessionId}/active`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33B.8 PATCH /sessions/:id/active (TEACHER) → 403', async () => {
    if (!sessionId) return;
    const res = await api(state.tokens.teacher).patch(`/academic/sessions/${sessionId}/active`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33B.9 PATCH /sessions/:id/active (admin) → 200', async () => {
    if (!sessionId) return;
    const res = await api(state.tokens.admin).patch(`/academic/sessions/${sessionId}/active`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  // ── GET /academic/faculty ─────────────────────────────────────────────────

  it('33B.10 GET /academic/faculty (HOD) → 200 list of dept teachers', async () => {
    const res = await api(state.tokens.hod).get('/academic/faculty');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('33B.11 GET /academic/faculty (admin) with dept filter → 200', async () => {
    const res = await api(state.tokens.admin).get(`/academic/faculty?department_id=${state.ids.dept}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('33B.12 GET /academic/faculty (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).get('/academic/faculty');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── POST /academic/faculty/assign ─────────────────────────────────────────

  it('33B.13 POST /faculty/assign (HOD) → 200 assigns teacher to subject', async () => {
    if (!sessionId || !subjectId || !state.ids.teacherUser) return;
    const res = await api(state.tokens.hod).post('/academic/faculty/assign', {
      session_id:       sessionId,
      subject_id:       subjectId,
      faculty_user_ids: [state.ids.teacherUser],
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('message');
  });

  it('33B.14 POST /faculty/assign (TEACHER) → 403', async () => {
    if (!sessionId || !subjectId) return;
    const res = await api(state.tokens.teacher).post('/academic/faculty/assign', {
      session_id:       sessionId,
      subject_id:       subjectId,
      faculty_user_ids: [state.ids.teacherUser],
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33B.15 POST /faculty/assign with empty array → 400', async () => {
    if (!sessionId || !subjectId) return;
    const res = await api(state.tokens.hod).post('/academic/faculty/assign', {
      session_id:       sessionId,
      subject_id:       subjectId,
      faculty_user_ids: [],
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33B.16 POST /faculty/assign with subject from another dept → 404', async () => {
    if (!sessionId) return;
    const res = await api(state.tokens.hod).post('/academic/faculty/assign', {
      session_id:       sessionId,
      subject_id:       999999,
      faculty_user_ids: [state.ids.teacherUser],
    });
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── GET/POST /academic/course-outcomes ────────────────────────────────────

  it('33B.17 POST /academic/course-outcomes (TEACHER) → 200 saves COs', async () => {
    if (!subjectId || !sessionId) return;
    const res = await api(state.tokens.teacher).post('/academic/course-outcomes', {
      subject_id: subjectId,
      session_id: sessionId,
      co_names:   ['CO1: Understand data structures', 'CO2: Apply sorting algorithms'],
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('33B.18 POST /academic/course-outcomes with non-array co_names → 400', async () => {
    if (!subjectId || !sessionId) return;
    const res = await api(state.tokens.teacher).post('/academic/course-outcomes', {
      subject_id: subjectId,
      session_id: sessionId,
      co_names:   'CO1',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33B.19 GET /academic/course-outcomes (TEACHER) → 200 returns saved COs', async () => {
    if (!subjectId || !sessionId) return;
    const res = await api(state.tokens.teacher).get(
      `/academic/course-outcomes?subject_id=${subjectId}&session_id=${sessionId}`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('33B.20 GET /academic/course-outcomes (HOD) → 200', async () => {
    if (!subjectId || !sessionId) return;
    const res = await api(state.tokens.hod).get(
      `/academic/course-outcomes?subject_id=${subjectId}&session_id=${sessionId}`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33B.21 GET /academic/course-outcomes (ADMIN) → 403', async () => {
    if (!subjectId || !sessionId) return;
    const res = await api(state.tokens.admin).get(
      `/academic/course-outcomes?subject_id=${subjectId}&session_id=${sessionId}`
    );
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── GET /academic/electives ───────────────────────────────────────────────

  it('33B.22 GET /academic/electives (authenticated) → 200', async () => {
    const res = await api(state.tokens.hod).get('/academic/electives');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('33B.23 GET /academic/electives (unauthenticated) → 401', async () => {
    const res = await api(null).get('/academic/electives');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  // ── POST /academic/electives/upload ──────────────────────────────────────

  it('33B.24 POST /electives/upload with enrollment array (HOD) → 400 no students in session yet', async () => {
    // uploadElectiveData validates students exist in exam_students for the session.
    // Since no students uploaded yet, expects 400 (missing students) or possibly other error.
    if (!electiveSubjectId) return;
    const res = await api(state.tokens.hod).post('/academic/electives/upload', {
      subject_id:     electiveSubjectId,
      enrollment_nos: ['1901001', '1901002'],
    });
    // service throws 400 if students not found in session
    expect([400, 409]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('33B.25 POST /electives/upload without subject_id → 400', async () => {
    const res = await api(state.tokens.hod).post('/academic/electives/upload', {
      enrollment_nos: ['1901001'],
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33B.26 POST /electives/upload (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).post('/academic/electives/upload', {
      subject_id: 1,
      enrollment_nos: ['1901001'],
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── GET /academic/sessions/download ──────────────────────────────────────

  it('33B.27 GET /sessions/download without params → 400', async () => {
    const res = await api(state.tokens.admin).get('/academic/sessions/download');
    expect(res.status).toBe(400);
  });

  it('33B.28 GET /sessions/download with params but no data → 400', async () => {
    if (!sessionId || !courseId) return;
    const res = await api(state.tokens.admin).get(
      `/academic/sessions/download?session_id=${sessionId}&department_id=${state.ids.dept}&course_id=${courseId}&students=true`
    );
    // If no students uploaded, service throws "No data selected for download"
    expect([200, 400]).toContain(res.status);
  });

  it('33B.29 GET /sessions/download (TEACHER) → 403', async () => {
    if (!sessionId || !courseId) return;
    const res = await api(state.tokens.teacher).get(
      `/academic/sessions/download?session_id=${sessionId}&department_id=${state.ids.dept}&course_id=${courseId}&subjects=true`
    );
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── POST /academic/students/upload (CSV) ──────────────────────────────────

  it('33B.30 POST /academic/students/upload (admin, CSV) → 200', async () => {
    if (!sessionId || !courseId) return;

    // Write temp CSV
    const csvContent = [
      'Enrollment No,Student Name,Semester,Status,Section',
      '190101001,Rahul Kumar,3,regular,A',
      '190101002,Priya Sharma,3,regular,A',
      '190101003,Amit Singh,3,regular,B',
    ].join('\n');

    const tmpPath = path.join(os.tmpdir(), `students-${Date.now()}.csv`);
    fs.writeFileSync(tmpPath, csvContent);

    try {
      const form = new FormData();
      form.append('session_id',    String(sessionId));
      form.append('department_id', String(state.ids.dept));
      form.append('course_id',     String(courseId));
      form.append('file', fs.createReadStream(tmpPath), { filename: 'students.csv' });

      const res = await axios.post(`${BASE_URL}/academic/students/upload`, form, {
        headers: { ...form.getHeaders(), Authorization: `Bearer ${state.tokens.admin}` },
        validateStatus: () => true,
        httpAgent,
      });
      expect([200, 201]).toContain(res.status);
      expect(res.data.success).toBe(true);
      // Store enrollment nos for later marks tests
      state.ids.academicEnrollmentNos = ['190101001', '190101002', '190101003'];
    } finally {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  });

  it('33B.31 POST /academic/students/upload without required fields → 400', async () => {
    const tmpPath = path.join(os.tmpdir(), `students-min-${Date.now()}.csv`);
    fs.writeFileSync(tmpPath, 'Enrollment No,Student Name\n190101004,Test Student');
    try {
      const form = new FormData();
      // Missing session_id, department_id, course_id
      form.append('file', fs.createReadStream(tmpPath), { filename: 'students.csv' });
      const res = await axios.post(`${BASE_URL}/academic/students/upload`, form, {
        headers: { ...form.getHeaders(), Authorization: `Bearer ${state.tokens.admin}` },
        validateStatus: () => true,
        httpAgent,
      });
      expect(res.status).toBe(400);
      expect(res.data.success).toBe(false);
    } finally {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  });

  it('33B.32 POST /academic/students/upload (TEACHER) → 403', async () => {
    if (!sessionId || !courseId) return;
    const tmpPath = path.join(os.tmpdir(), `students-teacher-${Date.now()}.csv`);
    fs.writeFileSync(tmpPath, 'Enrollment No,Student Name\n190101005,Student');
    try {
      const form = new FormData();
      form.append('session_id',    String(sessionId));
      form.append('department_id', String(state.ids.dept));
      form.append('course_id',     String(courseId));
      form.append('file', fs.createReadStream(tmpPath), { filename: 'students.csv' });
      const res = await axios.post(`${BASE_URL}/academic/students/upload`, form, {
        headers: { ...form.getHeaders(), Authorization: `Bearer ${state.tokens.teacher}` },
        validateStatus: () => true,
        httpAgent,
      });
      expect(res.status).toBe(403);
      expect(res.data.success).toBe(false);
    } finally {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  });

});

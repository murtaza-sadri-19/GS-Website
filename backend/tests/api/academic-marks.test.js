'use strict';

/**
 * Phase 33C — Academic Marks Workflow
 *
 * Untested endpoints:
 *   GET    /academic/marks/test-details
 *   POST   /academic/marks/test-details
 *   DELETE /academic/marks/test-details
 *   GET    /academic/marks
 *   POST   /academic/marks/save
 *   POST   /academic/marks/submit
 *   GET    /academic/marks/fill-requests
 *   POST   /academic/marks/fill-requests
 *
 * Prerequisites: academic-workflow.test.js must have run first.
 *   state.ids.academicSubjectId — subject assigned to teacher
 *   state.ids.academicEnrollmentNos — uploaded students
 */

const { state, api } = require('../config');

const COMPONENT     = 'Internal Assessment';
const SUB_COMPONENT = 'IA-1';

describe('Phase 33C — Academic Marks Workflow', () => {

  let subjectId;

  beforeAll(() => {
    subjectId = state.ids.academicSubjectId;
  });

  // ── POST /academic/marks/test-details ────────────────────────────────────

  it('33C.1 POST /marks/test-details (TEACHER) → 201 saves CO max marks', async () => {
    if (!subjectId) return;
    const res = await api(state.tokens.teacher).post('/academic/marks/test-details', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: SUB_COMPONENT,
      co_marks: [
        { co_name: 'CO1', max_marks: 10 },
        { co_name: 'CO2', max_marks: 10 },
      ],
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('message');
  });

  it('33C.2 POST /marks/test-details with missing fields → 400', async () => {
    const res = await api(state.tokens.teacher).post('/academic/marks/test-details', {
      subject_id: subjectId,
      // missing component_name, sub_component_name, co_marks
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33C.3 POST /marks/test-details (EXAM_CONTROLLER) → 403 (TEACHER only for write)', async () => {
    if (!subjectId) return;
    const res = await api(state.tokens.exam).post('/academic/marks/test-details', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: SUB_COMPONENT,
      co_marks:           [{ co_name: 'CO1', max_marks: 5 }],
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33C.4 POST /marks/test-details (ADMIN) → 403', async () => {
    const res = await api(state.tokens.admin).post('/academic/marks/test-details', {
      subject_id: 1, component_name: 'X', sub_component_name: 'Y', co_marks: [],
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── GET /academic/marks/test-details ─────────────────────────────────────

  it('33C.5 GET /marks/test-details (TEACHER) → 200 with saved co_marks', async () => {
    if (!subjectId) return;
    const res = await api(state.tokens.teacher).get(
      `/academic/marks/test-details?subject_id=${subjectId}` +
      `&component_name=${encodeURIComponent(COMPONENT)}` +
      `&sub_component_name=${encodeURIComponent(SUB_COMPONENT)}`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('exists', true);
    expect(Array.isArray(res.data.data.co_marks)).toBe(true);
    expect(res.data.data.co_marks.length).toBeGreaterThan(0);
  });

  it('33C.6 GET /marks/test-details (EXAM_CONTROLLER) → 200', async () => {
    if (!subjectId) return;
    const res = await api(state.tokens.exam).get(
      `/academic/marks/test-details?subject_id=${subjectId}` +
      `&component_name=${encodeURIComponent(COMPONENT)}` +
      `&sub_component_name=${encodeURIComponent(SUB_COMPONENT)}`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33C.7 GET /marks/test-details missing params → 400', async () => {
    const res = await api(state.tokens.teacher).get('/academic/marks/test-details?subject_id=1');
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  // ── POST /academic/marks/save ─────────────────────────────────────────────

  it('33C.8 POST /marks/save (TEACHER) → 200 saves marks as DRAFT', async () => {
    if (!subjectId) return;
    const enrollNos = state.ids.academicEnrollmentNos || ['190101001', '190101002'];
    const data = enrollNos.map(e => ({
      enrollment_no:      e,
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: SUB_COMPONENT,
      co_marks: { CO1: 8, CO2: 7 },
    }));
    const res = await api(state.tokens.teacher).post('/academic/marks/save', { data });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('message');
  });

  it('33C.9 POST /marks/save with non-array data → 400', async () => {
    const res = await api(state.tokens.teacher).post('/academic/marks/save', { data: 'invalid' });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33C.10 POST /marks/save with incomplete entry fields → 400', async () => {
    const res = await api(state.tokens.teacher).post('/academic/marks/save', {
      data: [{ enrollment_no: '190101001' }],
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33C.11 POST /marks/save (ADMIN) → 403', async () => {
    const res = await api(state.tokens.admin).post('/academic/marks/save', { data: [] });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── GET /academic/marks ───────────────────────────────────────────────────

  it('33C.12 GET /marks (TEACHER, assigned subject) → 200 with saved status', async () => {
    if (!subjectId) return;
    const res = await api(state.tokens.teacher).get(
      `/academic/marks?subject_id=${subjectId}` +
      `&component_name=${encodeURIComponent(COMPONENT)}` +
      `&sub_component_name=${encodeURIComponent(SUB_COMPONENT)}`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('status');
    // Status should be 'saved' since we haven't submitted yet
    expect(res.data.data.status).toBe('saved');
  });

  it('33C.13 GET /marks missing params → 400', async () => {
    const res = await api(state.tokens.teacher).get('/academic/marks?subject_id=1');
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33C.14 GET /marks teacher not assigned to subject → 403', async () => {
    const res = await api(state.tokens.teacher).get(
      '/academic/marks?subject_id=999999&component_name=X&sub_component_name=Y'
    );
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33C.15 GET /marks (ADMIN) → 403', async () => {
    const res = await api(state.tokens.admin).get(
      '/academic/marks?subject_id=1&component_name=A&sub_component_name=B'
    );
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── POST /academic/marks/fill-requests ───────────────────────────────────

  it('33C.16 POST /marks/fill-requests (EXAM_CONTROLLER) → 201', async () => {
    if (!subjectId) return;
    const res = await api(state.tokens.exam).post('/academic/marks/fill-requests', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: SUB_COMPONENT,
      last_date:          '2026-06-30',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('request_id');
  });

  it('33C.17 POST /marks/fill-requests (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).post('/academic/marks/fill-requests', {
      subject_id: 1, component_name: 'X', sub_component_name: 'Y', last_date: '2026-06-30',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33C.18 GET /marks/fill-requests (EXAM_CONTROLLER) → 200 all requests', async () => {
    const res = await api(state.tokens.exam).get('/academic/marks/fill-requests');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    // At least the one we just created
    expect(res.data.data.length).toBeGreaterThan(0);
  });

  it('33C.19 GET /marks/fill-requests (TEACHER) → 200 filtered by their ID', async () => {
    const res = await api(state.tokens.teacher).get('/academic/marks/fill-requests');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('33C.20 GET /marks/fill-requests (ADMIN) → 403', async () => {
    const res = await api(state.tokens.admin).get('/academic/marks/fill-requests');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── POST /academic/marks/submit ───────────────────────────────────────────

  it('33C.21 POST /marks/submit (TEACHER) → 200 locks marks as submitted', async () => {
    if (!subjectId) return;
    const enrollNos = state.ids.academicEnrollmentNos || ['190101001', '190101002'];
    const data = enrollNos.map(e => ({
      enrollment_no:      e,
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: SUB_COMPONENT,
      co_marks: { CO1: 9, CO2: 8 },
    }));
    const res = await api(state.tokens.teacher).post('/academic/marks/submit', { data });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('message');
  });

  it('33C.22 POST /marks/submit with empty array → 400', async () => {
    const res = await api(state.tokens.teacher).post('/academic/marks/submit', { data: [] });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33C.23 GET /marks after submit → status: submitted', async () => {
    if (!subjectId) return;
    const res = await api(state.tokens.teacher).get(
      `/academic/marks?subject_id=${subjectId}` +
      `&component_name=${encodeURIComponent(COMPONENT)}` +
      `&sub_component_name=${encodeURIComponent(SUB_COMPONENT)}`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.status).toBe('submitted');
  });

  // ── DELETE /academic/marks/test-details ──────────────────────────────────

  it('33C.24 DELETE /marks/test-details (TEACHER) → 200 deletes component', async () => {
    if (!subjectId) return;
    // Create a fresh sub-component to delete
    const SUB2 = 'IA-Cleanup';
    await api(state.tokens.teacher).post('/academic/marks/test-details', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: SUB2,
      co_marks:           [{ co_name: 'CO1', max_marks: 5 }],
    });

    const res = await api(state.tokens.teacher).delete(
      `/academic/marks/test-details?subject_id=${subjectId}` +
      `&component_name=${encodeURIComponent(COMPONENT)}` +
      `&sub_component_name=${encodeURIComponent(SUB2)}`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33C.25 DELETE /marks/test-details not found → 404', async () => {
    const res = await api(state.tokens.teacher).delete(
      '/academic/marks/test-details?subject_id=999999&component_name=X&sub_component_name=Y'
    );
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('33C.26 DELETE /marks/test-details (ADMIN) → 403', async () => {
    const res = await api(state.tokens.admin).delete(
      '/academic/marks/test-details?subject_id=1&component_name=X&sub_component_name=Y'
    );
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

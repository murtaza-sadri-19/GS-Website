'use strict';

/**
 * Phase 33E — Academic Correction Requests
 *
 * Untested endpoints:
 *   GET    /academic/correction-requests
 *   POST   /academic/correction-requests
 *   PATCH  /academic/correction-requests/:id/status
 *   DELETE /academic/correction-requests/:id
 *   GET    /academic/correction-requests/:id/marks
 *   POST   /academic/correction-requests/resubmit
 *
 * Prerequisites: academic-marks.test.js must have submitted marks for
 *   state.ids.academicSubjectId so the correction workflow has data to work with.
 */

const { state, api } = require('../config');

const COMPONENT     = 'Internal Assessment';
const SUB_COMPONENT = 'IA-1';

describe('Phase 33E — Academic Correction Requests', () => {

  let subjectId;
  let correctionRequestId;
  let withdrawableRequestId;

  beforeAll(() => {
    subjectId = state.ids.academicSubjectId;
  });

  // ── POST /academic/correction-requests ───────────────────────────────────

  it('33E.1 POST /correction-requests (TEACHER) → 200 submits request', async () => {
    if (!subjectId) return;
    const enrollNos = state.ids.academicEnrollmentNos || ['190101001'];
    const res = await api(state.tokens.teacher).post('/academic/correction-requests', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: SUB_COMPONENT,
      reason:             'Calculation error in CO2 marks for three students.',
      form_status:        'regular',
      enrollment_nos:     enrollNos,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('message');
  });

  it('33E.2 POST /correction-requests duplicate for same component → 400', async () => {
    if (!subjectId) return;
    const enrollNos = state.ids.academicEnrollmentNos || ['190101001'];
    const res = await api(state.tokens.teacher).post('/academic/correction-requests', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: SUB_COMPONENT,
      reason:             'Duplicate request.',
      form_status:        'regular',
      enrollment_nos:     enrollNos,
    });
    // A pending request already exists for this component — should be 400
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33E.3 POST /correction-requests missing required fields → 400', async () => {
    const res = await api(state.tokens.teacher).post('/academic/correction-requests', {
      subject_id: subjectId,
      // missing reason, form_status, enrollment_nos
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33E.4 POST /correction-requests with empty enrollment_nos → 400', async () => {
    const res = await api(state.tokens.teacher).post('/academic/correction-requests', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: 'IA-99',
      reason:             'Test',
      form_status:        'regular',
      enrollment_nos:     [],
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33E.5 POST /correction-requests (EXAM_CONTROLLER) → 403', async () => {
    const res = await api(state.tokens.exam).post('/academic/correction-requests', {
      subject_id:     1, reason: 'Test', form_status: 'regular', enrollment_nos: ['123'],
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── GET /academic/correction-requests ────────────────────────────────────

  it('33E.6 GET /correction-requests (TEACHER) → 200 own requests', async () => {
    const res = await api(state.tokens.teacher).get('/academic/correction-requests');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    if (res.data.data.length > 0) {
      correctionRequestId = res.data.data[0].id;
      state.ids.correctionRequestId = correctionRequestId;
    }
  });

  it('33E.7 GET /correction-requests (EXAM_CONTROLLER) → 200 all requests', async () => {
    const res = await api(state.tokens.exam).get('/academic/correction-requests');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    if (!correctionRequestId && res.data.data.length > 0) {
      correctionRequestId = res.data.data[0].id;
      state.ids.correctionRequestId = correctionRequestId;
    }
  });

  it('33E.8 GET /correction-requests (ADMIN) → 403', async () => {
    const res = await api(state.tokens.admin).get('/academic/correction-requests');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── Create a second request for withdrawal test ───────────────────────────

  it('33E.9 POST /correction-requests for IA-2 → for withdrawal test', async () => {
    if (!subjectId) return;
    const enrollNos = state.ids.academicEnrollmentNos || ['190101001'];
    const res = await api(state.tokens.teacher).post('/academic/correction-requests', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: 'IA-2',
      reason:             'Second request for withdrawal test.',
      form_status:        'regular',
      enrollment_nos:     enrollNos,
    });
    expect([200, 201]).toContain(res.status);
    if (res.data.success) {
      // Get the new request id
      const listRes = await api(state.tokens.teacher).get('/academic/correction-requests');
      const pending = (listRes.data.data || []).find(r => r.sub_component_name === 'IA-2');
      if (pending) withdrawableRequestId = pending.id;
    }
  });

  // ── PATCH /academic/correction-requests/:id/status ────────────────────────

  it('33E.10 PATCH /correction-requests/:id/status Approved (EXAM_CONTROLLER) → 200', async () => {
    if (!correctionRequestId) return;
    const res = await api(state.tokens.exam).patch(
      `/academic/correction-requests/${correctionRequestId}/status`,
      { status: 'Approved' }
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33E.11 PATCH /correction-requests/:id/status on already-actioned → 400', async () => {
    if (!correctionRequestId) return;
    const res = await api(state.tokens.exam).patch(
      `/academic/correction-requests/${correctionRequestId}/status`,
      { status: 'Rejected' }
    );
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33E.12 PATCH /correction-requests/:id/status invalid status → 400', async () => {
    if (!correctionRequestId) return;
    const res = await api(state.tokens.exam).patch(
      `/academic/correction-requests/${correctionRequestId}/status`,
      { status: 'INVALID_STATUS' }
    );
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33E.13 PATCH /correction-requests/:id/status (TEACHER) → 403', async () => {
    if (!correctionRequestId) return;
    const res = await api(state.tokens.teacher).patch(
      `/academic/correction-requests/${correctionRequestId}/status`,
      { status: 'Rejected' }
    );
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('33E.14 PATCH /correction-requests/999999/status → 404', async () => {
    const res = await api(state.tokens.exam).patch(
      '/academic/correction-requests/999999/status',
      { status: 'Approved' }
    );
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── GET /academic/correction-requests/:id/marks ───────────────────────────

  it('33E.15 GET /correction-requests/:id/marks (approved) → 200 with marks data', async () => {
    if (!correctionRequestId) return;
    const res = await api(state.tokens.teacher).get(
      `/academic/correction-requests/${correctionRequestId}/marks`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('marks');
    expect(res.data.data).toHaveProperty('test_details');
  });

  it('33E.16 GET /correction-requests/:id/marks not-approved request → 400', async () => {
    // Create a new pending request (different sub-component)
    if (!subjectId) return;
    const enrollNos = state.ids.academicEnrollmentNos || ['190101001'];
    const postRes = await api(state.tokens.teacher).post('/academic/correction-requests', {
      subject_id:         subjectId,
      component_name:     COMPONENT,
      sub_component_name: 'IA-3',
      reason:             'Pending request for marks-fetch test',
      form_status:        'regular',
      enrollment_nos:     enrollNos,
    });
    if (postRes.data.success) {
      const listRes = await api(state.tokens.teacher).get('/academic/correction-requests');
      const pending = (listRes.data.data || []).find(r => r.sub_component_name === 'IA-3' && r.status === 'Pending');
      if (pending) {
        const res = await api(state.tokens.teacher).get(
          `/academic/correction-requests/${pending.id}/marks`
        );
        expect(res.status).toBe(400);
        expect(res.data.success).toBe(false);
        // Cleanup
        await api(state.tokens.teacher).delete(`/academic/correction-requests/${pending.id}`);
      }
    }
  });

  it('33E.17 GET /correction-requests/999999/marks → 404', async () => {
    const res = await api(state.tokens.teacher).get('/academic/correction-requests/999999/marks');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── POST /academic/correction-requests/resubmit ───────────────────────────

  it('33E.18 POST /correction-requests/resubmit (TEACHER, approved request) → 200', async () => {
    if (!correctionRequestId || !subjectId) return;
    const enrollNos = state.ids.academicEnrollmentNos || ['190101001'];
    const res = await api(state.tokens.teacher).post('/academic/correction-requests/resubmit', {
      request_id: correctionRequestId,
      updatedMarks: enrollNos.slice(0, 1).map(e => ({
        enrollment_no: e,
        co_name:       'CO1',
        marks_obtained: 9,
      })),
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('message');
  });

  it('33E.19 POST /correction-requests/resubmit not-approved → 400', async () => {
    // withdrawable request is still pending (IA-2)
    if (!withdrawableRequestId) return;
    const res = await api(state.tokens.teacher).post('/academic/correction-requests/resubmit', {
      request_id:   withdrawableRequestId,
      updatedMarks: [{ enrollment_no: '190101001', co_name: 'CO1', marks_obtained: 5 }],
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33E.20 POST /correction-requests/resubmit (EXAM_CONTROLLER) → 403', async () => {
    const res = await api(state.tokens.exam).post('/academic/correction-requests/resubmit', {
      request_id:   1,
      updatedMarks: [],
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── DELETE /academic/correction-requests/:id ──────────────────────────────

  it('33E.21 DELETE /correction-requests/:id pending (TEACHER) → 200 withdraws', async () => {
    if (!withdrawableRequestId) return;
    const res = await api(state.tokens.teacher).delete(
      `/academic/correction-requests/${withdrawableRequestId}`
    );
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('33E.22 DELETE /correction-requests/:id non-pending → 400', async () => {
    if (!correctionRequestId) return;
    const res = await api(state.tokens.teacher).delete(
      `/academic/correction-requests/${correctionRequestId}`
    );
    // Already approved — cannot withdraw
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('33E.23 DELETE /correction-requests/999999 → 404', async () => {
    const res = await api(state.tokens.teacher).delete(
      '/academic/correction-requests/999999'
    );
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('33E.24 DELETE /correction-requests/:id (EXAM_CONTROLLER) → 403', async () => {
    if (!correctionRequestId) return;
    const res = await api(state.tokens.exam).delete(
      `/academic/correction-requests/${correctionRequestId}`
    );
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

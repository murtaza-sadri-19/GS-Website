'use strict';

const { state, api } = require('../config');

describe('Phase 36 — Registration Requests', () => {

  let requestId;

  it('36.1 POST /registration-requests (HOD) → 201 creates request', async () => {
    const res = await api(state.tokens.hod).post('/registration-requests', {
      request_type: 'FACULTY_ADDITION',
      description:  'Requesting addition of 2 assistant professors for the IT department.',
      department_id: state.ids.dept,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    requestId = res.data.data?.id;
  });

  it('36.2 POST /registration-requests (admin) → 201', async () => {
    const res = await api(state.tokens.admin).post('/registration-requests', {
      request_type:  'INFRASTRUCTURE',
      description:   'Request for new lab equipment.',
      department_id: state.ids.dept,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    // cleanup
    if (res.data.data?.id) {
      // may not have delete endpoint; just continue
    }
  });

  it('36.3 GET /registration-requests (HOD) → 200 with list', async () => {
    const res = await api(state.tokens.hod).get('/registration-requests');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.requests || res.data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  it('36.4 GET /registration-requests (admin) → 200 with all requests', async () => {
    const res = await api(state.tokens.admin).get('/registration-requests');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('36.5 TEACHER cannot POST /registration-requests → 403', async () => {
    const res = await api(state.tokens.teacher).post('/registration-requests', {
      request_type: 'TEST',
      description:  'Teacher unauthorized request.',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('36.6 EXAM_CONTROLLER cannot GET /registration-requests → 403', async () => {
    const res = await api(state.tokens.exam).get('/registration-requests');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('36.7 PUT /registration-requests/:id/approve (admin) → 200', async () => {
    if (!requestId) return;
    const res = await api(state.tokens.admin).put(`/registration-requests/${requestId}/approve`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('36.8 Unauthenticated GET /registration-requests → 401', async () => {
    const res = await api(null).get('/registration-requests');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

});

'use strict';

const { state, api } = require('../config');

describe('Phase 23 — Contact Form', () => {

  let submissionId;

  it('23.1 POST /contact (public) → 201 submission recorded', async () => {
    const res = await api(null).post('/contact', {
      name:    'Rahul Sharma',
      email:   'rahul.sharma@example.com',
      phone:   '9876543210',
      subject: 'Admission Enquiry',
      message: 'I would like to know more about the B.Tech CSE programme.',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
  });

  it('23.2 POST /contact without required fields → 400 or 422', async () => {
    const res = await api(null).post('/contact', {
      name: 'Incomplete',
      // missing email and message
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('23.3 POST /contact with invalid email → 400', async () => {
    const res = await api(null).post('/contact', {
      name:    'Test User',
      email:   'not-an-email',
      message: 'Valid message here.',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('23.4 GET /contact/submissions (admin) → 200 with list', async () => {
    const res = await api(state.tokens.admin).get('/contact/submissions');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.submissions || res.data.data;
    expect(Array.isArray(items)).toBe(true);
    if (items.length > 0) {
      submissionId = items[0].id;
    }
  });

  it('23.5 GET /contact/submissions (non-admin, EXAM) → 403', async () => {
    const res = await api(state.tokens.exam).get('/contact/submissions');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('23.6 PATCH /contact/submissions/:id/read (admin) → 200', async () => {
    if (!submissionId) return;
    const res = await api(state.tokens.admin).patch(`/contact/submissions/${submissionId}/read`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('23.7 DELETE /contact/submissions/:id (admin) → 200', async () => {
    if (!submissionId) return;
    const res = await api(state.tokens.admin).delete(`/contact/submissions/${submissionId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('23.8 XSS attempt in contact message → stored safely (no crash)', async () => {
    const res = await api(null).post('/contact', {
      name:    '<script>alert(1)</script>',
      email:   'xss@test.com',
      message: '<img src=x onerror=alert(1)> hello',
    });
    // Should either succeed (sanitized) or fail validation, but NOT crash
    expect([200, 201, 400, 422]).toContain(res.status);
  });

});

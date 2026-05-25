'use strict';

const { state, api } = require('../config');

describe('Phase 18 — Tenders', () => {

  let tenderId;

  it('18.1 POST /tenders (admin) → 201', async () => {
    const res = await api(state.tokens.admin).post('/tenders', {
      title:          'Construction of New Lab Block — Tender Notice',
      description:    'Sealed tenders are invited for construction work.',
      ref_no:         `TDR-${Date.now()}`,
      opening_date:   '2026-06-01',
      closing_date:   '2026-07-01',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    const t = res.data.data;
    expect(t).toHaveProperty('id');
    tenderId = t.id;
  });

  it('18.2 GET /tenders (public) → 200 array', async () => {
    const res = await api(null).get('/tenders');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.tenders || res.data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  it('18.3 GET /tenders/:id (public) → 200 with correct tender', async () => {
    const res = await api(null).get(`/tenders/${tenderId}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(tenderId);
  });

  it('18.4 PUT /tenders/:id (admin) → updates description', async () => {
    const res = await api(state.tokens.admin).put(`/tenders/${tenderId}`, {
      description: 'Updated tender description.',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('18.5 PATCH /tenders/:id/status (admin) → ARCHIVED', async () => {
    const res = await api(state.tokens.admin).patch(`/tenders/${tenderId}/status`, {
      status: 'ARCHIVED',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('18.6 EXAM_CONTROLLER cannot POST /tenders → 403', async () => {
    const res = await api(state.tokens.exam).post('/tenders', {
      title: 'Unauthorized Tender',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('18.7 HOD cannot DELETE /tenders/:id → 403', async () => {
    const res = await api(state.tokens.hod).delete(`/tenders/${tenderId}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('18.8 POST /tenders without title → 400', async () => {
    const res = await api(state.tokens.admin).post('/tenders', {
      ref_no: 'TDR-NO-TITLE',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('18.9 DELETE /tenders/:id (admin) → 200', async () => {
    const res = await api(state.tokens.admin).delete(`/tenders/${tenderId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

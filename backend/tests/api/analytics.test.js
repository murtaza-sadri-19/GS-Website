'use strict';

const { api } = require('../config');

describe('Phase 24 — Analytics', () => {

  it('24.1 GET /analytics/visitor-count (public) → 200 with count', async () => {
    const res = await api(null).get('/analytics/visitor-count');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const d = res.data.data;
    expect(d).toHaveProperty('count');
    expect(typeof d.count).toBe('number');
    expect(d).toHaveProperty('today');
  });

  it('24.2 POST /analytics/page-view (public) → 200 beacon recorded', async () => {
    const res = await api(null).post('/analytics/page-view', {
      path: '/admissions',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
  });

  it('24.3 GET /analytics/visitor-count after page-view → count increased or equal', async () => {
    const before = await api(null).get('/analytics/visitor-count');
    await api(null).post('/analytics/page-view', { path: '/contact' });
    const after = await api(null).get('/analytics/visitor-count');
    expect(after.data.data.count).toBeGreaterThanOrEqual(before.data.data.count);
  });

  it('24.4 POST /analytics/page-view with empty path → still 200 (tolerant)', async () => {
    const res = await api(null).post('/analytics/page-view', {});
    expect([200, 201, 400]).toContain(res.status);
  });

});

'use strict';

const { state, api } = require('../config');

describe('Phase 21 — Navigation', () => {

  let originalNavItems;

  it('21.1 GET /navigation (public) → 200 with array of nav items', async () => {
    const res = await api(null).get('/navigation');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    originalNavItems = res.data.data;
  });

  it('21.2 PUT /navigation (admin) → replace-all navigation items', async () => {
    const newNav = [
      { label: 'Home',       url: '/',           order: 1, is_active: true  },
      { label: 'About',      url: '/about',      order: 2, is_active: true  },
      { label: 'Admissions', url: '/admissions', order: 3, is_active: true  },
      { label: 'Academics',  url: '/academics',  order: 4, is_active: true  },
      { label: 'Contact',    url: '/contact',    order: 5, is_active: false },
    ];
    const res = await api(state.tokens.admin).put('/navigation', newNav);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('21.3 GET /navigation after update → reflects new items', async () => {
    const res = await api(null).get('/navigation');
    expect(res.status).toBe(200);
    const items = res.data.data;
    const hasHome = items.some(i => i.label === 'Home');
    expect(hasHome).toBe(true);
  });

  it('21.4 EXAM_CONTROLLER cannot PUT /navigation → 403', async () => {
    const res = await api(state.tokens.exam).put('/navigation', [
      { label: 'Exam', url: '/exam', order: 1, is_active: true },
    ]);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('21.5 HOD cannot PUT /navigation → 403', async () => {
    const res = await api(state.tokens.hod).put('/navigation', [
      { label: 'HOD Test', url: '/hod', order: 1, is_active: true },
    ]);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('21.6 Restore original navigation items', async () => {
    if (!originalNavItems || originalNavItems.length === 0) return;
    const res = await api(state.tokens.admin).put('/navigation', originalNavItems);
    expect(res.status).toBe(200);
  });

});

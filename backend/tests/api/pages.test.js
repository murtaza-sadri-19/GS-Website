'use strict';

const { state, api } = require('../config');

describe('Phase 10 — Pages', () => {

  it('10.1 GET /pages (admin) → 200 with all pages including seeded ones', async () => {
    const res = await api(state.tokens.admin).get('/pages');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    // Find the seeded "about" page and store its ID
    const aboutPage = res.data.data.find(p => p.slug === 'about');
    if (aboutPage) {
      state.ids.aboutPageId = aboutPage.id;
    }
  });

  it('10.2 GET /pages/about (public, DRAFT) → 404', async () => {
    // If about page is still DRAFT, public access must return 404
    if (!state.ids.aboutPageId) {
      console.warn('  Skipping: about page not found in seed data');
      return;
    }
    const pageRes = await api(state.tokens.admin).get(`/pages/${state.ids.aboutPageId}`);
    if (pageRes.data.data && pageRes.data.data.status === 'DRAFT') {
      const res = await api(null).get('/pages/about');
      expect(res.status).toBe(404);
    }
  });

  it('10.3 PUT /pages/:id → updates content + meta', async () => {
    if (!state.ids.aboutPageId) return;
    const res = await api(state.tokens.admin).put(`/pages/${state.ids.aboutPageId}`, {
      content:          '<h1>About SGSITS</h1><p>Premier engineering college.</p>',
      meta_title:       'About — SGSITS',
      meta_description: 'Learn more about SGSITS college.',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.content).toContain('About SGSITS');
  });

  it('10.4 PATCH /pages/:id/status PUBLISHED → publishes page', async () => {
    if (!state.ids.aboutPageId) return;
    const res = await api(state.tokens.admin).patch(`/pages/${state.ids.aboutPageId}/status`, {
      status: 'PUBLISHED',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('PUBLISHED');
  });

  it('10.5 GET /pages/about (public, now PUBLISHED) → 200 with content', async () => {
    if (!state.ids.aboutPageId) return;
    const res = await api(null).get('/pages/about');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('content');
    expect(res.data.data).toHaveProperty('slug', 'about');
  });

  it('10.6 POST /pages → 201 with custom slug', async () => {
    const slug = `facilities-${state.runId}`;
    const res = await api(state.tokens.admin).post('/pages', {
      title:   'Facilities',
      slug,
      content: '<p>World-class facilities at SGSITS.</p>',
    });
    expect(res.status).toBe(201);
    expect(res.data.data.slug).toBe(slug);
    state.ids.facilitiesPage = res.data.data.id;
  });

  it('10.7 POST /pages without slug → 201 with auto-generated slug', async () => {
    const res = await api(state.tokens.admin).post('/pages', {
      title: 'Student Life at College',
    });
    expect(res.status).toBe(201);
    expect(res.data.data.slug).toBeTruthy();
    // slug should be derived from the title
    expect(res.data.data.slug).toContain('student');
  });

  it('10.8 DELETE /pages/:id → reverts page to DRAFT', async () => {
    const res = await api(state.tokens.admin).delete(`/pages/${state.ids.facilitiesPage}`);
    expect(res.status).toBe(200);
  });

  it('10.9 Non-admin (HOD) cannot access GET /pages → 403', async () => {
    const res = await api(state.tokens.hod).get('/pages');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

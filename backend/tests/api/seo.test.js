'use strict';

const { state, api } = require('../config');

describe('Phase 22 — SEO Metadata', () => {

  const PAGE_KEY = 'home';

  it('22.1 GET /seo (admin) → 200 with list of SEO entries', async () => {
    const res = await api(state.tokens.admin).get('/seo');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('22.2 GET /seo (public, no auth) → 401 (protected route)', async () => {
    const res = await api(null).get('/seo');
    expect([401, 403]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('22.3 PUT /seo/:pageKey (admin) → upserts SEO for home page', async () => {
    // seo_metadata table uses columns: title, description, og_title, og_description
    const res = await api(state.tokens.admin).put(`/seo/${PAGE_KEY}`, {
      title:          'SGSITS – Government Engineering College Indore',
      description:    'SGSITS is a premier government engineering college in Indore, Madhya Pradesh.',
      og_title:       'SGSITS – Excellence in Engineering',
      og_description: 'Join SGSITS for top engineering education in India.',
      robots:         'index,follow',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('22.4 GET /seo/:pageKey (public) → returns SEO for page', async () => {
    const res = await api(null).get(`/seo/${PAGE_KEY}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const d = res.data.data;
    expect(d).toHaveProperty('title');
    expect(d.title).toBe('SGSITS – Government Engineering College Indore');
  });

  it('22.5 EXAM_CONTROLLER cannot PUT /seo/:pageKey → 403', async () => {
    const res = await api(state.tokens.exam).put(`/seo/${PAGE_KEY}`, {
      title: 'Exam Hacked SEO',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('22.6 TEACHER cannot PUT /seo/:pageKey → 403', async () => {
    const res = await api(state.tokens.teacher).put(`/seo/${PAGE_KEY}`, {
      title: 'Teacher Hacked SEO',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('22.7 GET /seo/nonexistent_page → 200 with null or 404', async () => {
    const res = await api(null).get('/seo/this_page_does_not_exist_xyz');
    // Should not crash — either 200 with null or 404
    expect([200, 404]).toContain(res.status);
  });

});

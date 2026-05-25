'use strict';

const { state, api } = require('../config');

const TODAY = new Date().toISOString().slice(0, 10);

describe('Phase 17 — News', () => {

  let newsId;
  let newsSlug;

  it('17.1 POST /news (admin) → 201 DRAFT with required fields', async () => {
    const res = await api(state.tokens.admin).post('/news', {
      title:    'SGSITS Ranks Among Top Engineering Colleges',
      excerpt:  'SGSITS has been ranked among the top engineering colleges in MP.',
      content:  '<p>Full article content here.</p>',
      category: 'ACADEMIC',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    const n = res.data.data;
    expect(n).toHaveProperty('id');
    expect(n).toHaveProperty('slug');
    expect(n.status).toBe('DRAFT');
    expect(n.category).toBe('ACADEMIC');
    newsId   = n.id;
    newsSlug = n.slug;
  });

  it('17.2 GET /news (public) → DRAFT not visible', async () => {
    const res = await api(null).get('/news');
    expect(res.status).toBe(200);
    const ids = (res.data.data.articles || res.data.data).map(n => n.id);
    if (newsId) expect(ids).not.toContain(newsId);
  });

  it('17.3 PATCH /news/:id/status PUBLISHED → 200', async () => {
    const res = await api(state.tokens.admin).patch(`/news/${newsId}/status`, { status: 'PUBLISHED' });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('PUBLISHED');
  });

  it('17.4 GET /news (public) → published article now visible', async () => {
    const res = await api(null).get('/news');
    expect(res.status).toBe(200);
    const items = res.data.data.articles || res.data.data;
    const found = items.some(n => n.id === newsId);
    expect(found).toBe(true);
  });

  it('17.5 GET /news/:id (public) → 200 with full content', async () => {
    const res = await api(null).get(`/news/${newsId}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(newsId);
    expect(res.data.data.status).toBe('PUBLISHED');
  });

  it('17.6 GET /news/slug/:slug (public) → 200 by slug', async () => {
    const res = await api(null).get(`/news/slug/${newsSlug}`);
    expect(res.status).toBe(200);
    expect(res.data.data.slug).toBe(newsSlug);
  });

  it('17.7 PUT /news/:id (admin) → updates excerpt', async () => {
    const res = await api(state.tokens.admin).put(`/news/${newsId}`, {
      excerpt: 'Updated excerpt text.',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.excerpt).toBe('Updated excerpt text.');
  });

  it('17.8 GET /news?category=ACADEMIC → all results match category', async () => {
    const res = await api(null).get('/news?category=ACADEMIC');
    expect(res.status).toBe(200);
    const items = res.data.data.articles || res.data.data;
    items.forEach(n => expect(n.category).toBe('ACADEMIC'));
  });

  it('17.9 POST /news with invalid category → 422 (Zod validation)', async () => {
    const res = await api(state.tokens.admin).post('/news', {
      title:    'Invalid Category Test',
      category: 'INVALID_CATEGORY',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('17.10 POST /news without title → 422 (Zod validation)', async () => {
    const res = await api(state.tokens.admin).post('/news', {
      category: 'GENERAL',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('17.11 EXAM_CONTROLLER cannot POST /news → 403', async () => {
    const res = await api(state.tokens.exam).post('/news', {
      title:    'Unauthorized News',
      category: 'GENERAL',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('17.12 HOD cannot POST /news → 403', async () => {
    const res = await api(state.tokens.hod).post('/news', {
      title:    'HOD Unauthorized News',
      category: 'GENERAL',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('17.13 PATCH /news/:id/status ARCHIVED → 200', async () => {
    const res = await api(state.tokens.admin).patch(`/news/${newsId}/status`, { status: 'ARCHIVED' });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('ARCHIVED');
  });

  it('17.14 DELETE /news/:id (admin) → 200', async () => {
    const res = await api(state.tokens.admin).delete(`/news/${newsId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

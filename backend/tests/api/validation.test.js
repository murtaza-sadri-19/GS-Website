'use strict';

const { state, api } = require('../config');

const TODAY = new Date().toISOString().slice(0, 10);

describe('Phase 38 — Validation Testing', () => {

  // ── Auth Validation ──────────────────────────────────────────────────────────
  // NOTE: auth routes use validate(loginSchema) Zod middleware → returns 422

  it('38.1 POST /auth/login with empty body → 422', async () => {
    const res = await api(null).post('/auth/login', {});
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.2 POST /auth/login with non-email → 422', async () => {
    const res = await api(null).post('/auth/login', { email: 'not-an-email', password: 'Pass@123' });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.3 POST /auth/login with huge payload (5000 chars) → 400 or 401 or 413 or 422', async () => {
    const res = await api(null).post('/auth/login', {
      email:    'a'.repeat(5000) + '@test.com',
      password: 'b'.repeat(5000),
    });
    // If Zod has no max on email length, the format passes validation and auth returns 401;
    // if a body-size limit is set, returns 413; if Zod rejects, returns 400/422
    expect([400, 401, 413, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.4 POST /auth/login with null fields → 422', async () => {
    const res = await api(null).post('/auth/login', { email: null, password: null });
    expect([400, 422]).toContain(res.status);
  });

  // ── Notices Validation ───────────────────────────────────────────────────────

  it('38.5 POST /notices without title → 400 or 422', async () => {
    const res = await api(state.tokens.admin).post('/notices', {
      notice_type:  'GENERAL',
      publish_date: TODAY,
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.6 POST /notices with invalid notice_type → 400 or 422', async () => {
    const res = await api(state.tokens.admin).post('/notices', {
      title:        'Bad Type Notice',
      notice_type:  'INVALID_TYPE',
      publish_date: TODAY,
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.7 POST /notices with invalid publish_date format → 400 or 422', async () => {
    const res = await api(state.tokens.admin).post('/notices', {
      title:        'Bad Date Notice',
      notice_type:  'GENERAL',
      publish_date: 'not-a-date',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.8 POST /notices with title too long (>501 chars) → 400 or 422', async () => {
    const res = await api(state.tokens.admin).post('/notices', {
      title:        'T'.repeat(502),
      notice_type:  'GENERAL',
      publish_date: TODAY,
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── Events Validation ────────────────────────────────────────────────────────

  it('38.9 POST /events without title (required field) → 400 or 422', async () => {
    // event_date is optional in the events schema; title is the required field
    const res = await api(state.tokens.admin).post('/events', {
      event_date: '2026-01-01',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── Users Validation ─────────────────────────────────────────────────────────

  it('38.10 POST /users with duplicate email → 409', async () => {
    const res = await api(state.tokens.admin).post('/users', {
      name:    'Duplicate User',
      email:   'admin@college.edu',
      role_id: 2,
    });
    expect(res.status).toBe(409);
    expect(res.data.success).toBe(false);
  });

  it('38.11 POST /users with invalid role_id → 400 or 404 or 422', async () => {
    const res = await api(state.tokens.admin).post('/users', {
      name:    'Bad Role User',
      email:   `badrole_${Date.now()}@test.com`,
      role_id: 99999,
    });
    expect([400, 404, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── News Validation ──────────────────────────────────────────────────────────

  it('38.12 POST /news with invalid cover_img_url → 400 or 422', async () => {
    const res = await api(state.tokens.admin).post('/news', {
      title:         'Bad URL News',
      cover_img_url: 'not-a-url',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── Chat Validation ──────────────────────────────────────────────────────────

  it('38.13 POST /chat/ask with invalid history role → 400 or 422', async () => {
    const res = await api(null).post('/chat/ask', {
      question: 'What is SGSITS?',
      history: [{ role: 'invalid_role', content: 'Hello' }],
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('38.14 POST /chat/ask with history message too long → 400 or 422', async () => {
    const res = await api(null).post('/chat/ask', {
      question: 'What is SGSITS?',
      history: [{ role: 'user', content: 'x'.repeat(2001) }],
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── Downloads Validation ─────────────────────────────────────────────────────

  it('38.15 POST /downloads without file_id or link → 400 or 422', async () => {
    const res = await api(state.tokens.admin).post('/downloads', {
      title: 'Missing File Download',
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── Pages Validation ─────────────────────────────────────────────────────────

  it('38.16 POST /pages without required fields → 400 or 422', async () => {
    const res = await api(state.tokens.admin).post('/pages', {});
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  // ── Auth Change Password Validation ─────────────────────────────────────────

  it('38.17 POST /auth/change-password with missing fields → 400 or 422', async () => {
    const res = await api(state.tokens.admin).post('/auth/change-password', {
      oldPassword: 'Admin@123',
      // missing newPassword
    });
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

});

'use strict';

const { state, api, login } = require('../config');

describe('Phase 26 — Chatbot Config & Responses', () => {

  let responseId;

  beforeAll(async () => {
    // Re-login if tokens were cleared (e.g. running this file in isolation)
    if (!state.tokens.admin) {
      const res = await login('admin@college.edu', 'Admin@123');
      if (res.data?.data?.token) state.tokens.admin = res.data.data.token;
    }
    if (!state.tokens.exam && state.emails.exam && state.passwords.exam) {
      const res = await login(state.emails.exam, state.passwords.exam);
      if (res.data?.data?.token) state.tokens.exam = res.data.data.token;
    }
    if (!state.tokens.teacher && state.emails.teacher && state.passwords.teacher) {
      const res = await login(state.emails.teacher, state.passwords.teacher);
      if (res.data?.data?.token) state.tokens.teacher = res.data.data.token;
    }
  });

  it('26.1 GET /chatbot/config (public) → 200 with bot config', async () => {
    const res = await api(null).get('/chatbot/config');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const d = res.data.data;
    expect(d).toHaveProperty('bot_name');
    expect(d).toHaveProperty('is_active');
  });

  it('26.2 GET /chatbot/responses (public) → 200 with responses array', async () => {
    const res = await api(null).get('/chatbot/responses');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('26.3 PUT /chatbot/config (admin) → 200 updates bot config', async () => {
    const res = await api(state.tokens.admin).put('/chatbot/config', {
      bot_name:        'SGSITS Assistant',
      welcome_message: 'Welcome to SGSITS! How can I help you today?',
      is_active:       true,
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.bot_name).toBe('SGSITS Assistant');
  });

  it('26.4 POST /chatbot/responses (admin) → 201 creates response', async () => {
    const res = await api(state.tokens.admin).post('/chatbot/responses', {
      category:      'Admissions',
      keywords:      'admission,apply,enroll',
      reply:         'For admissions, please visit our admissions portal or call +91-731-2470022.',
      display_order: 1,
      is_active:     true,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    const r = res.data.data;
    expect(r).toHaveProperty('id');
    expect(r.reply).toContain('admissions');
    responseId = r.id;
  });

  it('26.5 PUT /chatbot/responses/:id (admin) → 200 updates reply', async () => {
    if (!responseId) return;
    const res = await api(state.tokens.admin).put(`/chatbot/responses/${responseId}`, {
      reply: 'Updated: For admissions enquiries, please call our admissions office.',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('26.6 POST /chatbot/responses with empty reply → 400', async () => {
    const res = await api(state.tokens.admin).post('/chatbot/responses', {
      category: 'Test',
      reply:    '',
    });
    // Service throws httpError('reply is required', 400) when reply is empty
    expect([400, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('26.7 EXAM_CONTROLLER cannot POST /chatbot/responses → 403', async () => {
    const res = await api(state.tokens.exam).post('/chatbot/responses', {
      reply: 'Exam response.',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('26.8 TEACHER cannot PUT /chatbot/config → 403', async () => {
    const res = await api(state.tokens.teacher).put('/chatbot/config', {
      bot_name: 'Hacked Bot',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('26.9 DELETE /chatbot/responses/:id (admin) → 200', async () => {
    if (!responseId) return;
    const res = await api(state.tokens.admin).delete(`/chatbot/responses/${responseId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('26.10 DELETE /chatbot/responses/999999 (non-existent) → 404', async () => {
    const res = await api(state.tokens.admin).delete('/chatbot/responses/999999');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

});

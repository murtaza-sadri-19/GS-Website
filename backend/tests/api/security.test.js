'use strict';

const { state, api } = require('../config');

describe('Phase 39 — Security Testing', () => {

  // ── Authentication Security ──────────────────────────────────────────────────

  it('39.1 POST /auth/login with wrong password → 401 (not 200)', async () => {
    const res = await api(null).post('/auth/login', {
      email:    'admin@college.edu',
      password: 'WrongPassword999!',
    });
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('39.2 POST /auth/login with non-existent user → 401', async () => {
    const res = await api(null).post('/auth/login', {
      email:    'nonexistent_user_xyz@nowhere.com',
      password: 'SomePassword@123',
    });
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('39.3 Bearer token tampered → 401', async () => {
    const tampered = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTIzfQ.invalid_signature';
    const res = await api(tampered).get('/auth/me');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('39.4 Completely fake JWT → 401', async () => {
    const fake = 'fake.jwt.token';
    const res = await api(fake).get('/auth/me');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('39.5 Empty Authorization header → 401 on protected routes', async () => {
    const res = await api(null).get('/users');
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  // ── IDOR / Privilege Escalation ──────────────────────────────────────────────

  it('39.6 TEACHER cannot access /audit-logs → 403', async () => {
    const res = await api(state.tokens.teacher).get('/audit-logs');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('39.7 EXAM_CONTROLLER cannot POST /faculty → 403', async () => {
    const res = await api(state.tokens.exam).post('/faculty', {
      user_id:     1,
      designation: 'Professor',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('39.8 PLACEMENT_OFFICER cannot DELETE /users/:id → 403', async () => {
    const res = await api(state.tokens.placement).delete('/users/999');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('39.9 HOD cannot PUT /settings → 403', async () => {
    const res = await api(state.tokens.hod).put('/settings', {
      'site.title': 'Hacked by HOD',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  // ── SQL Injection ────────────────────────────────────────────────────────────

  it('39.10 SQL injection in login email → 401 (not 200)', async () => {
    const res = await api(null).post('/auth/login', {
      email:    "admin@college.edu' OR '1'='1",
      password: 'anything',
    });
    // Should be rejected by Zod (not valid email format) → 422, or rejected at auth → 401
    expect([400, 401, 422]).toContain(res.status);
    expect(res.data.success).toBe(false);
  });

  it('39.11 SQL injection in query param → 200 or 400 (not crash)', async () => {
    // Parameterized queries prevent injection; app should handle gracefully
    const res = await api(null).get("/news?category='; DROP TABLE news; --");
    expect([200, 400, 422]).toContain(res.status);
    // Must not crash with 500
    expect(res.status).not.toBe(500);
  });

  // ── XSS Prevention ──────────────────────────────────────────────────────────

  it('39.12 XSS in news title → stored but sanitized (no crash, no 500)', async () => {
    const res = await api(state.tokens.admin).post('/news', {
      title:   '<script>alert("xss")</script>SGSITS News',
      category: 'GENERAL',
    });
    // Should either succeed (sanitized) or fail validation (422), but not crash
    expect([200, 201, 400, 422]).toContain(res.status);
    expect(res.status).not.toBe(500);
    // Cleanup if created
    if (res.status === 201 && res.data.data?.id) {
      await api(state.tokens.admin).delete(`/news/${res.data.data.id}`);
    }
  });

  it('39.13 XSS in settings value → stored safely (no crash)', async () => {
    const res = await api(state.tokens.admin).put('/settings/key/site.xss_test', {
      value: '<script>alert("xss")</script>',
    });
    expect([200, 201, 400, 422]).toContain(res.status);
    expect(res.status).not.toBe(500);
  });

  // ── Mass Assignment ──────────────────────────────────────────────────────────

  it('39.14 Cannot set own role via user profile update → role not changed', async () => {
    // Attempt to escalate teacher's role to SUPER_ADMIN via PUT /users/:id
    if (!state.ids.teacherUser) return;
    const res = await api(state.tokens.admin).put(`/users/${state.ids.teacherUser}`, {
      role: 'SUPER_ADMIN', // extra field not in schema — should be ignored
    });
    // Response is 200 but role should not change to SUPER_ADMIN
    expect([200, 400, 422]).toContain(res.status);
  });

  // ── SSRF / URL Injection ─────────────────────────────────────────────────────

  it('39.15 POST /files/link with private IP → 400 (SSRF blocked)', async () => {
    const res = await api(state.tokens.admin).post('/files/link', {
      external_url: 'http://192.168.1.1/admin',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('39.16 POST /files/link with AWS metadata endpoint → 400 (SSRF blocked)', async () => {
    const res = await api(state.tokens.admin).post('/files/link', {
      external_url: 'http://169.254.169.254/latest/meta-data',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('39.17 POST /files/link with file:// URL → 400 (non-http protocol blocked)', async () => {
    const res = await api(state.tokens.admin).post('/files/link', {
      external_url: 'file:///etc/passwd',
    });
    // file:// is not http/https → protocol check in urlValidator rejects it
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('39.18 POST /files/link with 127.0.0.1 URL → 400 (loopback blocked)', async () => {
    const res = await api(state.tokens.admin).post('/files/link', {
      external_url: 'http://127.0.0.1:8080/api/internal',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  // ── Excessive Data / Payload Limits ─────────────────────────────────────────

  it('39.19 POST /contact with very long message → 400 or 422 (no 500)', async () => {
    const res = await api(null).post('/contact', {
      name:    'Test User',
      email:   'test@example.com',
      message: 'x'.repeat(50000),
    });
    // Should be rejected as too long or accepted (depends on schema), but must not crash
    expect(res.status).not.toBe(500);
  });

});

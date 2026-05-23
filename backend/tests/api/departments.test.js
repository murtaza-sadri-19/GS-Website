'use strict';

const { state, api, login } = require('../config');

const ROLE = { HOD: 4, TEACHER: 5 };

describe('Phase 3 — Departments (+ HOD/TEACHER user creation)', () => {

  // ── Department must be created FIRST — HOD and TEACHER roles require department_id ──

  it('3.1 POST /departments → 201 with slug', async () => {
    const res = await api(state.tokens.admin).post('/departments', {
      name:        'Computer Science Engineering',
      short_name:  'CSE',
      description: 'Department of Computer Science',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toMatchObject({ name: 'Computer Science Engineering', status: 'ACTIVE' });
    expect(res.data.data).toHaveProperty('slug');
    state.ids.dept     = res.data.data.id;
    state.ids.deptSlug = res.data.data.slug;
  });

  // ── Create HOD and TEACHER users now that we have a department ─────────────────

  it('2.3 Create HOD user (needs department_id)', async () => {
    const email = `hod_${state.runId}@college.edu`;
    state.emails.hod = email;
    const res = await api(state.tokens.admin).post('/users', {
      name:          'HOD Test',
      email,
      role_id:       ROLE.HOD,
      department_id: state.ids.dept,
    });
    if (res.status === 409) {
      throw new Error(`Test user ${email} already exists. Use unique RUN_ID emails or reset test database.`);
    }
    expect(res.status).toBe(201);
    state.ids.hodUser   = res.data.data.user.id;
    state.passwords.hod = res.data.data.initial_password;
  });

  it('2.4 Create TEACHER user (needs department_id)', async () => {
    const email = `teacher_${state.runId}@college.edu`;
    state.emails.teacher = email;
    const res = await api(state.tokens.admin).post('/users', {
      name:          'Teacher Test',
      email,
      role_id:       ROLE.TEACHER,
      department_id: state.ids.dept,
    });
    if (res.status === 409) {
      throw new Error(`Test user ${email} already exists. Use unique RUN_ID emails or reset test database.`);
    }
    expect(res.status).toBe(201);
    state.ids.teacherUser   = res.data.data.user.id;
    state.passwords.teacher = res.data.data.initial_password;
  });

  it('2.7 Login as HOD with initial password → 200', async () => {
    const res = await login(state.emails.hod, state.passwords.hod);
    expect(res.status).toBe(200);
    state.tokens.hod = res.data.data.token;
  });

  it('2.8 Login as TEACHER with initial password → 200', async () => {
    const res = await login(state.emails.teacher, state.passwords.teacher);
    expect(res.status).toBe(200);
    state.tokens.teacher = res.data.data.token;
  });

  // ── Department CRUD tests ─────────────────────────────────────────────────────

  it('3.2 GET /departments (public) → only ACTIVE departments', async () => {
    const res = await api(null).get('/departments');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
    res.data.data.forEach(d => expect(d.status).toBe('ACTIVE'));
  });

  it('3.3 GET /departments/:slug (public) → correct department', async () => {
    const res = await api(null).get(`/departments/${state.ids.deptSlug}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.dept);
  });

  it('3.4 PATCH /departments/:id/hod → assigns HOD user', async () => {
    const res = await api(state.tokens.admin).patch(`/departments/${state.ids.dept}/hod`, {
      user_id: state.ids.hodUser,
    });
    expect(res.status).toBe(200);
    expect(res.data.data.hod_user_id).toBe(state.ids.hodUser);
  });

  it('3.5 Re-login HOD → token now carries department_id in payload', async () => {
    const res = await login(state.emails.hod, state.passwords.hod);
    expect(res.status).toBe(200);
    expect(res.data.data.user.department_id).toBe(state.ids.dept);
    state.tokens.hod = res.data.data.token;  // updated token with dept
  });

  it('3.6 PUT /departments/:id as HOD → updates description/vision', async () => {
    const res = await api(state.tokens.hod).put(`/departments/${state.ids.dept}`, {
      description: 'Updated by HOD',
      vision:      'Excellence in CS education',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.description).toBe('Updated by HOD');
  });

  it('3.7 HOD cannot change department name → 403', async () => {
    const res = await api(state.tokens.hod).put(`/departments/${state.ids.dept}`, {
      name: 'New Name',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('3.8 PATCH /departments/:id/status INACTIVE → deactivates', async () => {
    const res = await api(state.tokens.admin).patch(`/departments/${state.ids.dept}/status`, {
      status: 'INACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('INACTIVE');
  });

  it('3.9 PATCH /departments/:id/status ACTIVE → reactivates', async () => {
    const res = await api(state.tokens.admin).patch(`/departments/${state.ids.dept}/status`, {
      status: 'ACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('ACTIVE');
  });

});

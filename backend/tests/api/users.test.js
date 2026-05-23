'use strict';

const { state, api, login } = require('../config');

// Role IDs from seed data — see TESTING_NOTES.md if yours differ
const ROLE = { EXAM_CONTROLLER: 2, PLACEMENT_OFFICER: 3, HOD: 4, TEACHER: 5 };

describe('Phase 2 — Users', () => {

  // Note: HOD (role_id 4) and TEACHER (role_id 5) require department_id which
  // does not exist yet. Those users are created in departments.test.js after
  // the department is created. See TESTING_NOTES.md for details.

  it('2.1 Create EXAM_CONTROLLER → 201 with user + initial_password', async () => {
    const email = `exam_${state.runId}@college.edu`;
    state.emails.exam = email;
    const res = await api(state.tokens.admin).post('/users', {
      name:    'Exam Controller',
      email,
      role_id: ROLE.EXAM_CONTROLLER,
    });
    if (res.status === 409) {
      throw new Error(`Test user ${email} already exists. Use unique RUN_ID emails or reset test database.`);
    }
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data.user).toMatchObject({ role: 'EXAM_CONTROLLER' });
    expect(res.data.data).toHaveProperty('initial_password');
    state.ids.examUser   = res.data.data.user.id;
    state.passwords.exam = res.data.data.initial_password;
  });

  it('2.2 Create PLACEMENT_OFFICER → 201', async () => {
    const email = `placement_${state.runId}@college.edu`;
    state.emails.placement = email;
    const res = await api(state.tokens.admin).post('/users', {
      name:    'Placement Officer',
      email,
      role_id: ROLE.PLACEMENT_OFFICER,
    });
    if (res.status === 409) {
      throw new Error(`Test user ${email} already exists. Use unique RUN_ID emails or reset test database.`);
    }
    expect(res.status).toBe(201);
    state.ids.placementUser   = res.data.data.user.id;
    state.passwords.placement = res.data.data.initial_password;
  });

  it('2.3 Login as EXAM_CONTROLLER with initial password → 200', async () => {
    const res = await login(state.emails.exam, state.passwords.exam);
    expect(res.status).toBe(200);
    expect(res.data.data.user.role).toBe('EXAM_CONTROLLER');
    state.tokens.exam = res.data.data.token;
  });

  it('2.4 Login as PLACEMENT_OFFICER with initial password → 200', async () => {
    const res = await login(state.emails.placement, state.passwords.placement);
    expect(res.status).toBe(200);
    state.tokens.placement = res.data.data.token;
  });

  it('2.5 GET /users → 200 with users array + pagination', async () => {
    const res = await api(state.tokens.admin).get('/users');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data.users)).toBe(true);
    expect(res.data.data.pagination).toMatchObject({
      page: expect.any(Number),
      pageSize: expect.any(Number),
      total: expect.any(Number),
    });
  });

  it('2.6 GET /users?role=EXAM_CONTROLLER → all results have matching role', async () => {
    const res = await api(state.tokens.admin).get('/users?role=EXAM_CONTROLLER');
    expect(res.status).toBe(200);
    res.data.data.users.forEach(u => expect(u.role).toBe('EXAM_CONTROLLER'));
  });

  it('2.7 GET /users/:id → 200 with correct user', async () => {
    const res = await api(state.tokens.admin).get(`/users/${state.ids.examUser}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.examUser);
    expect(res.data.data.role).toBe('EXAM_CONTROLLER');
  });

  it('2.8 PUT /users/:id → updates phone number', async () => {
    const res = await api(state.tokens.admin).put(`/users/${state.ids.placementUser}`, {
      phone: '9876543210',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.phone).toBe('9876543210');
  });

  it('2.9 PATCH /users/:id/status INACTIVE → deactivates user', async () => {
    const res = await api(state.tokens.admin).patch(`/users/${state.ids.placementUser}/status`, {
      status: 'INACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('INACTIVE');
  });

  it('2.10 PATCH /users/:id/status ACTIVE → reactivates user', async () => {
    const res = await api(state.tokens.admin).patch(`/users/${state.ids.placementUser}/status`, {
      status: 'ACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('ACTIVE');
  });

  it('2.11 DELETE /users/:id → soft-deletes (INACTIVE)', async () => {
    const res = await api(state.tokens.admin).delete(`/users/${state.ids.examUser}`);
    expect(res.status).toBe(200);
  });

  it('2.12 Reactivate after soft delete → ACTIVE', async () => {
    const res = await api(state.tokens.admin).patch(`/users/${state.ids.examUser}/status`, {
      status: 'ACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('ACTIVE');
  });

  it('2.13 Non-admin (EXAM_CONTROLLER) cannot GET /users → 403', async () => {
    const res = await api(state.tokens.exam).get('/users');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

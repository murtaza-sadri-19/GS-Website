'use strict';

const { state, api } = require('../config');

describe('Phase 5 — Faculty', () => {

  it('5.1 PUT /users/:id → assign dept to teacher', async () => {
    const res = await api(state.tokens.admin).put(`/users/${state.ids.teacherUser}`, {
      department_id: state.ids.dept,
    });
    expect(res.status).toBe(200);
    expect(res.data.data.department_id).toBe(state.ids.dept);
  });

  it('5.2 POST /faculty → 201 with full profile', async () => {
    const res = await api(state.tokens.admin).post('/faculty', {
      user_id:               state.ids.teacherUser,
      department_id:         state.ids.dept,
      designation:           'Assistant Professor',
      qualification:         'M.Tech Computer Science',
      specialization:        'Machine Learning',
      experience:            '5 years',
      bio:                   'Passionate educator.',
      subjects:              'Data Structures, Algorithms',
      profile_image_file_id: state.ids.facultyImageFile,
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toMatchObject({
      designation:   'Assistant Professor',
      department_id: state.ids.dept,
    });
    expect(res.data.data).toHaveProperty('teacher_name');
    expect(res.data.data).toHaveProperty('teacher_email');
    state.ids.facultyProfile = res.data.data.id;
  });

  it('5.3 GET /faculty (public) → only ACTIVE profiles', async () => {
    const res = await api(null).get('/faculty');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('faculty');
    expect(res.data.data).toHaveProperty('pagination');
    res.data.data.faculty.forEach(f => expect(f.status).toBe('ACTIVE'));
  });

  it('5.4 GET /faculty?department_id → filters by department', async () => {
    const res = await api(null).get(`/faculty?department_id=${state.ids.dept}`);
    expect(res.status).toBe(200);
    res.data.data.faculty.forEach(f => expect(f.department_id).toBe(state.ids.dept));
  });

  it('5.5 GET /faculty/:id (public) → correct profile', async () => {
    const res = await api(null).get(`/faculty/${state.ids.facultyProfile}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.facultyProfile);
  });

  it('5.6 GET /faculty/me as TEACHER → own profile', async () => {
    const res = await api(state.tokens.teacher).get('/faculty/me');
    expect(res.status).toBe(200);
    expect(res.data.data.user_id).toBe(state.ids.teacherUser);
  });

  it('5.7 PUT /faculty/me as TEACHER → updates bio + subjects', async () => {
    const res = await api(state.tokens.teacher).put('/faculty/me', {
      bio:      'Updated bio by teacher.',
      subjects: 'DSA, OS, Networks',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.bio).toBe('Updated bio by teacher.');
    expect(res.data.data.subjects).toBe('DSA, OS, Networks');
  });

  it('5.8 PUT /faculty/me with department_id as TEACHER → 403', async () => {
    const res = await api(state.tokens.teacher).put('/faculty/me', {
      department_id: 999,
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('5.9 PUT /faculty/:id as HOD → updates designation', async () => {
    const res = await api(state.tokens.hod).put(`/faculty/${state.ids.facultyProfile}`, {
      designation: 'Senior Assistant Professor',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.designation).toBe('Senior Assistant Professor');
  });

  it('5.10 PATCH /faculty/:id/status INACTIVE → deactivates profile', async () => {
    const res = await api(state.tokens.admin).patch(`/faculty/${state.ids.facultyProfile}/status`, {
      status: 'INACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('INACTIVE');
    // Profile no longer visible in public GET
    const pub = await api(null).get(`/faculty/${state.ids.facultyProfile}`);
    expect(pub.status).toBe(404);
  });

  it('5.11 PATCH /faculty/:id/status ACTIVE → reactivates profile', async () => {
    const res = await api(state.tokens.admin).patch(`/faculty/${state.ids.facultyProfile}/status`, {
      status: 'ACTIVE',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('ACTIVE');
  });

  it('5.12 POST /faculty with existing user_id → 409 duplicate', async () => {
    const res = await api(state.tokens.admin).post('/faculty', {
      user_id:       state.ids.teacherUser,
      department_id: state.ids.dept,
      designation:   'Professor',
    });
    expect(res.status).toBe(409);
    expect(res.data.success).toBe(false);
  });

});

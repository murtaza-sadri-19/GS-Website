'use strict';

const { state, api } = require('../config');

describe('Phase 30 — Labs', () => {

  let labId;

  it('30.1 POST /labs (admin) → 201 creates lab', async () => {
    const res = await api(state.tokens.admin).post('/labs', {
      name:           'Artificial Intelligence Lab',
      description:    'State-of-the-art AI lab with GPU workstations.',
      department_id:  state.ids.dept,
      capacity:       30,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    labId = res.data.data.id;
  });

  it('30.2 POST /labs (HOD same dept) → 201', async () => {
    const res = await api(state.tokens.hod).post('/labs', {
      name:           'HOD Created Lab',
      description:    'A lab created by the HOD.',
      department_id:  state.ids.dept,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    // cleanup
    if (res.data.data?.id) {
      await api(state.tokens.admin).delete(`/labs/${res.data.data.id}`);
    }
  });

  it('30.3 GET /labs (public) → 200 with labs array', async () => {
    const res = await api(null).get('/labs');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const items = res.data.data.labs || res.data.data;
    expect(Array.isArray(items)).toBe(true);
  });

  it('30.4 GET /labs/:id (public) → 200 with correct lab', async () => {
    if (!labId) return;
    const res = await api(null).get(`/labs/${labId}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(labId);
    expect(res.data.data.name).toBe('Artificial Intelligence Lab');
  });

  it('30.5 PUT /labs/:id (admin) → 200 updates lab', async () => {
    if (!labId) return;
    const res = await api(state.tokens.admin).put(`/labs/${labId}`, {
      description: 'Updated: Advanced AI and ML lab with NVIDIA A100 GPUs.',
      capacity: 40,
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('30.6 EXAM_CONTROLLER cannot POST /labs → 403', async () => {
    const res = await api(state.tokens.exam).post('/labs', {
      name: 'Exam Lab',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('30.7 TEACHER cannot DELETE /labs/:id → 403', async () => {
    if (!labId) return;
    const res = await api(state.tokens.teacher).delete(`/labs/${labId}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('30.8 GET /labs/999999 (non-existent) → 404', async () => {
    const res = await api(null).get('/labs/999999');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('30.9 DELETE /labs/:id (admin) → 200', async () => {
    if (!labId) return;
    const res = await api(state.tokens.admin).delete(`/labs/${labId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

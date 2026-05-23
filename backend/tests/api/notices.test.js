'use strict';

const { state, api } = require('../config');

const TODAY = new Date().toISOString().slice(0, 10);

describe('Phase 6 — Notices', () => {

  it('6.1 POST /notices GENERAL as admin → 201 DRAFT', async () => {
    const res = await api(state.tokens.admin).post('/notices', {
      title:        'Annual Day Announcement',
      notice_type:  'GENERAL',
      description:  'Annual day will be held on 15th March.',
      publish_date: TODAY,
    });
    expect(res.status).toBe(201);
    expect(res.data.data).toMatchObject({ notice_type: 'GENERAL', status: 'DRAFT' });
    expect(res.data.data).toHaveProperty('slug');
    state.ids.generalNotice = res.data.data.id;
  });

  it('6.2 POST /notices DEPARTMENT as HOD → 201, dept forced to HOD dept', async () => {
    const res = await api(state.tokens.hod).post('/notices', {
      title:        'CSE Department Meeting',
      notice_type:  'DEPARTMENT',
      description:  'Mandatory meeting for all CSE faculty.',
      publish_date: TODAY,
    });
    expect(res.status).toBe(201);
    expect(res.data.data.notice_type).toBe('DEPARTMENT');
    expect(res.data.data.department_id).toBe(state.ids.dept);
    state.ids.deptNotice = res.data.data.id;
  });

  it('6.3 HOD cannot create GENERAL notice → 403', async () => {
    const res = await api(state.tokens.hod).post('/notices', {
      title:        'HOD General Test',
      notice_type:  'GENERAL',
      publish_date: TODAY,
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('6.4 POST /notices EXAM as EXAM_CONTROLLER → 201', async () => {
    const res = await api(state.tokens.exam).post('/notices', {
      title:        'Mid-Term Exam Schedule',
      notice_type:  'EXAM',
      description:  'Mid-term exams begin 20th Feb.',
      publish_date: TODAY,
    });
    expect(res.status).toBe(201);
    expect(res.data.data.notice_type).toBe('EXAM');
    state.ids.examNotice = res.data.data.id;
  });

  it('6.5 POST /notices PLACEMENT as PLACEMENT_OFFICER → 201', async () => {
    const res = await api(state.tokens.placement).post('/notices', {
      title:        'Campus Recruitment Drive',
      notice_type:  'PLACEMENT',
      description:  'TCS and Infosys visiting campus.',
      publish_date: TODAY,
    });
    expect(res.status).toBe(201);
    state.ids.placementNotice = res.data.data.id;
  });

  it('6.6 PATCH /notices/:id/status PUBLISHED → publishes notice', async () => {
    const res = await api(state.tokens.admin).patch(`/notices/${state.ids.generalNotice}/status`, {
      status: 'PUBLISHED',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('PUBLISHED');
  });

  it('6.7 GET /notices (public) → only PUBLISHED + publish_date <= today', async () => {
    const res = await api(null).get('/notices');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('notices');
    expect(res.data.data).toHaveProperty('pagination');
    res.data.data.notices.forEach(n => expect(n.status).toBe('PUBLISHED'));
  });

  it('6.8 GET /notices?notice_type=GENERAL → all results are GENERAL', async () => {
    const res = await api(null).get('/notices?notice_type=GENERAL');
    expect(res.status).toBe(200);
    res.data.data.notices.forEach(n => expect(n.notice_type).toBe('GENERAL'));
  });

  it('6.9 GET /notices?q=Annual → search by keyword', async () => {
    const res = await api(null).get('/notices?q=Annual');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data.notices)).toBe(true);
  });

  it('6.10 GET /notices/:id (public) → returns published notice', async () => {
    const res = await api(null).get(`/notices/${state.ids.generalNotice}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.generalNotice);
    expect(res.data.data.status).toBe('PUBLISHED');
  });

  it('6.11 PUT /notices/:id → updates description', async () => {
    const res = await api(state.tokens.admin).put(`/notices/${state.ids.generalNotice}`, {
      description: 'Updated description.',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.description).toBe('Updated description.');
  });

  it('6.12 PUT /notices/:id with notice_type change → 400', async () => {
    const res = await api(state.tokens.admin).put(`/notices/${state.ids.generalNotice}`, {
      notice_type: 'EXAM',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('6.13 HOD cannot update GENERAL notice → 403', async () => {
    const res = await api(state.tokens.hod).put(`/notices/${state.ids.generalNotice}`, {
      description: 'HOD trying to update general notice.',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('6.14 DELETE /notices/:id by owner → archives (soft delete)', async () => {
    const res = await api(state.tokens.exam).delete(`/notices/${state.ids.examNotice}`);
    expect(res.status).toBe(200);
  });

});

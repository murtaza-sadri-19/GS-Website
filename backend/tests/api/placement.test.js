'use strict';

const { state, api } = require('../config');

describe('Phase 12 — Placement', () => {

  it('12.1 POST /placement/records NOTICE → 201 status ACTIVE', async () => {
    const res = await api(state.tokens.placement).post('/placement/records', {
      title:       'Campus Recruitment 2025',
      record_type: 'NOTICE',
      description: 'Major companies visiting campus this semester.',
    });
    expect(res.status).toBe(201);
    expect(res.data.data).toMatchObject({ record_type: 'NOTICE', status: 'ACTIVE' });
    state.ids.placementNoticeRecord = res.data.data.id;
  });

  it('12.2 POST /placement/records COMPANY_VISIT → 201', async () => {
    const res = await api(state.tokens.placement).post('/placement/records', {
      title:         'TCS Campus Visit',
      record_type:   'COMPANY_VISIT',
      company_name:  'Tata Consultancy Services',
      academic_year: '2024-25',
      description:   'TCS conducted aptitude test and interviews.',
      file_id:       state.ids.placementFile,
    });
    expect(res.status).toBe(201);
    expect(res.data.data.company_name).toBe('Tata Consultancy Services');
    state.ids.companyVisit = res.data.data.id;
  });

  it('12.3 COMPANY_VISIT without company_name → 400', async () => {
    const res = await api(state.tokens.placement).post('/placement/records', {
      title:         'Mystery Visit',
      record_type:   'COMPANY_VISIT',
      academic_year: '2024-25',
      description:   'Missing company name.',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('12.4 POST /placement/records PLACEMENT_RECORD → 201', async () => {
    const res = await api(state.tokens.placement).post('/placement/records', {
      title:         'Placement Statistics 2024-25',
      record_type:   'PLACEMENT_RECORD',
      academic_year: '2024-25',
      description:   '180 students placed with avg package 6.5 LPA.',
      file_id:       state.ids.placementFile,
    });
    expect(res.status).toBe(201);
    state.ids.placementRecord = res.data.data.id;
  });

  it('12.5 POST /placement/records TRAINING_PROGRAM → 201', async () => {
    const res = await api(state.tokens.placement).post('/placement/records', {
      title:       'Pre-Placement Training — Aptitude',
      record_type: 'TRAINING_PROGRAM',
      description: '30-day aptitude and reasoning training.',
    });
    expect(res.status).toBe(201);
  });

  it('12.6 GET /placement/notices (public) → 200 with records', async () => {
    const res = await api(null).get('/placement/notices');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('records');
  });

  it('12.7 GET /placement/company-visits (public) → 200', async () => {
    const res = await api(null).get('/placement/company-visits');
    expect(res.status).toBe(200);
  });

  it('12.8 GET /placement/records (public) → 200', async () => {
    const res = await api(null).get('/placement/records');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('records');
  });

  it('12.9 GET /placement/training-programs (public) → 200', async () => {
    const res = await api(null).get('/placement/training-programs');
    expect(res.status).toBe(200);
  });

  it('12.10 Filter company-visits?academic_year → 200', async () => {
    const res = await api(null).get('/placement/company-visits?academic_year=2024-25');
    expect(res.status).toBe(200);
  });

  it('12.11 Filter company-visits?company_name (partial match) → 200', async () => {
    const res = await api(null).get('/placement/company-visits?company_name=TCS');
    expect(res.status).toBe(200);
  });

  it('12.12 GET /placement/records/:id (public) → correct record', async () => {
    const res = await api(null).get(`/placement/records/${state.ids.companyVisit}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.companyVisit);
  });

  it('12.13 PUT /placement/records/:id → updates description', async () => {
    const res = await api(state.tokens.placement).put(
      `/placement/records/${state.ids.companyVisit}`,
      { description: 'TCS hired 12 students from our campus.' }
    );
    expect(res.status).toBe(200);
  });

  it('12.14 PATCH /placement/records/:id/status INACTIVE → deactivates', async () => {
    const res = await api(state.tokens.placement).patch(
      `/placement/records/${state.ids.placementNoticeRecord}/status`,
      { status: 'INACTIVE' }
    );
    expect(res.status).toBe(200);
  });

  it('12.15 DELETE /placement/records/:id → soft delete', async () => {
    const res = await api(state.tokens.placement).delete(
      `/placement/records/${state.ids.placementRecord}`
    );
    expect(res.status).toBe(200);
  });

  it('12.16 CENTRAL_ADMIN cannot create placement records → 403', async () => {
    const res = await api(state.tokens.admin).post('/placement/records', {
      title:       'Test',
      record_type: 'NOTICE',
      description: 'Test',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

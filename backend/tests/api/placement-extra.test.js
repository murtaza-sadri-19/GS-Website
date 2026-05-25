'use strict';

/**
 * Phase 12B — Placement Extra (14 untested endpoints at 0% coverage)
 *
 *   GET/POST/PUT/DELETE /placement/companies
 *   GET/POST/PUT/DELETE /placement/drives
 *   GET/POST/PUT/DELETE /placement/internships
 *   GET/POST            /placement/stats
 */

const { state, api } = require('../config');

describe('Phase 12B — Placement Extra: Companies, Drives, Internships, Stats', () => {

  let companyId;
  let driveId;
  let internshipId;

  // ── Companies ─────────────────────────────────────────────────────────────

  it('12B.1 GET /placement/companies (public, no auth) → 200 array', async () => {
    const res = await api(null).get('/placement/companies');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('12B.2 POST /placement/companies (PLACEMENT_OFFICER) → 201', async () => {
    const res = await api(state.tokens.placement).post('/placement/companies', {
      name:          `Infosys Ltd ${Date.now()}`,
      sector:        'Information Technology',
      website:       'https://www.infosys.com',
      contact_email: 'campus@infosys.com',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('id');
    expect(res.data.data).toHaveProperty('name');
    companyId           = res.data.data.id;
    state.ids.companyId = companyId;
  });

  it('12B.3 POST /placement/companies (CENTRAL_ADMIN) → 201 (admin is also in WRITE role)', async () => {
    const res = await api(state.tokens.admin).post('/placement/companies', {
      name: `Admin Test Corp ${Date.now()}`,
      sector: 'Education',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    // cleanup immediately
    if (res.data.data?.id) {
      await api(state.tokens.admin).delete(`/placement/companies/${res.data.data.id}`);
    }
  });

  it('12B.4 POST /placement/companies (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).post('/placement/companies', {
      name: 'Teacher Corp',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('12B.5 POST /placement/companies (HOD) → 403', async () => {
    const res = await api(state.tokens.hod).post('/placement/companies', {
      name: 'HOD Corp',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('12B.6 POST /placement/companies without name → 400', async () => {
    const res = await api(state.tokens.placement).post('/placement/companies', {
      sector: 'Finance',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('12B.7 PUT /placement/companies/:id → 200 updates fields', async () => {
    if (!companyId) return;
    const res = await api(state.tokens.placement).put(`/placement/companies/${companyId}`, {
      website:       'https://careers.infosys.com',
      contact_phone: '1800-209-3232',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('id', companyId);
  });

  it('12B.8 PUT /placement/companies/:id with no updatable fields → 400', async () => {
    if (!companyId) return;
    const res = await api(state.tokens.placement).put(`/placement/companies/${companyId}`, {});
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('12B.9 PUT /placement/companies/999999 → 404', async () => {
    const res = await api(state.tokens.placement).put('/placement/companies/999999', {
      name: 'Ghost',
    });
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── Drives ────────────────────────────────────────────────────────────────

  it('12B.10 GET /placement/drives (public) → 200 array', async () => {
    const res = await api(null).get('/placement/drives');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('12B.11 POST /placement/drives → 201', async () => {
    const res = await api(state.tokens.placement).post('/placement/drives', {
      title:       `Campus Placement Drive ${Date.now()}`,
      company_id:  companyId,
      job_title:   'Software Engineer',
      ctc_lpa:     6.5,
      eligibility: 'B.Tech CSE/IT with 60% aggregate',
      drive_date:  '2026-08-15',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('id');
    driveId           = res.data.data.id;
    state.ids.driveId = driveId;
  });

  it('12B.12 POST /placement/drives without title → 400', async () => {
    const res = await api(state.tokens.placement).post('/placement/drives', {
      company_id: companyId,
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('12B.13 PUT /placement/drives/:id → 200 updates ctc + eligibility', async () => {
    if (!driveId) return;
    const res = await api(state.tokens.placement).put(`/placement/drives/${driveId}`, {
      ctc_lpa:     7.5,
      eligibility: 'B.Tech all branches with 65% aggregate',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('12B.14 PUT /placement/drives/:id (TEACHER) → 403', async () => {
    if (!driveId) return;
    const res = await api(state.tokens.teacher).put(`/placement/drives/${driveId}`, {
      ctc_lpa: 5,
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('12B.15 DELETE /placement/drives/:id → 200', async () => {
    if (!driveId) return;
    const res = await api(state.tokens.placement).delete(`/placement/drives/${driveId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('12B.16 DELETE /placement/drives/999999 → 404', async () => {
    const res = await api(state.tokens.placement).delete('/placement/drives/999999');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── Internships ───────────────────────────────────────────────────────────

  it('12B.17 GET /placement/internships (public) → 200 array', async () => {
    const res = await api(null).get('/placement/internships');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('12B.18 POST /placement/internships → 201', async () => {
    const res = await api(state.tokens.placement).post('/placement/internships', {
      title:           `Summer Internship 2026 ${Date.now()}`,
      company_id:      companyId,
      duration_months: 2,
      stipend:         15000,
      start_date:      '2026-05-01',
      end_date:        '2026-06-30',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('id');
    internshipId           = res.data.data.id;
    state.ids.internshipId = internshipId;
  });

  it('12B.19 POST /placement/internships without title → 400', async () => {
    const res = await api(state.tokens.placement).post('/placement/internships', {
      duration_months: 3,
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('12B.20 PUT /placement/internships/:id → 200 updates stipend', async () => {
    if (!internshipId) return;
    const res = await api(state.tokens.placement).put(`/placement/internships/${internshipId}`, {
      stipend: 20000,
      status:  'completed',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('12B.21 DELETE /placement/internships/:id → 200', async () => {
    if (!internshipId) return;
    const res = await api(state.tokens.placement).delete(`/placement/internships/${internshipId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('12B.22 DELETE /placement/internships/999999 → 404', async () => {
    const res = await api(state.tokens.placement).delete('/placement/internships/999999');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── Stats (upsert by academic_year) ───────────────────────────────────────

  it('12B.23 GET /placement/stats (public) → 200 array', async () => {
    const res = await api(null).get('/placement/stats');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('12B.24 POST /placement/stats (PLACEMENT_OFFICER) → 200/201 upserted', async () => {
    const res = await api(state.tokens.placement).post('/placement/stats', {
      academic_year:     '2024-25',
      total_students:    480,
      students_placed:   320,
      placement_pct:     66.7,
      highest_package:   42,
      average_package:   6.8,
      companies_visited: 35,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('academic_year', '2024-25');
    expect(res.data.data.students_placed).toBe(320);
  });

  it('12B.25 POST /placement/stats (CENTRAL_ADMIN) → 200/201', async () => {
    const res = await api(state.tokens.admin).post('/placement/stats', {
      academic_year:   '2023-24',
      total_students:  460,
      students_placed: 290,
      placement_pct:   63.0,
      highest_package: 38,
      average_package: 6.2,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
  });

  it('12B.26 POST /placement/stats upsert same year → updates existing row', async () => {
    const res = await api(state.tokens.placement).post('/placement/stats', {
      academic_year:   '2024-25',
      students_placed: 340,
      placement_pct:   70.8,
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    expect(res.data.data.students_placed).toBe(340);
  });

  it('12B.27 POST /placement/stats without academic_year → 400', async () => {
    const res = await api(state.tokens.placement).post('/placement/stats', {
      total_students: 100,
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  it('12B.28 POST /placement/stats (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).post('/placement/stats', {
      academic_year: '2022-23',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('12B.29 GET /placement/stats after upserts → contains year data', async () => {
    const res = await api(null).get('/placement/stats');
    expect(res.status).toBe(200);
    const years = res.data.data.map(s => s.academic_year);
    expect(years).toContain('2024-25');
  });

  // ── Cleanup company ───────────────────────────────────────────────────────

  it('12B.30 DELETE /placement/companies/:id → 200 cleanup', async () => {
    if (!companyId) return;
    const res = await api(state.tokens.placement).delete(`/placement/companies/${companyId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

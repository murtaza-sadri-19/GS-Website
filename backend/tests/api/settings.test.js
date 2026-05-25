'use strict';

const { state, api } = require('../config');

describe('Phase 20 — Settings & CMS Sections', () => {

  it('20.1 GET /settings (public) → 200 with key-value object', async () => {
    const res = await api(null).get('/settings');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(typeof res.data.data).toBe('object');
  });

  it('20.2 GET /settings/key/site.title (public) → 200', async () => {
    const res = await api(null).get('/settings/key/site.title');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('20.3 PUT /settings/key/site.test_key (admin) → 200 upserts value', async () => {
    const res = await api(state.tokens.admin).put('/settings/key/site.test_key', {
      value: 'test_value_12345',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('20.4 GET /settings/key/site.test_key (public) → returns updated value', async () => {
    const res = await api(null).get('/settings/key/site.test_key');
    expect(res.status).toBe(200);
    // getOne returns { key, value } object
    expect(res.data.data.value).toBe('test_value_12345');
  });

  it('20.5 PUT /settings (admin) → bulk upsert multiple keys', async () => {
    const res = await api(state.tokens.admin).put('/settings', {
      'contact.phone':  '+91-731-2470022',
      'contact.email':  'info@sgsits.ac.in',
      'site.tagline':   'Excellence in Engineering',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('20.6 EXAM_CONTROLLER cannot PUT /settings → 403', async () => {
    const res = await api(state.tokens.exam).put('/settings/key/site.title', {
      value: 'Hacked Title',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('20.7 HOD cannot PUT /settings (bulk) → 403', async () => {
    const res = await api(state.tokens.hod).put('/settings', {
      'site.title': 'HOD Override',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('20.8 GET /settings/cms (public) → 200 with sections list', async () => {
    const res = await api(null).get('/settings/cms');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('20.9 PUT /settings/cms/home.hero (admin) → 200 saves JSON blob', async () => {
    const sectionData = {
      heading: 'SGSITS – Excellence in Engineering',
      subheading: 'Govt. Engineering College, Indore, MP',
      cta_text: 'Explore Programmes',
    };
    const res = await api(state.tokens.admin).put('/settings/cms/home.hero', sectionData);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('20.10 GET /settings/cms/home.hero (public) → returns saved blob', async () => {
    const res = await api(null).get('/settings/cms/home.hero');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const d = res.data.data;
    expect(d).toHaveProperty('heading');
  });

  it('20.11 PUT /settings/cms/footer.branding (admin) → 200', async () => {
    const data = {
      college_name: 'SGSITS',
      tagline: 'Excellence in Education',
      logo_url: 'https://example.com/logo.png',
    };
    const res = await api(state.tokens.admin).put('/settings/cms/footer.branding', data);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('20.12 PLACEMENT_OFFICER cannot PUT /settings/cms/:section → 403', async () => {
    const res = await api(state.tokens.placement).put('/settings/cms/home.hero', {
      heading: 'Unauthorized',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

});

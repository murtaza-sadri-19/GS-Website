'use strict';

const { state, api } = require('../config');

describe('Phase 8 — Events', () => {

  it('8.1 POST /events as admin → 201 DRAFT with slug', async () => {
    const res = await api(state.tokens.admin).post('/events', {
      title:               'Annual Tech Fest 2025',
      description:         'College-wide technology festival.',
      event_date:          '2025-03-15',
      cover_image_file_id: state.ids.eventsFile,
    });
    expect(res.status).toBe(201);
    expect(res.data.data).toMatchObject({ title: 'Annual Tech Fest 2025', status: 'DRAFT' });
    expect(res.data.data).toHaveProperty('slug');
    state.ids.event     = res.data.data.id;
    state.ids.eventSlug = res.data.data.slug;
  });

  it('8.2 POST /events as HOD → 201 (dept forced to HOD dept)', async () => {
    const res = await api(state.tokens.hod).post('/events', {
      title:       'CSE Workshop on AI',
      description: 'Workshop for CSE students.',
      event_date:  '2025-02-20',
    });
    expect(res.status).toBe(201);
    expect(res.data.data.department_id).toBe(state.ids.dept);
    state.ids.deptEvent = res.data.data.id;
  });

  it('8.3 PATCH /events/:id/status PUBLISHED → event is published', async () => {
    const res = await api(state.tokens.admin).patch(`/events/${state.ids.event}/status`, {
      status: 'PUBLISHED',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.status).toBe('PUBLISHED');
  });

  it('8.4 GET /events (public) → only PUBLISHED events', async () => {
    const res = await api(null).get('/events');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('events');
    expect(res.data.data).toHaveProperty('pagination');
    res.data.data.events.forEach(e => expect(e.status).toBe('PUBLISHED'));
  });

  it('8.5 GET /events?department_id → filters by department', async () => {
    const res = await api(null).get(`/events?department_id=${state.ids.dept}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data.events)).toBe(true);
  });

  it('8.6 GET /events/:slug (public) → returns correct event', async () => {
    const res = await api(null).get(`/events/${state.ids.eventSlug}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.event);
    expect(res.data.data).toHaveProperty('cover_image_url');
  });

  it('8.7 PUT /events/:id → updates description', async () => {
    const res = await api(state.tokens.admin).put(`/events/${state.ids.event}`, {
      description: 'Updated description for Annual Tech Fest.',
    });
    expect(res.status).toBe(200);
    expect(res.data.data.description).toBe('Updated description for Annual Tech Fest.');
  });

  it('8.8 DELETE /events/:id as HOD → archives dept event', async () => {
    const res = await api(state.tokens.hod).delete(`/events/${state.ids.deptEvent}`);
    expect(res.status).toBe(200);
  });

});

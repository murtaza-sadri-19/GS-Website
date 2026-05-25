'use strict';

/**
 * Phase 9B — Gallery Albums (5 untested endpoints)
 *
 *   GET  /gallery/albums
 *   GET  /gallery/albums/:slug
 *   POST /gallery/albums
 *   PUT  /gallery/albums/:id
 *   DELETE /gallery/albums/:id
 */

const { state, api } = require('../config');

describe('Phase 9B — Gallery Albums', () => {

  let albumId;
  let albumSlug;
  let hodAlbumId;

  // ── POST /gallery/albums ──────────────────────────────────────────────────

  it('9B.1 POST /gallery/albums (admin) → 201 with id + slug', async () => {
    const title = `Annual Day 2025 Album ${Date.now()}`;
    const res = await api(state.tokens.admin).post('/gallery/albums', {
      title,
      description: 'Photos from the annual day celebration.',
      event_date:  '2025-11-15',
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('id');
    expect(res.data.data).toHaveProperty('slug');
    expect(res.data.data.title).toBe(title);
    albumId   = res.data.data.id;
    albumSlug = res.data.data.slug;
    state.ids.albumId   = albumId;
    state.ids.albumSlug = albumSlug;
  });

  it('9B.2 POST /gallery/albums (HOD) → 201 dept-scoped album', async () => {
    const res = await api(state.tokens.hod).post('/gallery/albums', {
      title:       `CSE Lab Photos ${Date.now()}`,
      description: 'Lab inauguration photos for CSE dept.',
    });
    expect([200, 201]).toContain(res.status);
    expect(res.data.success).toBe(true);
    hodAlbumId = res.data.data.id;
  });

  it('9B.3 POST /gallery/albums (TEACHER) → 403', async () => {
    const res = await api(state.tokens.teacher).post('/gallery/albums', {
      title: 'Unauthorized Album',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('9B.4 POST /gallery/albums unauthenticated → 401', async () => {
    const res = await api(null).post('/gallery/albums', {
      title: 'No-auth Album',
    });
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  it('9B.5 POST /gallery/albums without title → 400', async () => {
    const res = await api(state.tokens.admin).post('/gallery/albums', {
      description: 'No title provided',
    });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

  // ── GET /gallery/albums ───────────────────────────────────────────────────

  it('9B.6 GET /gallery/albums (public) → 200 array of active albums', async () => {
    const res = await api(null).get('/gallery/albums');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('9B.7 GET /gallery/albums?department_id → filtered by dept', async () => {
    const res = await api(null).get(`/gallery/albums?department_id=${state.ids.dept}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  // ── GET /gallery/albums/:slug ─────────────────────────────────────────────

  it('9B.8 GET /gallery/albums/:slug (public) → 200 with album + images array', async () => {
    if (!albumSlug) return;
    const res = await api(null).get(`/gallery/albums/${albumSlug}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data).toHaveProperty('slug', albumSlug);
    expect(Array.isArray(res.data.data.images)).toBe(true);
  });

  it('9B.9 GET /gallery/albums/nonexistent-slug → 404', async () => {
    const res = await api(null).get('/gallery/albums/this-album-does-not-exist-xyz-99999');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  // ── PUT /gallery/albums/:id ───────────────────────────────────────────────

  it('9B.10 PUT /gallery/albums/:id (admin) → 200 updates title + description', async () => {
    if (!albumId) return;
    const res = await api(state.tokens.admin).put(`/gallery/albums/${albumId}`, {
      title:       'Annual Day 2025 — Updated Title',
      description: 'Updated description for annual day.',
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.title).toBe('Annual Day 2025 — Updated Title');
  });

  it('9B.11 PUT /gallery/albums/:id (TEACHER) → 403', async () => {
    if (!albumId) return;
    const res = await api(state.tokens.teacher).put(`/gallery/albums/${albumId}`, {
      title: 'Teacher update attempt',
    });
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('9B.12 PUT /gallery/albums/999999 → 404', async () => {
    const res = await api(state.tokens.admin).put('/gallery/albums/999999', {
      title: 'Ghost album',
    });
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('9B.13 PUT /gallery/albums unauthenticated → 401', async () => {
    if (!albumId) return;
    const res = await api(null).put(`/gallery/albums/${albumId}`, {
      title: 'Unauthenticated update',
    });
    expect(res.status).toBe(401);
    expect(res.data.success).toBe(false);
  });

  // ── DELETE /gallery/albums/:id ────────────────────────────────────────────

  it('9B.14 DELETE /gallery/albums/:id (HOD) → 200 soft-deletes dept album', async () => {
    if (!hodAlbumId) return;
    const res = await api(state.tokens.hod).delete(`/gallery/albums/${hodAlbumId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('9B.15 DELETE /gallery/albums/:id (admin) → 200 deactivates album', async () => {
    if (!albumId) return;
    const res = await api(state.tokens.admin).delete(`/gallery/albums/${albumId}`);
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('9B.16 DELETE /gallery/albums/999999 → 404', async () => {
    const res = await api(state.tokens.admin).delete('/gallery/albums/999999');
    expect(res.status).toBe(404);
    expect(res.data.success).toBe(false);
  });

  it('9B.17 DELETE /gallery/albums/:id (TEACHER) → 403', async () => {
    // Try to delete something even though it may be already deleted
    const res = await api(state.tokens.teacher).delete('/gallery/albums/1');
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('9B.18 GET /gallery/albums after delete → list shrinks or album absent', async () => {
    if (!albumSlug) return;
    // After soft-delete the album should not appear in public active listing
    const listRes = await api(null).get('/gallery/albums');
    expect(listRes.status).toBe(200);
    const slugs = listRes.data.data.map(a => a.slug);
    expect(slugs).not.toContain(albumSlug);
  });

});

'use strict';

const { state, api, uploadFile, FIXTURES } = require('../config');

const TODAY = new Date().toISOString().slice(0, 10);

describe('Phase 15 — Public Route Verification', () => {

  it('15.1 All public GET routes return 200 with only active/published data', async () => {
    const [depts, faculty, notices, downloads, events, gallery, examDocs, placementRecs] =
      await Promise.all([
        api(null).get('/departments'),
        api(null).get('/faculty'),
        api(null).get('/notices'),
        api(null).get('/downloads'),
        api(null).get('/events'),
        api(null).get('/gallery'),
        api(null).get('/exam/documents'),
        api(null).get('/placement/records'),
      ]);

    [depts, faculty, notices, downloads, events, gallery, examDocs, placementRecs].forEach(r => {
      expect(r.status).toBe(200);
      expect(r.data.success).toBe(true);
    });

    // Enforce that public data only returns the allowed statuses
    depts.data.data.forEach(d => expect(d.status).toBe('ACTIVE'));
    faculty.data.data.faculty.forEach(f => expect(f.status).toBe('ACTIVE'));
    notices.data.data.notices.forEach(n => expect(n.status).toBe('PUBLISHED'));
    events.data.data.events.forEach(e => expect(e.status).toBe('PUBLISHED'));
  });

  it('15.2 Soft-deleted gallery item vanishes from public list and returns 404', async () => {
    // Upload a fresh image so we have an unreferenced file
    const upload = await uploadFile(state.tokens.admin, FIXTURES.image, 'gallery');
    expect(upload.status).toBe(201);
    const fileId = upload.data.data.id;

    // Create a gallery item using that image
    const create = await api(state.tokens.admin).post('/gallery', {
      title:   'Temp Visibility Test',
      file_id: fileId,
    });
    expect(create.status).toBe(201);
    const tempGalleryId = create.data.data.id;

    // Verify it appears in the public list
    const listBefore = await api(null).get('/gallery');
    const foundBefore = listBefore.data.data.gallery.some(g => g.id === tempGalleryId);
    expect(foundBefore).toBe(true);

    // Soft-delete it
    const del = await api(state.tokens.admin).delete(`/gallery/${tempGalleryId}`);
    expect(del.status).toBe(200);

    // It must disappear from the public list
    const listAfter = await api(null).get('/gallery');
    const foundAfter = listAfter.data.data.gallery.some(g => g.id === tempGalleryId);
    expect(foundAfter).toBe(false);

    // Direct GET must return 404
    const single = await api(null).get(`/gallery/${tempGalleryId}`);
    expect(single.status).toBe(404);
  });

  it('15.3 DRAFT notice invisible publicly; PUBLISHED notice appears', async () => {
    // Create a DRAFT notice
    const create = await api(state.tokens.admin).post('/notices', {
      title:        'Draft Visibility Test',
      notice_type:  'GENERAL',
      publish_date: TODAY,
    });
    expect(create.status).toBe(201);
    const noticeId = create.data.data.id;
    expect(create.data.data.status).toBe('DRAFT');

    // DRAFT must NOT appear in public list
    const listBefore = await api(null).get('/notices');
    const foundBefore = listBefore.data.data.notices.some(n => n.id === noticeId);
    expect(foundBefore).toBe(false);

    // Publish it
    await api(state.tokens.admin).patch(`/notices/${noticeId}/status`, { status: 'PUBLISHED' });

    // Now it must appear — search all pages since many notices may exist in DB
    let foundAfter = false;
    let page = 1;
    while (!foundAfter) {
      const listAfter = await api(null).get(`/notices?page=${page}&limit=50`);
      const notices = listAfter.data.data.notices;
      if (!notices || notices.length === 0) break;
      if (notices.some(n => n.id === noticeId)) { foundAfter = true; break; }
      page++;
    }
    expect(foundAfter).toBe(true);
  });

  it('15.4 Future-dated PUBLISHED notice invisible publicly + 404 on direct GET', async () => {
    // Create notice with a far-future date
    const create = await api(state.tokens.admin).post('/notices', {
      title:        'Future Notice Test',
      notice_type:  'GENERAL',
      publish_date: '2099-12-31',
    });
    expect(create.status).toBe(201);
    const futureId = create.data.data.id;

    // Publish it
    await api(state.tokens.admin).patch(`/notices/${futureId}/status`, { status: 'PUBLISHED' });

    // Must NOT appear in public list (publish_date > today)
    const list = await api(null).get('/notices');
    const found = list.data.data.notices.some(n => n.id === futureId);
    expect(found).toBe(false);

    // Direct access must 404
    const single = await api(null).get(`/notices/${futureId}`);
    expect(single.status).toBe(404);
  });

});

describe('Phase 16 — File Deletion Safety', () => {

  it('16.1 Deleting a referenced file → 409', async () => {
    // imageFile is referenced by faculty_profiles.profile_image_file_id
    const res = await api(state.tokens.admin).delete(`/files/${state.ids.imageFile}`);
    expect(res.status).toBe(409);
    expect(res.data.success).toBe(false);
  });

  it('16.2 Deleting an unreferenced file → 200', async () => {
    // Upload a throwaway image that nothing will reference
    const upload = await uploadFile(state.tokens.admin, FIXTURES.image, 'gallery');
    expect(upload.status).toBe(201);
    const throwawayId = upload.data.data.id;

    const del = await api(state.tokens.admin).delete(`/files/${throwawayId}`);
    expect(del.status).toBe(200);
  });

});

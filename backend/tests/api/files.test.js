'use strict';

const { state, api, uploadFile, FIXTURES } = require('../config');

describe('Phase 4 — Files', () => {

  it('4.1 Upload image (gallery usage) as admin → 201 + image_file_id stored', async () => {
    const res = await uploadFile(state.tokens.admin, FIXTURES.image, 'gallery');
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    const f = res.data.data;
    expect(f).toHaveProperty('id');
    expect(f).toHaveProperty('file_url');
    expect(f).toHaveProperty('file_type');
    expect(['CLOUDINARY', 'LOCAL']).toContain(f.storage_type);
    state.ids.imageFile = f.id;
  });

  it('4.2 Upload PDF (notices usage) → 201 + pdf_file_id stored', async () => {
    const res = await uploadFile(state.tokens.admin, FIXTURES.pdf, 'notices');
    expect(res.status).toBe(201);
    state.ids.pdfFile = res.data.data.id;
  });

  it('4.3 Upload PDF (downloads usage) → 201 + download_file_id stored', async () => {
    const res = await uploadFile(state.tokens.admin, FIXTURES.docPdf, 'downloads');
    expect(res.status).toBe(201);
    state.ids.downloadFile = res.data.data.id;
  });

  it('4.4 Upload image (faculty usage) → 201 + faculty_image_file_id stored', async () => {
    const res = await uploadFile(state.tokens.admin, FIXTURES.image, 'faculty');
    expect(res.status).toBe(201);
    state.ids.facultyImageFile = res.data.data.id;
  });

  it('4.5 Upload PDF as EXAM_CONTROLLER (exam usage) → 201 + exam_file_id stored', async () => {
    const res = await uploadFile(state.tokens.exam, FIXTURES.pdf, 'exam');
    expect(res.status).toBe(201);
    state.ids.examFile = res.data.data.id;
  });

  it('4.6 Upload PDF as PLACEMENT_OFFICER (placement usage) → 201 + placement_file_id stored', async () => {
    const res = await uploadFile(state.tokens.placement, FIXTURES.pdf, 'placement');
    expect(res.status).toBe(201);
    state.ids.placementFile = res.data.data.id;
  });

  it('4.7 Upload image (events usage) → 201 + events_file_id stored', async () => {
    const res = await uploadFile(state.tokens.admin, FIXTURES.image, 'events');
    expect(res.status).toBe(201);
    state.ids.eventsFile = res.data.data.id;
  });

  it('4.8 GET /files (admin) → 200 with files array + pagination', async () => {
    const res = await api(state.tokens.admin).get('/files');
    expect(res.status).toBe(200);
    expect(res.data.data).toHaveProperty('files');
    expect(res.data.data).toHaveProperty('pagination');
    expect(Array.isArray(res.data.data.files)).toBe(true);
  });

  it('4.9 GET /files/:id as owner (admin) → 200', async () => {
    const res = await api(state.tokens.admin).get(`/files/${state.ids.imageFile}`);
    expect(res.status).toBe(200);
    expect(res.data.data.id).toBe(state.ids.imageFile);
    expect(res.data.data).toHaveProperty('file_url');
    expect(res.data.data).toHaveProperty('uploader_name');
  });

  it('4.10 GET /files/:id as non-owner (exam_controller) → 403', async () => {
    // imageFile was uploaded by admin; exam_controller is not the owner and not CENTRAL_ADMIN
    const res = await api(state.tokens.exam).get(`/files/${state.ids.imageFile}`);
    expect(res.status).toBe(403);
    expect(res.data.success).toBe(false);
  });

  it('4.11 Upload image to exam usage → 400 (PDF only for exam)', async () => {
    const res = await uploadFile(state.tokens.admin, FIXTURES.image, 'exam', { expectFailure: true });
    expect(res.status).toBe(400);
    expect(res.data.success).toBe(false);
  });

});

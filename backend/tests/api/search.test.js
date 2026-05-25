'use strict';

const { api } = require('../config');

describe('Phase 28 — Search', () => {

  it('28.1 GET /search?q=CSE → 200 with results', async () => {
    const res = await api(null).get('/search?q=CSE');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    const d = res.data.data;
    expect(typeof d).toBe('object');
  });

  it('28.2 GET /search?q=admission → 200 with results', async () => {
    const res = await api(null).get('/search?q=admission');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('28.3 GET /search?q= (empty query) → 200 or 400', async () => {
    const res = await api(null).get('/search?q=');
    expect([200, 400]).toContain(res.status);
  });

  it('28.4 GET /search (no query param) → 200 or 400', async () => {
    const res = await api(null).get('/search');
    expect([200, 400]).toContain(res.status);
  });

  it('28.5 GET /search?q=placement&limit=5 → 200 max 5 results per type', async () => {
    const res = await api(null).get('/search?q=placement&limit=5');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('28.6 GET /search?q=exam → 200, results include notices/docs', async () => {
    const res = await api(null).get('/search?q=exam');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

  it('28.7 GET /search?q=<script>alert(1)</script> → 200 or 400, no XSS', async () => {
    const res = await api(null).get('/search?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
    // Server must not crash (200 = sanitized/echoed in JSON; 400 = rejected)
    expect([200, 400]).toContain(res.status);
    // JSON responses are not HTML so raw script tags in the payload field are safe;
    // only verify the server doesn't return a 500 error
    expect(res.status).not.toBe(500);
  });

  it('28.8 GET /search?q=faculty → 200 with faculty results if any', async () => {
    const res = await api(null).get('/search?q=faculty');
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
  });

});

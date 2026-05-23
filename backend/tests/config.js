'use strict';

const http     = require('http');
const axios    = require('axios');
const FormData = require('form-data');
const fs       = require('fs');
const path     = require('path');

// Disable keep-alive so each connection closes immediately after the response.
// This prevents the TCPWRAP open-handle Jest detects and stops error-listener
// accumulation on reused sockets (MaxListenersExceededWarning).
const httpAgent = new http.Agent({ keepAlive: false });

/**
 * State is persisted to a JSON file between test files.
 *
 * Why: Jest runs each test file in its own VM context, so `global` and module
 * caches are NOT shared across files — even with --runInBand.
 * Solution: config.js reads state from .test-state.json on every require(),
 * and registers an afterAll() to flush mutations back to disk after each file.
 * Since --runInBand is strictly serial, the flush always completes before the
 * next file starts.
 */

const STATE_FILE = path.join(__dirname, '.test-state.json');

const DEFAULT_STATE = {
  runId: Date.now(),
  tokens: {
    admin:     null,
    exam:      null,
    placement: null,
    hod:       null,
    teacher:   null,
  },
  passwords: {
    exam:      null,
    placement: null,
    hod:       null,
    teacher:   null,
  },
  emails: {
    exam:      null,
    placement: null,
    hod:       null,
    teacher:   null,
  },
  ids: {
    examUser:              null,
    placementUser:         null,
    hodUser:               null,
    teacherUser:           null,
    dept:                  null,
    deptSlug:              null,
    imageFile:             null,
    pdfFile:               null,
    downloadFile:          null,
    facultyImageFile:      null,
    examFile:              null,
    placementFile:         null,
    eventsFile:            null,
    facultyProfile:        null,
    generalNotice:         null,
    deptNotice:            null,
    examNotice:            null,
    placementNotice:       null,
    globalDownload:        null,
    deptDownload:          null,
    event:                 null,
    eventSlug:             null,
    deptEvent:             null,
    gallery:               null,
    deptGallery:           null,
    aboutPageId:           null,
    facilitiesPage:        null,
    examNoticeDoc:         null,
    timetable:             null,
    result:                null,
    placementNoticeRecord: null,
    companyVisit:          null,
    placementRecord:       null,
  },
};

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (_) {}
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

const state = loadState();

// Flush mutations to disk after this test file finishes.
// afterAll is available as a Jest global in any module required from a test file.
if (typeof afterAll !== 'undefined') {
  afterAll(() => {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  });
}

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api/v1';

/** Returns an axios instance with the given bearer token pre-attached. */
function api(token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return axios.create({
    baseURL:        BASE_URL,
    headers,
    validateStatus: () => true,
    httpAgent,
  });
}

/** POST /auth/login — returns the full axios response. */
async function login(email, password) {
  return axios.post(
    `${BASE_URL}/auth/login`,
    { email, password },
    { validateStatus: () => true, httpAgent }
  );
}

/**
 * Multipart file upload via POST /files/upload.
 * @param {string} token              - Bearer token
 * @param {string} filePath           - Absolute path to the file
 * @param {string} usage              - Value for the `usage` form field
 * @param {{ expectFailure?: boolean }} [options]
 *   - expectFailure: set true when the test intentionally expects a non-201 response
 *     (e.g. wrong MIME type) to suppress the error log.
 */
async function uploadFile(token, filePath, usage, options = {}) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), { filename: path.basename(filePath) });
  form.append('usage', usage);

  const res = await axios.post(`${BASE_URL}/files/upload`, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true,
    httpAgent,
  });

  if (res.status !== 201 && !options.expectFailure) {
    console.error('\n[uploadFile FAILED]', {
      status:        res.status,
      body:          JSON.stringify(res.data),
      filePath,
      usage,
      tokenProvided: Boolean(token),
    });
  }

  return res;
}

/** Absolute paths to fixture files created by globalSetup.js */
const FIXTURES = {
  image:  path.join(__dirname, 'fixtures', 'test-image.png'),
  pdf:    path.join(__dirname, 'fixtures', 'test.pdf'),
  docPdf: path.join(__dirname, 'fixtures', 'test-doc.pdf'),
};

module.exports = { state, BASE_URL, api, login, uploadFile, FIXTURES };

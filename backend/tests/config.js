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
  // Retry up to 8 times with 25 ms busy-waits between attempts.
  // On Windows, a transient file lock (e.g. AV scanner) or an NTFS
  // metadata flush delay can make the file appear empty or unreadable
  // for a brief window right after the previous test file wrote it.
  for (let attempt = 0; attempt < 8; attempt++) {
    if (attempt > 0) {
      const end = Date.now() + 25;
      while (Date.now() < end) {}   // synchronous busy-wait
    }
    try {
      if (!fs.existsSync(STATE_FILE)) continue;
      const raw = fs.readFileSync(STATE_FILE, 'utf8');
      if (raw && raw.trim()) return JSON.parse(raw);
    } catch (_) {}
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

const state = loadState();

// Flush mutations to disk after this test file finishes.
// afterAll is available as a Jest global in any module required from a test file.
if (typeof afterAll !== 'undefined') {
  afterAll(() => {
    const data = JSON.stringify(state, null, 2);
    const tmp  = STATE_FILE + '.tmp';

    // Step 1: Write content to a temp file and fsync it.
    let fd;
    try {
      fd = fs.openSync(tmp, 'w');
      fs.writeSync(fd, data);
      fs.fsyncSync(fd);
    } finally {
      if (fd !== undefined) fs.closeSync(fd);
    }

    // Step 2: Atomic rename — on Windows, renameSync replaces the destination.
    // This ensures STATE_FILE is never partially written: readers see either the
    // old complete content or the new complete content, never a torn write.
    try {
      fs.renameSync(tmp, STATE_FILE);
    } catch (_) {
      // Fallback if rename is blocked (e.g. destination locked): overwrite directly.
      let fd2;
      try {
        fd2 = fs.openSync(STATE_FILE, 'w');
        fs.writeSync(fd2, data);
        fs.fsyncSync(fd2);
      } finally {
        if (fd2 !== undefined) fs.closeSync(fd2);
      }
      try { fs.unlinkSync(tmp); } catch (_2) {}
    }

    // Step 3: Sync barrier — a stderr syscall forces Windows to flush NTFS
    // metadata caches so the next test file's readFileSync sees the new content.
    process.stderr.write('.');
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

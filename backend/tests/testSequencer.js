'use strict';

const Sequencer = require('@jest/test-sequencer').default;
const path      = require('path');

// Enforce explicit execution order — each phase depends on IDs from the previous one
const ORDER = [
  'auth.test.js',
  'users.test.js',
  'departments.test.js',
  'files.test.js',
  'faculty.test.js',
  'notices.test.js',
  'downloads.test.js',
  'events.test.js',
  'gallery.test.js',
  'pages.test.js',
  'exam.test.js',
  'placement.test.js',
  'audit.test.js',
  'forbidden.test.js',
  'public.test.js',
];

class ApiTestSequencer extends Sequencer {
  sort(tests) {
    return [...tests].sort((a, b) => {
      const nameA = path.basename(a.path);
      const nameB = path.basename(b.path);
      const idxA  = ORDER.indexOf(nameA);
      const idxB  = ORDER.indexOf(nameB);
      if (idxA === -1 && idxB === -1) return nameA.localeCompare(nameB);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }
}

module.exports = ApiTestSequencer;

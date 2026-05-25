'use strict';

const Sequencer = require('@jest/test-sequencer').default;
const path      = require('path');

// Enforce explicit execution order — each phase depends on IDs from the previous one
const ORDER = [
  // Core bootstrap — must run first (establish tokens + shared IDs)
  'auth.test.js',
  'users.test.js',
  'departments.test.js',
  'files.test.js',
  'faculty.test.js',
  'notices.test.js',
  'downloads.test.js',
  'events.test.js',
  'gallery.test.js',
  'gallery-albums.test.js',        // Phase 9B  — gallery albums CRUD (5 untested)
  'pages.test.js',
  'exam.test.js',
  'placement.test.js',
  'placement-extra.test.js',       // Phase 12B — companies/drives/internships/stats (14 untested)
  'audit.test.js',
  'forbidden.test.js',
  'public.test.js',

  // Extended modules — Phase 17+
  'news.test.js',
  'tenders.test.js',
  'alerts.test.js',
  'settings.test.js',
  'navigation.test.js',
  'seo.test.js',
  'contact.test.js',
  'analytics.test.js',
  'notifications.test.js',
  'chatbot.test.js',
  'search.test.js',
  'faculty-content.test.js',
  'faculty-delete.test.js',        // Phase 5B  — DELETE faculty + content updates + public reads (6 untested)
  'labs.test.js',
  'achievements.test.js',
  'files-link.test.js',
  'academic.test.js',
  'academic-workflow.test.js',     // Phase 33B — session activate, faculty assign, COs, electives, students upload
  'academic-marks.test.js',        // Phase 33C — test-details, save/submit marks, fill-requests
  'academic-atkt.test.js',         // Phase 33D — ATKT students upload, test-details, save/submit
  'academic-corrections.test.js',  // Phase 33E — correction requests full workflow
  'leaves.test.js',
  'timetables.test.js',
  'registration.test.js',
  'misc-gaps.test.js',             // Phase 40  — downloads increment-count, leaves/reg reject, achievements status, dept delete
  'validation.test.js',
  'security.test.js',
  'auth-password-reset.test.js',   // Phase 38  — forgot-password + reset-password (last: resets admin token)

  // Chat RAG is last — long Groq timeout
  'chat.test.js',
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

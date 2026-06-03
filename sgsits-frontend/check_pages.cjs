const { chromium } = require('playwright');
const BASE = 'http://localhost:5173';

const PAGES = [
  ['/', 'Home'],
  ['/about', 'About Landing'],
  ['/about/institute', 'About Institute'],
  ['/about/vision-mission', 'Vision & Mission'],
  ['/about/director-message', "Director's Message"],
  ['/about/governing-body', 'Governing Body'],
  ['/about/administration', 'Administration'],
  ['/about/committees', 'Committees'],
  ['/about/telephone-directory', 'Telephone Directory'],
  ['/about/infrastructure', 'Infrastructure'],
  ['/about/iqac', 'IQAC'],
  ['/about/academic-council', 'Academic Council'],
  ['/about/accreditation', 'Accreditation'],
  ['/academics', 'Academics Landing'],
  ['/academics/calendar', 'Academic Calendar'],
  ['/academics/courses/ug', 'UG Courses'],
  ['/academics/courses/pg', 'PG Courses'],
  ['/academics/courses/phd', 'PhD Courses'],
  ['/academics/courses/ptdc', 'PTDC Courses'],
  ['/academics/courses/online', 'Online Courses'],
  ['/academics/first-year', 'First Year Info'],
  ['/academics/exam-results', 'Exam Results (public)'],
  ['/academics/ordinances', 'Ordinances'],
  ['/academics/plagiarism-policy', 'Plagiarism Policy'],
  ['/academics/code-of-conduct', 'Code of Conduct'],
  ['/academics/obe-nep-2020', 'OBE NEP 2020'],
  ['/departments', 'Departments Landing'],
  ['/departments/computer-science', 'Dept Detail (CS)'],
  ['/students', 'Campus Life Landing'],
  ['/students/activities', 'Activities'],
  ['/students/ncc', 'NCC'],
  ['/students/nss', 'NSS'],
  ['/students/sss', 'SSS'],
  ['/students/scholarship/govt', 'Govt Scholarship'],
  ['/students/scholarship/institute', 'Institute Scholarship'],
  ['/facilities', 'Facilities Landing'],
  ['/facilities/library', 'Library'],
  ['/facilities/computer-center', 'Computer Center'],
  ['/facilities/workshop', 'Workshop'],
  ['/facilities/gymnasium', 'Gymnasium'],
  ['/facilities/dispensary', 'Dispensary'],
  ['/facilities/cidi', 'CIDI'],
  ['/facilities/sports', 'Games & Sports'],
  ['/facilities/hostel/boys', 'Boys Hostel'],
  ['/facilities/hostel/girls', 'Girls Hostel'],
  ['/facilities/hostel/transit', 'Transit Hostel'],
  ['/facilities/hostel/staff', 'Staff Quarters'],
  ['/facilities/idea-lab', 'IDEA Lab'],
  ['/placement', 'Placements Landing'],
  ['/placement/tnp-cell', 'T&P Cell'],
  ['/placement/companies', 'Leading Companies'],
  ['/placement/record', 'Placement Record'],
  ['/placement/contact', 'Placement Contact'],
  ['/admission', 'Admissions Landing'],
  ['/admission/ug', 'UG Admission'],
  ['/admission/pg', 'PG Admission'],
  ['/admission/phd', 'PhD Admission'],
  ['/admission/prospectus', 'Prospectus'],
  ['/explore/gallery', 'Photo Gallery'],
  ['/explore/campus-map', 'Campus Map'],
  ['/explore/video-tour', 'Video Tour'],
  ['/explore/anthem', 'SGSITS Anthem'],
  ['/startup-cell', 'Startup Cell'],
  ['/teqip/about', 'TEQIP'],
  ['/news', 'News'],
  ['/notices', 'Notices'],
  ['/events', 'Events'],
  ['/tenders', 'Tenders'],
  ['/policy/privacy', 'Privacy Policy'],
  ['/policy/terms', 'Terms of Use'],
  ['/policy/disclaimer', 'Disclaimer'],
  ['/policy/accessibility', 'Accessibility'],
  ['/policy/copyright', 'Copyright Policy'],
  ['/policy/hyperlink', 'Hyperlink Policy'],
  ['/policy/security', 'Security Policy'],
  ['/policy/sitemap', 'Site Map'],
  ['/policy/help', 'Help'],
  ['/policy/feedback', 'Feedback'],
  ['/more', 'More Landing'],
  ['/contact', 'Contact Us'],
  ['/login', 'Login'],
  ['/this-does-not-exist-xyz', '404 Page'],
];

const IGNORABLE = [
  'CORS','ERR_FAILED','ERR_CONNECTION_REFUSED','net::ERR',
  'Failed to load resource','XMLHttpRequest','Access-Control','favicon',
];
const CRASH_SIGNALS = [
  'Transform failed','Cannot read properties','is not a function',
  'Unexpected token','Uncaught TypeError','Uncaught ReferenceError','ChunkLoadError',
];

function isIgnorable(msg) { return IGNORABLE.some(p => msg.includes(p)); }
function isCrash(msg) { return CRASH_SIGNALS.some(p => msg.includes(p)); }

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  const OK = [];
  const BROKEN = [];

  for (const [path, label] of PAGES) {
    const realErrors = [];
    const consoleHandler = msg => {
      const t = msg.text();
      if (!isIgnorable(t) && isCrash(t)) realErrors.push(t);
    };
    const errorHandler = err => {
      const t = err.message;
      if (!isIgnorable(t)) realErrors.push(t);
    };
    page.on('console', consoleHandler);
    page.on('pageerror', errorHandler);

    try {
      await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1200);

      const bodyText = await page.evaluate(() => document.body ? document.body.innerText : '');
      const isBlank  = bodyText.trim().length < 80;
      const overlay  = await page.$('vite-error-overlay').then(el => !!el).catch(() => false);
      const shows404 = bodyText.includes('Page Not Found') || bodyText.includes('404');
      const unexpected404 = path !== '/this-does-not-exist-xyz' && shows404;

      if (overlay || realErrors.length > 0) {
        BROKEN.push({ path, label, reason: 'JS crash', details: realErrors.slice(0, 2) });
      } else if (isBlank) {
        BROKEN.push({ path, label, reason: 'blank page', details: [] });
      } else if (unexpected404) {
        BROKEN.push({ path, label, reason: 'unexpected 404', details: [] });
      } else {
        OK.push({ path, label });
      }
    } catch (e) {
      BROKEN.push({ path, label, reason: 'timeout/crash', details: [e.message.slice(0, 120)] });
    } finally {
      page.off('console', consoleHandler);
      page.off('pageerror', errorHandler);
    }
  }

  await browser.close();

  const total = PAGES.length;
  console.log('\n=== PAGE AUDIT RESULTS ===');
  console.log('Working : ' + OK.length + ' / ' + total);
  console.log('Broken  : ' + BROKEN.length + ' / ' + total);

  if (BROKEN.length) {
    console.log('\n--- BROKEN PAGES ---');
    for (const b of BROKEN) {
      console.log('\n[BROKEN] ' + b.label + ' (' + b.path + ')');
      console.log('  reason: ' + b.reason);
      b.details.forEach(d => console.log('  detail: ' + d.slice(0, 200)));
    }
  }

  console.log('\n--- WORKING PAGES ---');
  for (const p of OK) {
    console.log('[OK] ' + p.label + ' (' + p.path + ')');
  }
})();

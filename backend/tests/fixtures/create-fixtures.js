#!/usr/bin/env node
'use strict';

/**
 * Standalone script to create test fixture files.
 * Run via:  node tests/fixtures/create-fixtures.js
 * Or via:   npm run test:fixtures
 *
 * The jest globalSetup.js also creates these automatically before each test run.
 */

const fs   = require('fs');
const path = require('path');

const dir = __dirname;

const PNG_1x1_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const PDF_CONTENT =
  '%PDF-1.0\n' +
  '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
  '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
  '3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\n' +
  'xref\n' +
  '0 4\n' +
  '0000000000 65535 f \n' +
  '0000000009 00000 n \n' +
  '0000000058 00000 n \n' +
  '0000000115 00000 n \n' +
  'trailer<</Size 4/Root 1 0 R>>\n' +
  'startxref\n' +
  '190\n' +
  '%%EOF\n';

const files = [
  { name: 'test-image.png', content: Buffer.from(PNG_1x1_BASE64, 'base64') },
  { name: 'test.pdf',       content: Buffer.from(PDF_CONTENT) },
  { name: 'test-doc.pdf',   content: Buffer.from(PDF_CONTENT) },
];

files.forEach(({ name, content }) => {
  const dest = path.join(dir, name);
  fs.writeFileSync(dest, content);
  console.log('Created:', dest);
});

console.log('\nFixtures ready!');

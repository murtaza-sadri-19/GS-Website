'use strict';

const fs   = require('fs');
const path = require('path');

// Minimal 1×1 red-pixel PNG — a known-valid binary that multer and Cloudinary accept
const PNG_1x1_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Minimal valid single-page PDF
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

module.exports = async function globalSetup() {
  // Clear persisted state from any previous run so each run starts fresh
  const stateFile = path.join(__dirname, '.test-state.json');
  if (fs.existsSync(stateFile)) fs.unlinkSync(stateFile);

  const fixturesDir = path.join(__dirname, 'fixtures');

  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  const files = [
    { name: 'test-image.png', content: Buffer.from(PNG_1x1_BASE64, 'base64') },
    { name: 'test.pdf',       content: Buffer.from(PDF_CONTENT) },
    { name: 'test-doc.pdf',   content: Buffer.from(PDF_CONTENT) },
  ];

  for (const { name, content } of files) {
    const dest = path.join(fixturesDir, name);
    if (!fs.existsSync(dest)) {
      fs.writeFileSync(dest, content);
    }
  }

  console.log('\n[globalSetup] Fixture files ready in tests/fixtures/\n');
};

/**
 * migrate-uploads.js
 *
 * One-time script: move files sitting at the /uploads/ root into
 * uploads/uncategorized/ and update the `files` table accordingly.
 *
 * Run AFTER applying migration 013_files_usage_column.sql.
 *
 * Usage:  node src/scripts/migrate-uploads.js
 */

const fs   = require('fs');
const path = require('path');
const pool = require('../config/db');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

async function run() {
  const allItems = fs.readdirSync(UPLOADS_DIR);
  const rootFiles = allItems.filter(item => {
    const full = path.join(UPLOADS_DIR, item);
    return fs.statSync(full).isFile() && item !== '.gitkeep';
  });

  if (rootFiles.length === 0) {
    console.log('No root-level files to migrate.');
    await pool.end();
    return;
  }

  const destDir = path.join(UPLOADS_DIR, 'uncategorized');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);

  let moved = 0;
  let skipped = 0;

  for (const filename of rootFiles) {
    const src  = path.join(UPLOADS_DIR, filename);
    const dest = path.join(destDir, filename);

    if (fs.existsSync(dest)) {
      console.warn(`  SKIP (dest exists): ${filename}`);
      skipped++;
      continue;
    }

    fs.renameSync(src, dest);

    const newStoredName = `uncategorized/${filename}`;
    const newFileUrl    = newStoredName; // relative — will be rebuilt by env.appUrl at serve time

    try {
      const [result] = await pool.execute(
        `UPDATE files
         SET stored_name = ?, usage = 'uncategorized'
         WHERE stored_name = ? OR stored_name = ?`,
        [newStoredName, filename, newStoredName]
      );
      console.log(`  MOVED: ${filename} → uncategorized/ (${result.affectedRows} DB row(s) updated)`);
    } catch (err) {
      console.error(`  DB update failed for ${filename}:`, err.message);
    }

    moved++;
  }

  console.log(`\nDone. Moved: ${moved}, Skipped: ${skipped}`);
  await pool.end();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

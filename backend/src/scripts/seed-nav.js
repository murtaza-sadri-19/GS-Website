/**
 * Seed navbar items only.
 *
 *   npm run db:seed-nav
 *
 * Seeds both nav systems:
 *   1. cms_sections → navigation.nav_tree   (public header menu)
 *   2. cms_sections → navigation.sidebar    (left sidebar links)
 *   3. cms_sections → navigation.banners    (sidebar banners)
 *   4. navigation_items table               (relational nav module)
 */
const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env   = require('../config/env');

const DB_DIR = path.join(__dirname, '../../database');

const NAV_FILES = [
  'seed_sgsits_17_navigation.sql',
  'seed_sgsits_20_navigation_sidebar.sql',
  'seed_sgsits_21_navigation_items.sql',
  'seed_sgsits_22_page_sections.sql',
];

async function seedNav() {
  const conn = await mysql.createConnection({
    host:     env.db.host,
    port:     env.db.port,
    user:     env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: true,
  });

  console.log(`\nSeeding navigation into: ${env.db.database}\n`);

  try {
    for (const file of NAV_FILES) {
      const filePath = path.join(DB_DIR, file);
      if (!fs.existsSync(filePath)) {
        console.log(`  • absent  ${file} — skipping`);
        continue;
      }
      const raw = fs.readFileSync(filePath, 'utf8').trim();
      const sql = raw.replace(/^\s*USE\s+\S+\s*;/gim, `USE \`${env.db.database}\`;`);

      process.stdout.write(`  • seeding ${file} … `);
      await conn.query(sql);
      console.log('done');
    }

    console.log('\n✓  Navigation seeded successfully.');
  } finally {
    await conn.end();
  }
}

seedNav().catch((err) => {
  console.error('\nNav seed failed:', err.message);
  process.exit(1);
});

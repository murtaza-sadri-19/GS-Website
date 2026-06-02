/**
 * Enterprise seed runner — loads all seed_enterprise_0N_*.sql files in order.
 *
 *   npm run db:seed
 *
 * Requires the schema + base seed to already be applied (npm run db:migrate).
 * All test accounts use password: Admin@123
 */
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');
const env   = require('../config/env');

const DB_DIR = path.join(__dirname, '../../database');

const SEED_FILES = [
  'seed_enterprise_01_users.sql',
  'seed_enterprise_02_departments.sql',
  'seed_enterprise_03_faculty.sql',
  'seed_enterprise_04_content.sql',
  'seed_enterprise_05_placement.sql',
  'seed_enterprise_06_exam.sql',
  'seed_enterprise_07_gallery_labs.sql',
  'seed_enterprise_08_cms_global.sql',
  'seed_enterprise_09_analytics.sql',
  // SGSITS-specific seeds: 17 actual departments + comprehensive CMS/policy/content
  'seed_sgsits_10_hod_users.sql',
  'seed_sgsits_11_departments.sql',
  'seed_sgsits_12_cms_branding.sql',
  'seed_sgsits_13_policies.sql',
  'seed_sgsits_14_teqip_startup.sql',
  'seed_sgsits_15_placement.sql',
  'seed_sgsits_16_notices_news.sql',
];

async function seed() {
  const conn = await mysql.createConnection({
    host:     env.db.host,
    port:     env.db.port,
    user:     env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: true,
  });

  try {
    for (const file of SEED_FILES) {
      const filePath = path.join(DB_DIR, file);
      if (!fs.existsSync(filePath)) {
        console.log(`  • absent  ${file} — skipping`);
        continue;
      }
      const sql = fs.readFileSync(filePath, 'utf8').trim();
      if (!sql) continue;

      process.stdout.write(`  • seeding ${file} … `);
      await conn.query(sql);
      console.log('done');
    }

    console.log('\n✓  Enterprise seed complete.');
    console.log('   Test password for all accounts: Admin@123');
  } finally {
    await conn.end();
  }
}

seed().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});

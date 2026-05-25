/**
 * Migration runner.
 *
 *   node src/scripts/migrate.js          → apply all pending migrations
 *   npm run db:migrate
 *
 * Strategy
 * --------
 * • A `schema_migrations(version, applied_at)` table tracks what has run.
 * • Ordered list = base files (schema.sql → schema_additions.sql → seed.sql)
 *   followed by every `database/migrations/NNN_*.sql` in filename order.
 * • Each file is recorded after it runs; already-applied files are skipped.
 * • Every file is itself idempotent (CREATE TABLE IF NOT EXISTS / INSERT … ON
 *   DUPLICATE KEY), so a re-run is always safe even before tracking existed.
 *
 * Uses a dedicated multi-statement connection (the app pool deliberately does
 * not allow multi-statements).
 */
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');
const env   = require('../config/env');

const DB_DIR         = path.join(__dirname, '../../database');
const MIGRATIONS_DIR = path.join(DB_DIR, 'migrations');
const BASE_FILES     = ['schema.sql', 'schema_additions.sql', 'seed.sql'];

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // 001_, 002_, … lexicographic order is correct for zero-padded names
}

async function run() {
  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });

  try {
    // Bootstrap database + tracking table (base files also CREATE DATABASE,
    // but we need the tracking table to exist before we record anything).
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.db.database}\`
         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await conn.query(`USE \`${env.db.database}\`;`);
    await conn.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
         version    VARCHAR(255) NOT NULL,
         applied_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
         PRIMARY KEY (version)
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    );

    const [appliedRows] = await conn.query('SELECT version FROM schema_migrations');
    const applied = new Set(appliedRows.map((r) => r.version));

    const ordered = [
      ...BASE_FILES.map((f) => ({ version: f, file: path.join(DB_DIR, f) })),
      ...listMigrationFiles().map((f) => ({ version: f, file: path.join(MIGRATIONS_DIR, f) })),
    ];

    let ran = 0;
    for (const { version, file } of ordered) {
      if (applied.has(version)) {
        console.log(`  • skip   ${version} (already applied)`);
        continue;
      }
      if (!fs.existsSync(file)) {
        console.log(`  • absent ${version} (file not found — skipping)`);
        continue;
      }
      const sql = fs.readFileSync(file, 'utf8').trim();
      if (sql) {
        process.stdout.write(`  • apply  ${version} … `);
        await conn.query(sql);
        console.log('done');
      }
      await conn.query('INSERT INTO schema_migrations (version) VALUES (?)', [version]);
      ran++;
    }

    console.log(ran === 0 ? '\nNothing to migrate — database is up to date.' : `\nApplied ${ran} migration(s).`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('\nMigration failed:', err.message);
  process.exit(1);
});

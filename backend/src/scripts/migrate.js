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
 *
 * SQL normalisation (applied before execution)
 * ─────────────────────────────────────────────
 * • `USE <dbname>;` lines are stripped — the DB is selected from DB_NAME in .env.
 * • `ADD COLUMN IF NOT EXISTS` / `DROP COLUMN IF EXISTS` / `DROP INDEX IF EXISTS`
 *   are rewritten to plain MySQL syntax (these are MariaDB extensions).
 *
 * Each statement in a file is executed individually so that an idempotency
 * error on one statement (e.g. column already exists) does not abort the rest.
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
      const raw = fs.readFileSync(file, 'utf8').trim();
      // Normalise: remove USE statements and rewrite MariaDB-only ALTER TABLE
      // column modifiers to plain MySQL syntax.
      const sql = raw
        .replace(/^\s*USE\s+[`'"]?\w+[`'"]?\s*;\s*$/gim, '')
        .replace(/\bADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\b/gi, 'ADD COLUMN')
        .replace(/\bDROP\s+COLUMN\s+IF\s+EXISTS\b/gi,      'DROP COLUMN')
        .replace(/\bDROP\s+INDEX\s+IF\s+EXISTS\b/gi,       'DROP INDEX')
        .replace(/\bADD\s+INDEX\s+IF\s+NOT\s+EXISTS\b/gi,  'ADD INDEX')
        .trim();

      if (sql) {
        process.stdout.write(`  • apply  ${version} … `);

        // Execute one statement at a time so an idempotency error on one
        // statement (column/key already exists) doesn't abort the rest.
        const statements = sql.split(';').map((s) => s.trim()).filter(Boolean);
        let skipped = 0;
        for (const stmt of statements) {
          try {
            await conn.query(stmt + ';');
          } catch (err) {
            // Idempotency errors — the object already exists; safe to ignore.
            const IGNORABLE = new Set([
              1060, // Duplicate column name          (ADD COLUMN)
              1061, // Duplicate key name             (ADD INDEX / ADD KEY)
              1050, // Table already exists           (CREATE TABLE)
              1091, // Can't DROP … doesn't exist     (DROP COLUMN / DROP INDEX)
              1054, // Unknown column                 (rare DROP COLUMN edge case)
              1068, // Multiple primary key defined
            ]);
            if (IGNORABLE.has(err.errno)) {
              skipped++;
            } else {
              // Re-throw anything unexpected with file context.
              err.message = `[${version}] ${err.message}`;
              throw err;
            }
          }
        }

        // Re-select our DB — some statements may have switched the connection.
        await conn.query(`USE \`${env.db.database}\`;`);
        const note = skipped > 0 ? ` (${skipped} already-exists skipped)` : '';
        console.log(`done${note}`);
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

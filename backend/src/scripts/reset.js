/**
 * Database reset — drops the database and re-runs all migrations from scratch.
 *
 *   npm run db:reset
 *
 * WARNING: This destroys ALL data.  Use only in development.
 */
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');
const env   = require('../config/env');

async function reset() {
  const conn = await mysql.createConnection({
    host:     env.db.host,
    port:     env.db.port,
    user:     env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });

  try {
    console.log(`\n⚠  Dropping database "${env.db.database}"…`);
    await conn.query(`DROP DATABASE IF EXISTS \`${env.db.database}\``);
    console.log('   Done.\n');
  } finally {
    await conn.end();
  }

  console.log('Running migrations…\n');
  execSync('node src/scripts/migrate.js', { stdio: 'inherit' });
  console.log('\n✓  Database reset complete.');
}

reset().catch((err) => {
  console.error('\nReset failed:', err.message);
  process.exit(1);
});

/**
 * Seed a single CENTRAL_ADMIN user (and the required roles rows).
 *
 *   npm run db:seed-admin
 *
 * Login:  admin@sgsits.ac.in  /  Admin@123
 * Change the email/password constants below before running in production.
 */
const mysql  = require('mysql2/promise');
const bcrypt = require('bcrypt');
const env    = require('../config/env');

const ADMIN_NAME     = 'Central Admin';
const ADMIN_EMAIL    = 'admin@sgsits.ac.in';
const ADMIN_PASSWORD = 'Admin@123';

const ROLES = ['CENTRAL_ADMIN', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER', 'HOD', 'TEACHER'];

async function seed() {
  const conn = await mysql.createConnection({
    host:     env.db.host,
    port:     env.db.port,
    user:     env.db.user,
    password: env.db.password,
    database: env.db.database,
  });

  try {
    // 1. Roles
    for (const role of ROLES) {
      await conn.execute(
        'INSERT INTO roles (role_name) VALUES (?) ON DUPLICATE KEY UPDATE role_name = VALUES(role_name)',
        [role]
      );
    }
    console.log('✓  Roles seeded');

    // 2. Central Admin
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const [[roleRow]] = await conn.execute(
      'SELECT id FROM roles WHERE role_name = ?', ['CENTRAL_ADMIN']
    );

    await conn.execute(
      `INSERT INTO users (role_id, department_id, name, email, password_hash, status)
       VALUES (?, NULL, ?, ?, ?, 'ACTIVE')
       ON DUPLICATE KEY UPDATE
         name          = VALUES(name),
         password_hash = VALUES(password_hash),
         status        = VALUES(status)`,
      [roleRow.id, ADMIN_NAME, ADMIN_EMAIL, hash]
    );

    console.log(`✓  Admin user seeded`);
    console.log(`\n   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log('\n   Change the password after first login.\n');
  } finally {
    await conn.end();
  }
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});

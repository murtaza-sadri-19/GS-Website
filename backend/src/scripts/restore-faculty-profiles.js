/**
 * restore-faculty-profiles.js
 * Creates faculty_profiles for every TEACHER (role_id=7) and HOD (role_id=6)
 * user that doesn't already have one.
 *
 * Run: node src/scripts/restore-faculty-profiles.js
 */

require('dotenv').config()
const pool = require('../config/db')

async function run() {
  // Get all TEACHER and HOD users without a faculty_profile
  const [users] = await pool.execute(`
    SELECT u.id, u.name, u.department_id
    FROM users u
    WHERE u.role_id IN (6, 7)        -- HOD or TEACHER
      AND u.status = 'ACTIVE'
      AND NOT EXISTS (
        SELECT 1 FROM faculty_profiles fp WHERE fp.user_id = u.id
      )
    ORDER BY u.id
  `)

  console.log(`Found ${users.length} user(s) missing a faculty_profile`)

  if (users.length === 0) {
    console.log('Nothing to do.')
    process.exit(0)
  }

  let created = 0
  for (const user of users) {
    await pool.execute(
      `INSERT INTO faculty_profiles
         (user_id, department_id, designation, qualification, specialization, status)
       VALUES (?, ?, '', '', '', 'ACTIVE')`,
      [user.id, user.department_id]
    )
    console.log(`  ✓ Created profile for user ${user.id} — ${user.name}`)
    created++
  }

  const [after] = await pool.execute('SELECT COUNT(*) AS cnt FROM faculty_profiles')
  console.log(`\nDone. Created ${created} profile(s). Total faculty_profiles: ${after[0].cnt}`)
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })

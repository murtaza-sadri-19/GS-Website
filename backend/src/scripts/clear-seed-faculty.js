/**
 * clear-seed-faculty.js
 * Removes all seeded dummy faculty_profiles so only real data remains.
 * Run once: node src/scripts/clear-seed-faculty.js
 */

require('dotenv').config()
const pool = require('../config/db')

async function run() {
  const [before] = await pool.execute('SELECT COUNT(*) AS cnt FROM faculty_profiles')
  console.log(`Faculty profiles before: ${before[0].cnt}`)

  await pool.execute('DELETE FROM faculty_profiles')

  const [after] = await pool.execute('SELECT COUNT(*) AS cnt FROM faculty_profiles')
  console.log(`Faculty profiles after:  ${after[0].cnt}`)
  console.log('Done — all seeded faculty profiles removed.')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })

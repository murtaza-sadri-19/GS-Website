/**
 * testDbConnection.js — quick DB connectivity check
 * Usage: npm run db:test
 */

require('dotenv').config()
const pool = require('../config/db')

;(async () => {
  console.log('Testing database connection…')
  console.log(`  Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`)
  console.log(`  DB:   ${process.env.DB_NAME}`)
  console.log(`  User: ${process.env.DB_USER}`)
  console.log(`  Pass: ${process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '(empty)'}`)

  try {
    const [[row]] = await pool.execute('SELECT 1 AS ok, NOW() AS server_time')
    console.log(`\n✅  Connected successfully`)
    console.log(`   Server time: ${row.server_time}`)

    const [[{ cnt }]] = await pool.execute('SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME])
    console.log(`   Tables in database: ${cnt}`)

    process.exit(0)
  } catch (err) {
    console.error(`\n❌  Connection failed: ${err.message}`)
    process.exit(1)
  }
})()

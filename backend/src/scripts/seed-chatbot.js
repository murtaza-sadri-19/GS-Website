/**
 * Seed chatbot config + SGSITS keyword responses.
 *
 *   npm run db:seed-chatbot
 *
 * Safe to re-run — TRUNCATE + re-insert keeps responses fresh.
 */
const fs    = require('fs')
const path  = require('path')
const mysql = require('mysql2/promise')
const env   = require('../config/env')

async function seedChatbot() {
  const conn = await mysql.createConnection({
    host:     env.db.host,
    port:     env.db.port,
    user:     env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: true,
  })

  console.log(`\nSeeding chatbot into: ${env.db.database}\n`)

  try {
    const file = path.join(__dirname, '../../database/seed_sgsits_23_chatbot.sql')
    const raw  = fs.readFileSync(file, 'utf8').trim()
    const sql  = raw.replace(/^\s*USE\s+\S+\s*;/gim, `USE \`${env.db.database}\`;`)

    process.stdout.write('  • seeding seed_sgsits_23_chatbot.sql … ')
    await conn.query(sql)
    console.log('done')

    console.log('\n✓  Chatbot seeded successfully.')
  } finally {
    await conn.end()
  }
}

seedChatbot().catch(err => {
  console.error('\nChatbot seed failed:', err.message)
  process.exit(1)
})

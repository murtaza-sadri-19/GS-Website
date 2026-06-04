/**
 * Database clear — truncates every table, leaving the schema intact.
 * Migration tracking (schema_migrations) is preserved so db:migrate
 * does not re-apply already-applied files.
 *
 *   npm run db:clear
 *
 * WARNING: This destroys ALL data. Use only in development.
 */
const mysql = require('mysql2/promise');
const env   = require('../config/env');

const TABLES = [
  // Exam correction chain
  'exam_correction_update_logs',
  'exam_correction_request_students',
  'exam_correction_requests',

  // Exam marks chain
  'exam_marks_fill_requests',
  'exam_marks',
  'exam_test_details',
  'exam_atkt_marks',
  'exam_atkt_test_details',
  'exam_atkt_students',
  'exam_elective_data',
  'exam_course_outcomes',
  'exam_faculty_subjects',
  'exam_students',
  'exam_subjects',
  'exam_sections',
  'exam_courses',
  'exam_sessions',

  // Faculty sub-resources
  'faculty_publications',
  'faculty_research',
  'faculty_qualifications',
  'faculty_profiles',

  // About / institutional pages (created by seed_sgsits_18_about_us.sql)
  'nirf_rankings',
  'nba_programs',
  'accreditations',
  'academic_council_members',
  'iqac_activities',
  'iqac_objectives',
  'iqac_config',
  'infrastructure_items',
  'telephone_directory',
  'committee_members',
  'committees',
  'administrators',
  'governing_body_members',
  'mission_points',
  'about_vision_mission',
  'director_messages',
  'about_pages',

  // Content & CMS
  'audit_logs',
  'password_reset_tokens',
  'cms_sections',
  'site_settings',
  'alerts',
  'tenders',
  'news',
  'pages',
  'gallery',
  'events',
  'placement_records',
  'exam_documents',
  'downloads',
  'notices',
  'files',

  // Core
  'users',
  'departments',
  'roles',
];

async function clear() {
  const conn = await mysql.createConnection({
    host:               env.db.host,
    port:               env.db.port,
    user:               env.db.user,
    password:           env.db.password,
    database:           env.db.database,
    multipleStatements: true,
  });

  try {
    console.log(`\nClearing all data from "${env.db.database}"…\n`);

    await conn.query('SET FOREIGN_KEY_CHECKS = 0;');

    for (const table of TABLES) {
      try {
        await conn.query(`TRUNCATE TABLE \`${table}\`;`);
        console.log(`  ✓  ${table}`);
      } catch (err) {
        // Table may not exist yet if a migration hasn't run — skip gracefully.
        console.log(`  –  ${table} (skipped: ${err.message})`);
      }
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1;');

    console.log('\n✓  All tables cleared. Schema and migration tracking intact.');
  } finally {
    await conn.end();
  }
}

clear().catch((err) => {
  console.error('\nClear failed:', err.message);
  process.exit(1);
});

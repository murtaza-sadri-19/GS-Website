const pool = require('../config/db');

async function test() {
  try {
    const [rows] = await pool.execute('SELECT section_key, LENGTH(data) as len FROM cms_sections');
    console.log('CMS Sections rows count:', rows.length);
    rows.forEach(r => {
      console.log(`- ${r.section_key}: ${r.len} bytes`);
    });
  } catch (err) {
    console.error('Failed to query cms_sections:', err);
  } finally {
    process.exit(0);
  }
}

test();

const pool = require('../config/db');

async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Database connection successful');

    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('Query test passed — result:', rows[0].result);

    const [tables] = await connection.execute(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name'
    );

    if (tables.length === 0) {
      console.log('No tables found — run schema.sql first');
    } else {
      console.log(`Tables found (${tables.length}):`);
      tables.forEach((t) => console.log(' ', t.table_name || t.TABLE_NAME));
    }

    console.log('\nAll checks passed');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

testConnection();

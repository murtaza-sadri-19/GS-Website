const pool = require('./src/config/db');
async function run() {
  try {
    const [columns] = await pool.execute('DESCRIBE notices');
    console.log(JSON.stringify(columns, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();

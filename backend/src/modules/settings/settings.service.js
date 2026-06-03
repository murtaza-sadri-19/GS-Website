/**
 * Settings & CMS Sections Service
 *
 * site_settings  — flat key/value pairs (e.g. "site.title", "topbar.phone")
 * cms_sections   — rich JSON blobs (e.g. "footer.branding", "home.hero")
 */

const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

// ── Site Settings ────────────────────────────────────────────────────────────

async function getAllSettings() {
  const [rows] = await pool.execute('SELECT `key`, `value`, updated_at FROM site_settings ORDER BY `key`');
  // Convert to object map, parsing types where appropriate
  return rows.reduce((acc, r) => {
    let val = r.value;
    if (val === 'true') {
      val = true;
    } else if (val === 'false') {
      val = false;
    } else if (val !== null && val !== undefined) {
      if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
        try {
          val = JSON.parse(val);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }
    }
    acc[r.key] = val;
    return acc;
  }, {});
}

async function getSetting(key) {
  const [rows] = await pool.execute('SELECT `value` FROM site_settings WHERE `key` = ?', [key]);
  let val = rows[0]?.value ?? null;
  if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  } else if (val !== null && val !== undefined) {
    if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
      try {
        return JSON.parse(val);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
  }
  return val;
}

async function setSetting(key, value, actor) {
  let valStr = value;
  if (typeof value === 'object' && value !== null) {
    valStr = JSON.stringify(value);
  } else if (value !== undefined && value !== null) {
    valStr = String(value);
  } else {
    valStr = null;
  }

  await pool.execute(
    `INSERT INTO site_settings (\`key\`, \`value\`, updated_by)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_by = VALUES(updated_by), updated_at = NOW()`,
    [key, valStr, actor.id]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'settings', recordId: null,
    description: `Set setting "${key}"` });
}

async function setBulkSettings(settingsObj, actor) {
  if (!settingsObj || typeof settingsObj !== 'object') throw httpError('settingsObj must be an object', 400);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const [key, value] of Object.entries(settingsObj)) {
      let valStr = value;
      if (typeof value === 'object' && value !== null) {
        valStr = JSON.stringify(value);
      } else if (value !== undefined && value !== null) {
        valStr = String(value);
      } else {
        valStr = null;
      }

      await conn.execute(
        `INSERT INTO site_settings (\`key\`, \`value\`, updated_by)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_by = VALUES(updated_by), updated_at = NOW()`,
        [key, valStr, actor.id]
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'settings', recordId: null,
    description: `Bulk updated ${Object.keys(settingsObj).length} settings` });
}

// ── CMS Sections ─────────────────────────────────────────────────────────────

async function getCmsSection(sectionKey) {
  const [rows] = await pool.execute(
    'SELECT data, updated_at FROM cms_sections WHERE section_key = ?', [sectionKey]
  );
  if (!rows[0]) return null;
  const raw = rows[0].data;
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

async function setCmsSection(sectionKey, data, actor) {
  const jsonStr = JSON.stringify(data);
  await pool.execute(
    `INSERT INTO cms_sections (section_key, data, updated_by)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by), updated_at = NOW()`,
    [sectionKey, jsonStr, actor.id]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'cms', recordId: null,
    description: `Saved CMS section "${sectionKey}"` });
}

async function listCmsSections() {
  const [rows] = await pool.execute(
    'SELECT section_key, updated_at FROM cms_sections ORDER BY section_key'
  );
  return rows;
}

module.exports = {
  getAllSettings, getSetting, setSetting, setBulkSettings,
  getCmsSection, setCmsSection, listCmsSections,
};

const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

/** Build a nested tree from flat rows. */
function buildTree(rows) {
  const byId = new Map();
  rows.forEach((r) => byId.set(r.id, { ...r, children: [] }));
  const roots = [];
  byId.forEach((node) => {
    if (node.parent_id && byId.has(node.parent_id)) byId.get(node.parent_id).children.push(node);
    else roots.push(node);
  });
  return roots;
}

async function getTree({ includeInactive } = {}) {
  const where = includeInactive ? '' : 'WHERE is_active = 1';
  const [rows] = await pool.execute(
    `SELECT id, parent_id, label, url, icon, sort_order, target, is_active
       FROM navigation_items ${where} ORDER BY sort_order ASC, id ASC`
  );
  return buildTree(rows);
}

/**
 * Replace the entire navigation tree. Accepts a nested array of
 * { label, url, icon, target, is_active, children[] }. Inserts parents first
 * so child rows can reference real parent ids. Wrapped in a transaction.
 */
async function replaceTree(items, actor) {
  if (!Array.isArray(items)) throw httpError('Expected an array of navigation items', 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM navigation_items');

    let order = 0;
    const insertNode = async (node, parentId) => {
      if (!node || !node.label) return;
      const [res] = await conn.execute(
        `INSERT INTO navigation_items (parent_id, label, url, icon, sort_order, target, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [parentId, node.label, node.url || null, node.icon || null, node.sort_order ?? order++,
         node.target === '_blank' ? '_blank' : '_self', node.is_active === false ? 0 : 1]
      );
      const newId = res.insertId;
      if (Array.isArray(node.children)) {
        for (const child of node.children) await insertNode(child, newId);
      }
    };

    for (const root of items) await insertNode(root, null);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'navigation', description: 'Replaced navigation tree' });
  return getTree({ includeInactive: true });
}

module.exports = { getTree, replaceTree };

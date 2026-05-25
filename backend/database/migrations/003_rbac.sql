-- =============================================================================
-- 003 — Granular RBAC: permissions + role_permissions + 2 new roles
-- Idempotent. Depends on: roles, users (001_core / schema.sql).
-- =============================================================================
USE college_website;

-- ── New roles (frontend already references super_admin + content editor) ──────
INSERT INTO roles (role_name) VALUES ('SUPER_ADMIN'), ('CONTENT_EDITOR')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- ── Permission catalog ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS permissions (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  resource    VARCHAR(60)  NOT NULL,
  action      VARCHAR(30)  NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permissions_name (name),
  KEY idx_permissions_res_act (resource, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       INT NOT NULL,
  permission_id INT NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id)       REFERENCES roles       (id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_perm FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed catalog as resource × action (some combos unused but harmless) ───────
INSERT INTO permissions (name, resource, action)
SELECT CONCAT(res.r, '.', act.a), res.r, act.a
FROM (
  SELECT 'cms' r UNION SELECT 'users' UNION SELECT 'departments' UNION SELECT 'faculty'
  UNION SELECT 'notices' UNION SELECT 'news' UNION SELECT 'events' UNION SELECT 'tenders'
  UNION SELECT 'alerts' UNION SELECT 'downloads' UNION SELECT 'gallery' UNION SELECT 'placement'
  UNION SELECT 'exam' UNION SELECT 'academic' UNION SELECT 'settings' UNION SELECT 'media'
  UNION SELECT 'navigation' UNION SELECT 'seo' UNION SELECT 'analytics' UNION SELECT 'contact'
  UNION SELECT 'chatbot' UNION SELECT 'leaves' UNION SELECT 'timetables' UNION SELECT 'labs'
  UNION SELECT 'achievements' UNION SELECT 'registration' UNION SELECT 'audit'
) res
CROSS JOIN (
  SELECT 'read' a UNION SELECT 'create' UNION SELECT 'update'
  UNION SELECT 'delete' UNION SELECT 'publish' UNION SELECT 'manage'
) act
ON DUPLICATE KEY UPDATE resource = VALUES(resource), action = VALUES(action);

-- ── Grants ────────────────────────────────────────────────────────────────────
-- SUPER_ADMIN + CENTRAL_ADMIN → everything
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.role_name IN ('SUPER_ADMIN', 'CENTRAL_ADMIN');

-- CONTENT_EDITOR → content resources, no delete, no users/settings/exam/placement
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
  ON p.resource IN ('cms','news','events','notices','gallery','media','seo','downloads','alerts')
 AND p.action   IN ('read','create','update','publish')
WHERE r.role_name = 'CONTENT_EDITOR';

-- HOD → department-scoped operations (ownership enforced in services)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
  ON p.resource IN ('faculty','notices','events','gallery','downloads','labs','achievements',
                    'timetables','leaves','registration','academic','departments')
 AND p.action   IN ('read','create','update','publish','manage')
WHERE r.role_name = 'HOD';

-- TEACHER → own profile/marks/leave (read-heavy; ownership enforced in services)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
  ON (p.resource IN ('faculty','leaves','academic') AND p.action IN ('read','create','update'))
  OR (p.resource IN ('notices','events','timetables') AND p.action = 'read')
WHERE r.role_name = 'TEACHER';

-- EXAM_CONTROLLER → exam + academic + downloads
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
  ON p.resource IN ('exam','academic','downloads')
 AND p.action   IN ('read','create','update','delete','publish','manage')
WHERE r.role_name = 'EXAM_CONTROLLER';

-- PLACEMENT_OFFICER → placement + cms (placement CMS page)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p
  ON (p.resource = 'placement' AND p.action IN ('read','create','update','delete','publish','manage'))
  OR (p.resource = 'cms' AND p.action IN ('read','update'))
WHERE r.role_name = 'PLACEMENT_OFFICER';

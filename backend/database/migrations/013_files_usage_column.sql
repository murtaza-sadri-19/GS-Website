-- =============================================================================
-- Migration 013: Add `usage` column to files table for module categorization
--
-- Purpose: Every uploaded file now records which module/context it was uploaded
-- from. This enables the media manager to filter files by module (e.g. show only
-- faculty profile photos, or only exam documents).
--
-- Idempotent: guarded by information_schema check.
-- =============================================================================
USE college_website;

-- ── Step 1: Add usage column ──────────────────────────────────────────────────
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'files'
    AND COLUMN_NAME  = 'usage'
);
SET @ddl := IF(@col_exists = 0,
  "ALTER TABLE files ADD COLUMN `usage` VARCHAR(60) DEFAULT NULL COMMENT 'Module context this file belongs to (gallery, faculty, events, departments, notices, downloads, exam, placement, admissions, labs, achievements, research, cms, chatbot, pages, settings, users, homepage)' AFTER attachment_type",
  'SELECT 1'
);
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Step 2: Add index on usage for filtered queries ───────────────────────────
SET @idx_exists := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'files'
    AND INDEX_NAME   = 'idx_files_usage'
);
SET @ddl2 := IF(@idx_exists = 0,
  'ALTER TABLE files ADD INDEX idx_files_usage (`usage`)',
  'SELECT 1'
);
PREPARE stmt2 FROM @ddl2; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;

-- ── Step 3: Backfill usage from stored_name path prefix ───────────────────────
-- Files uploaded with usage have stored_name like "gallery/filename.jpg"
-- Extract the prefix as the usage value where it's not already set.
UPDATE files
SET `usage` = SUBSTRING_INDEX(stored_name, '/', 1)
WHERE `usage` IS NULL
  AND stored_name IS NOT NULL
  AND stored_name LIKE '%/%';

-- Files at root (no slash in stored_name) get usage = 'uncategorized'
UPDATE files
SET `usage` = 'uncategorized'
WHERE `usage` IS NULL
  AND stored_name IS NOT NULL
  AND stored_name NOT LIKE '%/%';

-- External links keep usage = NULL (no physical storage)
-- (already NULL, no action needed)

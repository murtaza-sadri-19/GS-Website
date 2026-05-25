-- =============================================================================
-- Migration 012: Dual Attachment Support (File Upload + External Link)
-- =============================================================================
-- Extends the `files` table to act as a universal attachment registry.
-- Uploaded files (LOCAL/CLOUDINARY) AND external URLs both live here.
-- All module tables (notices, downloads, events, etc.) continue using
-- file_id FK — zero breaking changes to dependent tables.
--
-- attachment_type = 'FILE'          → real upload (LOCAL or CLOUDINARY)
-- attachment_type = 'EXTERNAL_LINK' → external URL (Google Drive, website, CDN…)
--
-- Backward compatibility:
--   All existing rows default to attachment_type = 'FILE'.
--   stored_name / file_size become nullable (NULL for external links).
--   storage_type gains a third value 'EXTERNAL' for external-link rows.
-- =============================================================================

USE college_website;

-- ── Step 1: Add attachment_type column ────────────────────────────────────────
ALTER TABLE files
  ADD COLUMN attachment_type ENUM('FILE', 'EXTERNAL_LINK') NOT NULL DEFAULT 'FILE'
    COMMENT 'FILE = real upload; EXTERNAL_LINK = URL-only attachment'
    AFTER id;

-- ── Step 2: Add external_url column ──────────────────────────────────────────
ALTER TABLE files
  ADD COLUMN external_url TEXT DEFAULT NULL
    COMMENT 'Populated only when attachment_type = EXTERNAL_LINK'
    AFTER file_url;

-- ── Step 3: Add rich-media metadata columns ───────────────────────────────────
ALTER TABLE files
  ADD COLUMN thumbnail_url  TEXT         DEFAULT NULL
    COMMENT 'Optional thumbnail / preview URL (for both types)'
    AFTER external_url,
  ADD COLUMN alt_text       VARCHAR(255) DEFAULT NULL
    COMMENT 'Accessible alt-text for images or link description'
    AFTER thumbnail_url,
  ADD COLUMN meta_title     VARCHAR(255) DEFAULT NULL
    COMMENT 'SEO / display title (auto-fetched for external links where possible)'
    AFTER alt_text,
  ADD COLUMN meta_description TEXT        DEFAULT NULL
    COMMENT 'Optional description / excerpt'
    AFTER meta_title;

-- ── Step 4: Make file-specific columns nullable (external links have no size) ─
ALTER TABLE files
  MODIFY COLUMN stored_name VARCHAR(255) DEFAULT NULL,
  MODIFY COLUMN file_size   INT          DEFAULT NULL;

-- ── Step 5: Extend storage_type enum to include EXTERNAL ─────────────────────
ALTER TABLE files
  MODIFY COLUMN storage_type
    ENUM('LOCAL','CLOUDINARY','EXTERNAL') NOT NULL DEFAULT 'LOCAL';

-- ── Step 6: Add index on attachment_type for filtered queries ─────────────────
ALTER TABLE files
  ADD INDEX idx_files_attachment_type (attachment_type);

-- ── Step 7: Integrity constraint — external_url required for EXTERNAL_LINK ────
-- MySQL doesn't support CHECK constraints with IS NULL checks across enum + col
-- in all versions, so this is enforced at the application layer in files.service.js.

-- ── Verification query (run to confirm) ───────────────────────────────────────
-- SELECT
--   COLUMN_NAME,
--   COLUMN_TYPE,
--   IS_NULLABLE,
--   COLUMN_DEFAULT,
--   COLUMN_COMMENT
-- FROM information_schema.COLUMNS
-- WHERE TABLE_SCHEMA = 'college_website'
--   AND TABLE_NAME   = 'files'
-- ORDER BY ORDINAL_POSITION;

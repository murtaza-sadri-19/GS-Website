-- =============================================================================
-- Migration 022: page_sections + navigation page linking
--
-- page_sections: CMS-managed sections for every landing page.
--   page_key  = 'about' | 'academics' | 'departments' | 'admissions' |
--               'placements' | 'campus-life' | 'facilities' | 'more'
--               (or any custom slug for future pages)
--
-- navigation_items: add page_id FK so nav items auto-sync to page slugs.
-- =============================================================================

-- ── 1. page_sections ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_sections (
  id            INT          NOT NULL AUTO_INCREMENT,
  page_key      VARCHAR(100) NOT NULL,
  section_key   VARCHAR(100) NOT NULL,
  section_type  ENUM(
    'hero', 'stats', 'cards', 'nav_children',
    'links', 'downloads', 'gallery', 'faq',
    'cta', 'announcements', 'dynamic_data', 'html', 'featured'
  ) NOT NULL DEFAULT 'html',
  title         VARCHAR(255) DEFAULT NULL,
  subtitle      VARCHAR(1000) DEFAULT NULL,
  content       LONGTEXT     DEFAULT NULL,
  settings_json JSON         DEFAULT NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE  KEY uq_page_section (page_key, section_key),
  KEY idx_page_sections_lookup (page_key, is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── 2. link navigation_items → pages ─────────────────────────────────────────
-- Nullable page_id: when set, the public site can resolve the nav URL
-- from the linked page's current slug automatically (no broken links).
ALTER TABLE navigation_items
  ADD COLUMN IF NOT EXISTS page_id INT DEFAULT NULL,
  ADD CONSTRAINT fk_nav_item_page
    FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE SET NULL;

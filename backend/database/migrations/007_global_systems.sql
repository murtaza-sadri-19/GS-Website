-- =============================================================================
-- 007 — Global systems: navigation, SEO, contact, analytics, notifications, albums
-- Idempotent. Depends on: users, departments, files, gallery (001_core).
-- =============================================================================
USE college_website;

-- ── Navigation menu (nested via parent_id) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS navigation_items (
  id         INT          NOT NULL AUTO_INCREMENT,
  parent_id  INT          DEFAULT NULL,
  label      VARCHAR(150) NOT NULL,
  url        VARCHAR(500) DEFAULT NULL,
  icon       VARCHAR(60)  DEFAULT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  target     ENUM('_self','_blank') NOT NULL DEFAULT '_self',
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_nav_parent (parent_id, sort_order),
  CONSTRAINT fk_nav_parent FOREIGN KEY (parent_id) REFERENCES navigation_items (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Per-page SEO metadata ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_metadata (
  id               INT          NOT NULL AUTO_INCREMENT,
  page_key         VARCHAR(200) NOT NULL,
  title            VARCHAR(255) DEFAULT NULL,
  description      TEXT         DEFAULT NULL,
  og_title         VARCHAR(255) DEFAULT NULL,
  og_description   TEXT         DEFAULT NULL,
  og_image_file_id INT          DEFAULT NULL,
  canonical        VARCHAR(500) DEFAULT NULL,
  robots           VARCHAR(100) DEFAULT 'index,follow',
  structured_data  JSON         DEFAULT NULL,
  updated_by       INT          DEFAULT NULL,
  updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_seo_page (page_key),
  CONSTRAINT fk_seo_image FOREIGN KEY (og_image_file_id) REFERENCES files (id) ON DELETE SET NULL,
  CONSTRAINT fk_seo_user  FOREIGN KEY (updated_by)        REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Contact form submissions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(30)  DEFAULT NULL,
  subject    VARCHAR(255) DEFAULT NULL,
  message    TEXT         NOT NULL,
  ip_address VARCHAR(60)  DEFAULT NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_read (is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Visitor analytics ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitor_stats (
  stat_date     DATE   NOT NULL,
  page_views    BIGINT NOT NULL DEFAULT 0,
  unique_visits BIGINT NOT NULL DEFAULT 0,
  PRIMARY KEY (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS visitor_total (
  id           INT    NOT NULL DEFAULT 1,
  total_count  BIGINT NOT NULL DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO visitor_total (id, total_count) VALUES (1, 0) ON DUPLICATE KEY UPDATE id = id;

-- ── Portal notifications (inbox) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         INT          NOT NULL AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  title      VARCHAR(255) NOT NULL,
  message    TEXT         DEFAULT NULL,
  link       VARCHAR(500) DEFAULT NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_user (user_id, is_read, created_at),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Gallery albums (group flat gallery images) ────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_albums (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL,
  description   TEXT         DEFAULT NULL,
  cover_file_id INT          DEFAULT NULL,
  department_id INT          DEFAULT NULL,
  event_date    DATE         DEFAULT NULL,
  status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_by    INT          DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_album_slug (slug),
  CONSTRAINT fk_album_cover FOREIGN KEY (cover_file_id) REFERENCES files       (id) ON DELETE SET NULL,
  CONSTRAINT fk_album_dept  FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
  CONSTRAINT fk_album_user  FOREIGN KEY (created_by)    REFERENCES users       (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add gallery.album_id (idempotent — guarded against re-run)
SET @col_exists := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'gallery' AND COLUMN_NAME = 'album_id'
);
SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE gallery ADD COLUMN album_id INT NULL,
     ADD CONSTRAINT fk_gallery_album FOREIGN KEY (album_id) REFERENCES gallery_albums (id) ON DELETE SET NULL',
  'SELECT 1');
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- =============================================================================
-- Migration 014 — Full-text Search Index for PDF content
-- Run AFTER all previous migrations
-- =============================================================================

USE college_website;

CREATE TABLE IF NOT EXISTS search_index (
  id           INT           NOT NULL AUTO_INCREMENT,
  source_type  VARCHAR(50)   NOT NULL COMMENT 'notice|download|news|event|tender|page|exam_doc|placement',
  source_id    INT           NOT NULL,
  file_id      INT           DEFAULT NULL,
  title        VARCHAR(500)  NOT NULL,
  content_text MEDIUMTEXT    DEFAULT NULL,
  url          VARCHAR(1000) DEFAULT NULL,
  indexed_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_search_source (source_type, source_id),
  KEY idx_search_file (file_id),
  FULLTEXT KEY ft_search (title, content_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

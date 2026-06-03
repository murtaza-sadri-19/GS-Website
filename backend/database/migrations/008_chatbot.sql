-- =============================================================================
-- 008 — Chatbot: config (singleton) + keyword-matched responses
-- Idempotent. No hard dependencies beyond the database.
-- =============================================================================
USE SGSITS_DB;

CREATE TABLE IF NOT EXISTS chatbot_config (
  id                INT          NOT NULL DEFAULT 1,
  bot_name          VARCHAR(100) NOT NULL DEFAULT 'SGSITS Assistant',
  avatar_url        VARCHAR(500) DEFAULT NULL,
  welcome_message   TEXT         DEFAULT NULL,
  input_placeholder VARCHAR(200) DEFAULT 'Ask me anything…',
  fallback_message  TEXT         DEFAULT NULL,
  is_active         TINYINT(1)   NOT NULL DEFAULT 1,
  updated_at        DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO chatbot_config (id, welcome_message, fallback_message)
VALUES (1, 'Hello! How can I help you today?', "Sorry, I didn't understand that. Please try rephrasing or contact the office.")
ON DUPLICATE KEY UPDATE id = id;

CREATE TABLE IF NOT EXISTS chatbot_responses (
  id            INT          NOT NULL AUTO_INCREMENT,
  category      VARCHAR(100) DEFAULT 'General',
  keywords      TEXT         DEFAULT NULL,  -- comma-separated keywords matched against the query
  reply         TEXT         NOT NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_chatbot_active (is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

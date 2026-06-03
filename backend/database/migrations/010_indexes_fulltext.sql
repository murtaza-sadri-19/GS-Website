-- =============================================================================
-- 010 — FULLTEXT search indexes (powers GET /api/v1/search)
-- Idempotent — each index guarded against re-creation.
-- =============================================================================
USE SGSITS_DB;

-- notices(title, description)
SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'notices' AND INDEX_NAME = 'ft_notices');
SET @s := IF(@x = 0, 'ALTER TABLE notices ADD FULLTEXT INDEX ft_notices (title, description)', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- news(title, excerpt, content)
SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'news' AND INDEX_NAME = 'ft_news');
SET @s := IF(@x = 0, 'ALTER TABLE news ADD FULLTEXT INDEX ft_news (title, excerpt, content)', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- events(title, description)
SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events' AND INDEX_NAME = 'ft_events');
SET @s := IF(@x = 0, 'ALTER TABLE events ADD FULLTEXT INDEX ft_events (title, description)', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

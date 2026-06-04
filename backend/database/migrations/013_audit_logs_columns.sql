-- =============================================================================
-- 013 — Extend audit_logs with rich metadata columns
-- Run AFTER schema.sql. Idempotent — uses ALTER TABLE IF NOT EXISTS patterns.
-- =============================================================================
USE SGSITS_DB;

-- Add missing columns that audit.js writes and audit.service.js reads.
-- Each statement is wrapped in a guard so it's safe to re-run.

SET @db = DATABASE();

-- entity_name
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='entity_name');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN entity_name VARCHAR(100) DEFAULT NULL AFTER module_name','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- old_value
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='old_value');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN old_value JSON DEFAULT NULL AFTER description','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- new_value
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='new_value');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN new_value JSON DEFAULT NULL AFTER old_value','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- changed_fields
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='changed_fields');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN changed_fields JSON DEFAULT NULL AFTER new_value','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- severity
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='severity');
SET @s := IF(@x=0,"ALTER TABLE audit_logs ADD COLUMN severity ENUM('low','medium','high','critical') NOT NULL DEFAULT 'low' AFTER changed_fields",'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- user_agent
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='user_agent');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN user_agent TEXT DEFAULT NULL AFTER ip_address','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- browser
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='browser');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN browser VARCHAR(100) DEFAULT NULL AFTER user_agent','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- os
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='os');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN os VARCHAR(100) DEFAULT NULL AFTER browser','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- device
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='device');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN device VARCHAR(50) DEFAULT NULL AFTER os','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- request_url
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='request_url');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN request_url VARCHAR(500) DEFAULT NULL AFTER device','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- request_method
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='request_method');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN request_method VARCHAR(10) DEFAULT NULL AFTER request_url','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- session_id
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='session_id');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN session_id VARCHAR(255) DEFAULT NULL AFTER request_method','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- status
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='status');
SET @s := IF(@x=0,"ALTER TABLE audit_logs ADD COLUMN status ENUM('success','failure') NOT NULL DEFAULT 'success' AFTER session_id",'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- Performance indexes
SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND INDEX_NAME='idx_audit_severity');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD INDEX idx_audit_severity (severity)','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND INDEX_NAME='idx_audit_status');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD INDEX idx_audit_status (status)','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND INDEX_NAME='idx_audit_created_at');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD INDEX idx_audit_created_at (created_at)','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

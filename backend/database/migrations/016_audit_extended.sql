-- Migration 016: Extend audit_logs with entity_name, old/new values, severity, user_agent
-- All columns are also added by 013_audit_logs_columns.sql (idempotent).
-- This file is kept idempotent so re-runs are safe regardless of apply order.

USE SGSITS_DB;

SET @db = DATABASE();

-- entity_name
SET @x := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND COLUMN_NAME='entity_name');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD COLUMN entity_name VARCHAR(255) DEFAULT NULL AFTER module_name','SELECT 1');
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

-- idx_audit_severity
SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND INDEX_NAME='idx_audit_severity');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD INDEX idx_audit_severity (severity)','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

-- idx_audit_action
SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND INDEX_NAME='idx_audit_action');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD INDEX idx_audit_action (action)','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

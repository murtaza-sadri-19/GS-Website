-- Migration 017: Enrich audit_logs with parsed UA fields, request details, and login status
-- All columns are also added by 013_audit_logs_columns.sql (idempotent).
-- This file is kept idempotent so re-runs are safe regardless of apply order.

USE SGSITS_DB;

SET @db = DATABASE();

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

-- idx_audit_status
SET @x := (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='audit_logs' AND INDEX_NAME='idx_audit_status');
SET @s := IF(@x=0,'ALTER TABLE audit_logs ADD INDEX idx_audit_status (status)','SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

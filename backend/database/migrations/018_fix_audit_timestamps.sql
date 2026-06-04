-- Migration 018: Correct audit_log timestamps that were stored in IST instead of UTC.
--
-- Root cause: MySQL server timezone was IST, so DEFAULT CURRENT_TIMESTAMP stored
-- local time. mysql2 (timezone:'+00:00') reads DATETIME columns as UTC, causing
-- a double +5:30 offset when the frontend converts to IST for display.
--
-- This migration subtracts 330 minutes (5h30m) from every existing created_at
-- to convert the stored IST values to their correct UTC representation.
--
-- After running this migration, audit.js explicitly passes created_at = new Date()
-- (UTC) in all future INSERTs, so this is a one-time correction.

UPDATE audit_logs
SET created_at = DATE_SUB(created_at, INTERVAL 330 MINUTE);

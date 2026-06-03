-- Migration 016: Extend audit_logs with entity_name, old/new values, severity, user_agent
-- All new columns are nullable for backward compatibility with existing log calls.

ALTER TABLE audit_logs
  ADD COLUMN entity_name    VARCHAR(255)                                       DEFAULT NULL  AFTER module_name,
  ADD COLUMN old_value      JSON                                               DEFAULT NULL  AFTER description,
  ADD COLUMN new_value      JSON                                               DEFAULT NULL  AFTER old_value,
  ADD COLUMN changed_fields JSON                                               DEFAULT NULL  AFTER new_value,
  ADD COLUMN severity       ENUM('low','medium','high','critical') NOT NULL    DEFAULT 'low' AFTER changed_fields,
  ADD COLUMN user_agent     TEXT                                               DEFAULT NULL  AFTER ip_address,
  ADD INDEX  idx_audit_severity (severity),
  ADD INDEX  idx_audit_action   (action);

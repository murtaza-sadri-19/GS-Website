-- Migration 021: Add physical location field to departments
-- DB name comes from .env (DB_NAME) — no USE statement needed here.
ALTER TABLE departments
  ADD COLUMN location VARCHAR(500) NULL
    COMMENT 'Physical address / wing shown on the public Contact tab'
    AFTER contact_phone;

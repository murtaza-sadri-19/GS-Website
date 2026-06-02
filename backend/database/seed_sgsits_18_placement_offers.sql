-- =============================================================================
-- SGSITS Seed 18: Initial placement student offer records
-- (Migrated from hardcoded MOCK_RECORDS in PlacementRecords.tsx)
-- Run AFTER: migration 014_placement_student_offers.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;

SET @po = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

INSERT INTO placement_student_offers
  (student_name, enrollment_no, branch, company_name, ctc_lpa, academic_year, offer_status, created_by)
VALUES
  ('Aarav Sharma',   '0901CS21101', 'CSE', 'Microsoft IDC', 42.00, '2025-26', 'Placed',  @po),
  ('Priya Verma',    '0901CS21102', 'CSE', 'Goldman Sachs', 28.00, '2025-26', 'Placed',  @po),
  ('Karan Rathore',  '0901IT21101', 'IT',  'Amazon',        24.00, '2025-26', 'Placed',  @po),
  ('Rahul Gupta',    '0901CS21103', 'CSE', 'Adobe',         18.00, '2025-26', 'Offered', @po),
  ('Sneha Patel',    '0901CS21104', 'CSE', 'Walmart Labs',  16.00, '2025-26', 'Placed',  @po),
  ('Amit Verma',     '0901EC21101', 'ECE', 'Cognizant',      6.00, '2024-25', 'Placed',  @po)
ON DUPLICATE KEY UPDATE company_name = VALUES(company_name);

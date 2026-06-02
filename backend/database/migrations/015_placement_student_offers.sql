-- =============================================================================
-- Migration 014: Individual student placement offer records
--
-- The existing placement_records table stores document-level records
-- (PDFs, notices, company visits). This table stores per-student
-- placement offer details as entered by the Placement Officer.
-- =============================================================================
USE college_website;

CREATE TABLE IF NOT EXISTS placement_student_offers (
  id             INT           NOT NULL AUTO_INCREMENT,
  student_name   VARCHAR(200)  NOT NULL,
  enrollment_no  VARCHAR(50)   NOT NULL,
  branch         VARCHAR(100)  DEFAULT NULL,
  company_name   VARCHAR(200)  NOT NULL,
  ctc_lpa        DECIMAL(10,2) DEFAULT NULL,
  academic_year  VARCHAR(20)   DEFAULT NULL,
  offer_status   ENUM('Offered','Placed','Declined') NOT NULL DEFAULT 'Placed',
  offer_date     DATE          DEFAULT NULL,
  created_by     INT           NOT NULL,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pso_year_branch (academic_year, branch),
  KEY idx_pso_enrollment (enrollment_no),
  CONSTRAINT fk_pso_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

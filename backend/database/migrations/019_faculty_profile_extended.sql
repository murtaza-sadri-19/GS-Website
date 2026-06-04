-- Migration 019: Extend faculty_profiles with fields required by the public profile page
-- All columns are nullable / have defaults for backward compatibility.

ALTER TABLE faculty_profiles
  ADD COLUMN office_location    VARCHAR(200)  DEFAULT NULL AFTER subjects,
  ADD COLUMN phone_ext          VARCHAR(20)   DEFAULT NULL AFTER office_location,
  ADD COLUMN orcid_id           VARCHAR(100)  DEFAULT NULL AFTER phone_ext,
  ADD COLUMN scopus_h_index     INT           DEFAULT NULL AFTER orcid_id,
  ADD COLUMN total_citations    INT           DEFAULT NULL AFTER scopus_h_index,
  ADD COLUMN linkedin_url       VARCHAR(500)  DEFAULT NULL AFTER total_citations,
  ADD COLUMN google_scholar_url VARCHAR(500)  DEFAULT NULL AFTER linkedin_url,
  ADD COLUMN personal_website   VARCHAR(500)  DEFAULT NULL AFTER google_scholar_url,
  ADD COLUMN phd_guided         INT NOT NULL  DEFAULT 0   AFTER personal_website,
  ADD COLUMN phd_ongoing        INT NOT NULL  DEFAULT 0   AFTER phd_guided,
  ADD COLUMN pg_guided          INT NOT NULL  DEFAULT 0   AFTER phd_ongoing,
  ADD COLUMN admin_roles        JSON          DEFAULT NULL AFTER pg_guided,
  ADD COLUMN memberships        JSON          DEFAULT NULL AFTER admin_roles;

-- admin_roles JSON shape:  [{ "role": "Dean of Academics", "period": "2024-Present", "description": "..." }]
-- memberships  JSON shape:  ["Senior Member, IEEE", "Life Member, ISTE"]

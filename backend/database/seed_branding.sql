USE college_website;

-- ── Branding (logo, short name, full name, taglines) ─────────────────────────
INSERT INTO cms_sections (section_key, data) VALUES (
  'branding',
  JSON_OBJECT(
    'shortCode',           'SGS',
    'shortName',           'SGSITS Indore',
    'fullName',            'Shri G.S. Institute of Technology & Science',
    'establishedYear',     '1952',
    'tagline',             'An Institute of National Standing',
    'subTagline',          'Govt. Aided Autonomous Institute | Indore (M.P.)',
    'logoUrl',             'https://sgsits.vercel.app/assets/media_1776272596244.png',
    'logoAlt',             'SGSITS Indore Official Logo',
    'logoSuffix',          'NAAC A-Grade | NBA Accredited',
    'mobileDrawerTitle',   'SGSITS INDORE',
    'mobileDrawerFooter',  '© 2025 SGSITS Indore. All Rights Reserved.',
    'mobileNavSectionLabel','Main Navigation',
    'preloaderEnabled',    false
  )
)
ON DUPLICATE KEY UPDATE data = VALUES(data);

-- ── Top Bar (helpline, email, institute code, ERP portal link) ────────────────
INSERT INTO cms_sections (section_key, data) VALUES (
  'topbar',
  JSON_OBJECT(
    'helpline',       '+91-731-2582100 / 2582124',
    'email',          'registrar@sgsits.ac.in',
    'instituteCode',  '1752',
    'erpPortalUrl',   'https://www.sgsits.ac.in',
    'erpPortalLabel', 'ERP Portal'
  )
)
ON DUPLICATE KEY UPDATE data = VALUES(data);

SELECT 'Branding & Top Bar seeded.' AS status;

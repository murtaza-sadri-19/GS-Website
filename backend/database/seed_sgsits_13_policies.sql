-- =============================================================================
-- SGSITS Seed 13: Six complete policy documents in cms_sections
-- Replaces the hardcoded fallbacks in policyService.ts
-- Run AFTER: seed_sgsits_12_cms_branding.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

INSERT INTO cms_sections (section_key, data, updated_by) VALUES

-- ── 1. Privacy Policy ─────────────────────────────────────────────────────────
('policy.privacy', JSON_OBJECT(
  'title',         'Privacy Policy',
  'intro',         'This Privacy Policy describes how Shri G. S. Institute of Technology & Science ("SGSITS") collects, uses, and protects information obtained through the official SGSITS website and affiliated digital services.',
  'lastUpdated',   'January 15, 2025',
  'effectiveDate', 'February 1, 2025',
  'contact',       'privacy@sgsits.ac.in',
  'sections', JSON_ARRAY(
    JSON_OBJECT('title','1. Information We Collect',
      'content','We collect information you provide directly to us, such as when you fill out forms, contact us, apply for admissions, or otherwise interact with the SGSITS website. This may include your name, email address, phone number, postal address, educational qualifications, and other relevant details.\n\nWe also automatically collect certain technical information when you access our website, including your IP address, browser type and version, operating system, referral URLs, pages visited, and date/time of your visit.'),
    JSON_OBJECT('title','2. How We Use Your Information',
      'content','The information we collect is used primarily to facilitate your interaction with SGSITS services, including processing admission applications, responding to queries, sending important academic notifications, and providing access to student portals and resources.\n\nWe may use contact information to send newsletters, event announcements, and institutional updates. You may opt out of non-essential communications at any time.'),
    JSON_OBJECT('title','3. Data Sharing and Disclosure',
      'content','SGSITS does not sell, trade, or rent your personal information to third parties. We may share your information with authorized government bodies (such as AICTE, UGC, or state regulatory authorities) as required by law or for accreditation purposes.'),
    JSON_OBJECT('title','4. Cookies and Tracking Technologies',
      'content','Our website uses cookies to enhance user experience, remember preferences, and gather analytical data. Essential cookies are necessary for basic site functionality and cannot be disabled. Analytics cookies help us understand how visitors use our site.'),
    JSON_OBJECT('title','5. Data Security',
      'content','SGSITS implements appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. Our website uses industry-standard SSL/TLS encryption for data transmission.'),
    JSON_OBJECT('title','6. Your Rights and Contact',
      'content','You have the right to access, correct, or request deletion of your personal data held by SGSITS. To exercise these rights, or to raise any privacy-related concern, please contact our Data Protection Officer at privacy@sgsits.ac.in, or write to: Data Protection Officer, SGSITS Indore, 23 Park Road, Indore – 452003, Madhya Pradesh.')
  )
), @admin),

-- ── 2. Terms of Use ───────────────────────────────────────────────────────────
('policy.terms', JSON_OBJECT(
  'title',         'Terms of Use',
  'intro',         'By accessing and using the official website of Shri G. S. Institute of Technology & Science (SGSITS), you agree to comply with these Terms of Use. Please read these terms carefully before using any services on this platform.',
  'lastUpdated',   'January 15, 2025',
  'effectiveDate', 'February 1, 2025',
  'contact',       'itcell@sgsits.ac.in',
  'sections', JSON_ARRAY(
    JSON_OBJECT('title','1. Acceptance of Terms',
      'content','By using this website, you accept these Terms of Use in full. If you disagree with any part, you must stop using the website immediately.'),
    JSON_OBJECT('title','2. Use of Website',
      'content','This website is provided for informational and administrative purposes related to SGSITS academic activities. You agree not to use this website for any unlawful, harmful, or fraudulent purpose. Automated data scraping, crawling, or extraction without prior written permission is prohibited.'),
    JSON_OBJECT('title','3. Intellectual Property',
      'content','All content on this website — including text, graphics, logos, images, and software — is the property of SGSITS and is protected under the Copyright Act, 1957, and relevant intellectual property laws. Reproduction without prior written permission is prohibited.'),
    JSON_OBJECT('title','4. Third-Party Links',
      'content','This website may contain links to external websites. SGSITS is not responsible for the content or privacy practices of any third-party sites. Inclusion of a link does not imply endorsement.'),
    JSON_OBJECT('title','5. Limitation of Liability',
      'content','SGSITS provides this website on an "as is" basis without warranties of any kind. SGSITS shall not be liable for any damages arising from the use or inability to use this website.'),
    JSON_OBJECT('title','6. Amendments',
      'content','SGSITS reserves the right to amend these Terms at any time without prior notice. Continued use of the website after changes constitutes acceptance of revised terms.'),
    JSON_OBJECT('title','7. Governing Law',
      'content','These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Indore, Madhya Pradesh.'),
    JSON_OBJECT('title','8. Contact',
      'content','For queries regarding these Terms, contact: IT Cell, SGSITS Indore | itcell@sgsits.ac.in | webmaster@sgsits.ac.in')
  )
), @admin),

-- ── 3. Disclaimer ─────────────────────────────────────────────────────────────
('policy.disclaimer', JSON_OBJECT(
  'title',         'Disclaimer',
  'intro',         'The information on the SGSITS website is provided in good faith and is believed to be accurate at the time of publication. SGSITS accepts no liability for any inaccuracies or outdated information.',
  'lastUpdated',   'January 15, 2025',
  'effectiveDate', 'January 15, 2025',
  'contact',       'registrar@sgsits.ac.in',
  'sections', JSON_ARRAY(
    JSON_OBJECT('title','1. Accuracy of Information',
      'content','While SGSITS makes every effort to ensure that the content on this website is accurate and up to date, we cannot guarantee that all information is error-free. Information may change without notice. Users are advised to verify critical information directly with the institute.'),
    JSON_OBJECT('title','2. No Professional Advice',
      'content','Content on this website is for general informational purposes only and does not constitute legal, financial, or professional advice. SGSITS accepts no responsibility for any decisions made based on information provided on this website.'),
    JSON_OBJECT('title','3. External Links',
      'content','Links to third-party websites are provided for convenience only. SGSITS is not responsible for the content, accuracy, or availability of those websites and does not endorse their views or products.'),
    JSON_OBJECT('title','4. Contact for Corrections',
      'content','If you find any inaccuracies on this website, please inform us at: Registrar, SGSITS Indore | registrar@sgsits.ac.in | 23 Park Road, Indore – 452003, Madhya Pradesh, India')
  )
), @admin),

-- ── 4. Accessibility Statement ────────────────────────────────────────────────
('policy.accessibility', JSON_OBJECT(
  'title',         'Accessibility Statement',
  'intro',         'SGSITS Indore is committed to making its website accessible to all users, including persons with disabilities, in accordance with WCAG 2.1 Level AA guidelines and the Guidelines for Indian Government Websites (GIGW).',
  'lastUpdated',   'January 15, 2025',
  'effectiveDate', 'January 15, 2025',
  'contact',       'accessibility@sgsits.ac.in',
  'sections', JSON_ARRAY(
    JSON_OBJECT('title','1. Conformance Status',
      'content','The SGSITS website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. We are continuously working to improve the accessibility of our digital content.'),
    JSON_OBJECT('title','2. Accessibility Features',
      'content','Our website includes the following accessibility features: keyboard navigation support; skip navigation links; alt text for images; sufficient color contrast ratios; resizable text without loss of functionality; and accessible form labels and error messages.'),
    JSON_OBJECT('title','3. Known Limitations',
      'content','Some older PDF documents and third-party embedded content may not meet full accessibility standards. We are in the process of reviewing and updating these materials.'),
    JSON_OBJECT('title','4. Feedback and Contact',
      'content','We welcome feedback on the accessibility of our website. If you encounter any barriers, please contact us: accessibility@sgsits.ac.in | Phone: +91-731-2570-5700 | SGSITS Indore, 23 Park Road, Indore – 452003, Madhya Pradesh')
  )
), @admin),

-- ── 5. Copyright Policy ───────────────────────────────────────────────────────
('policy.copyright', JSON_OBJECT(
  'title',         'Copyright Policy',
  'intro',         'All content published on the SGSITS website is protected by copyright under the Indian Copyright Act, 1957, and international treaties. SGSITS Indore holds copyright over its original content unless otherwise stated.',
  'lastUpdated',   'January 15, 2025',
  'effectiveDate', 'January 15, 2025',
  'contact',       'copyright@sgsits.ac.in',
  'sections', JSON_ARRAY(
    JSON_OBJECT('title','1. Ownership',
      'content','All original text, photographs, graphics, videos, audio, and other materials on this website are owned by SGSITS Indore or used with appropriate permission. Unauthorized reproduction, distribution, or modification is prohibited.'),
    JSON_OBJECT('title','2. Permitted Use',
      'content','Personal, non-commercial use of content from this website is permitted provided that: (a) the content is not modified; (b) proper attribution is given to SGSITS Indore; and (c) no claim of endorsement is implied.'),
    JSON_OBJECT('title','3. Third-Party Content',
      'content','Some content on this website may be protected by third-party copyrights. Such content is used with permission or under applicable fair-use provisions.'),
    JSON_OBJECT('title','4. Copyright Infringement',
      'content','If you believe that your copyrighted work has been used on this website without permission, please contact: copyright@sgsits.ac.in | Registrar, SGSITS Indore, 23 Park Road, Indore – 452003, Madhya Pradesh')
  )
), @admin),

-- ── 6. Hyperlink Policy ───────────────────────────────────────────────────────
('policy.hyperlink', JSON_OBJECT(
  'title',         'Hyperlink Policy',
  'intro',         'This Hyperlink Policy outlines the rules and guidelines for linking to and from the SGSITS official website.',
  'lastUpdated',   'January 15, 2025',
  'effectiveDate', 'January 15, 2025',
  'contact',       'itcell@sgsits.ac.in',
  'sections', JSON_ARRAY(
    JSON_OBJECT('title','1. Links to External Websites',
      'content','This website may contain links to external websites for informational purposes. SGSITS does not endorse, guarantee, or take responsibility for the content, accuracy, or security of any external website. Access to linked websites is at the user''s own risk.'),
    JSON_OBJECT('title','2. Linking to This Website',
      'content','Third parties may link to the SGSITS website provided that: (a) the link is not misleading and clearly identifies the destination as SGSITS; (b) it does not misrepresent any relationship with SGSITS; and (c) it does not use SGSITS content in a framed or embedded manner without permission.'),
    JSON_OBJECT('title','3. No Endorsement',
      'content','The presence of a hyperlink does not imply that SGSITS endorses the linked website, its content, or the organization operating it.'),
    JSON_OBJECT('title','4. Broken Links',
      'content','We strive to ensure that all links on this website are functional. If you encounter a broken link, please notify us at: itcell@sgsits.ac.in')
  )
), @admin),

-- ── 7. Security Policy ────────────────────────────────────────────────────────
('policy.security', JSON_OBJECT(
  'title',         'Security Policy',
  'intro',         'SGSITS Indore is committed to maintaining a secure digital environment for all users of its website and online services in compliance with the Information Technology Act, 2000, and applicable cybersecurity guidelines.',
  'lastUpdated',   'April 1, 2026',
  'effectiveDate', 'April 1, 2026',
  'contact',       'itcell@sgsits.ac.in',
  'sections', JSON_ARRAY(
    JSON_OBJECT('title','1. Data Protection',
      'content','SGSITS implements industry-standard security measures including SSL/TLS encryption, secure server configurations, and access controls to protect user data from unauthorized access, disclosure, or misuse.'),
    JSON_OBJECT('title','2. Prohibited Activities',
      'content','Unauthorized access, hacking, denial-of-service attacks, or any attempts to disrupt SGSITS digital services are strictly prohibited and may result in legal action under the Information Technology Act, 2000, and other applicable laws.'),
    JSON_OBJECT('title','3. Responsible Disclosure',
      'content','If you discover a security vulnerability on the SGSITS website (www.sgsits.ac.in), please report it responsibly to itcell@sgsits.ac.in. We request that you do not publicly disclose the issue until it has been addressed.'),
    JSON_OBJECT('title','4. Incident Response',
      'content','SGSITS maintains an incident response procedure to address security breaches promptly. In the event of a significant data breach, affected parties will be notified in accordance with applicable regulations.')
  )
), @admin)

ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

SET foreign_key_checks = 1;

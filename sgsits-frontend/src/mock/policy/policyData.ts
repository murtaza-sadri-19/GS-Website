/**
 * MOCK: Policy pages data
 * Covers: PrivacyPolicy, TermsOfUse, Disclaimer, AccessibilityStatement,
 *         CopyrightPolicy, HyperlinkPolicy, SecurityPolicy, SiteMapPage,
 *         FeedbackPage, HelpPage, WebInfoManager
 */

export interface PolicySection {
  title: string
  content: string
}

// ── Privacy Policy ─────────────────────────────────────────────────────────
export const privacyPolicySections: PolicySection[] = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you fill out forms, contact us, apply for admissions, or otherwise interact with the SGSITS website. This may include your name, email address, phone number, postal address, educational qualifications, and other relevant details.\n\nWe also automatically collect certain technical information when you access our website, including your IP address, browser type and version, operating system, referral URLs, pages visited, and date/time of your visit.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `The information we collect is used primarily to facilitate your interaction with SGSITS services, including processing admission applications, responding to queries, sending important academic notifications, and providing access to student portals and resources.\n\nWe may use contact information to send newsletters, event announcements, and institutional updates. You may opt out of non-essential communications at any time.`,
  },
  {
    title: '3. Data Sharing and Disclosure',
    content: `SGSITS does not sell, trade, or rent your personal information to third parties. We may share your information with authorized government bodies (such as AICTE, UGC, or state regulatory authorities) as required by law or for accreditation purposes.\n\nWe may engage trusted third-party service providers to assist in operating our website and conducting our business, subject to confidentiality agreements.`,
  },
  {
    title: '4. Data Security',
    content: `We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.\n\nHowever, no transmission over the internet or electronic storage method is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.`,
  },
  {
    title: '5. Your Rights',
    content: `You have the right to access, correct, or delete your personal information held by SGSITS. You may also withdraw consent for certain data processing activities. To exercise these rights, please contact our Data Protection Officer at wadmin@sgsits.ac.in.\n\nFor students and applicants, certain information may need to be retained as part of academic records in accordance with institutional regulations.`,
  },
  {
    title: '6. Changes to This Policy',
    content: `SGSITS reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we protect your information.`,
  },
]

// ── Terms of Use ──────────────────────────────────────────────────────────
export const termsOfUseSections: PolicySection[] = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing and using the SGSITS website (www.sgsits.ac.in), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
  },
  {
    title: '2. Use License',
    content: 'Permission is granted to temporarily download one copy of the materials (information or software) on SGSITS website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.',
  },
  {
    title: '3. Disclaimer',
    content: 'The materials on SGSITS website are provided "as is". SGSITS makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.',
  },
  {
    title: '4. Limitations',
    content: 'In no event shall SGSITS or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SGSITS website.',
  },
  {
    title: '5. Revisions and Errata',
    content: 'The materials appearing on SGSITS website could include technical, typographical, or photographic errors. SGSITS does not warrant that any of the materials on its website are accurate, complete or current. SGSITS may make changes to the materials contained on its website at any time without notice.',
  },
]

// ── Disclaimer ────────────────────────────────────────────────────────────
export const disclaimerSections: PolicySection[] = [
  {
    title: 'General Disclaimer',
    content: 'The information contained in this website is for general information purposes only. The information is provided by SGSITS and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website.',
  },
  {
    title: 'External Links',
    content: 'Through this website you are able to link to other websites which are not under the control of SGSITS. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.',
  },
  {
    title: 'Accuracy of Information',
    content: 'Every effort is made to keep the website up and running smoothly. However, SGSITS takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.',
  },
]

// ── Accessibility Statement ───────────────────────────────────────────────
export const accessibilityFeatures: string[] = [
  'Text alternatives for all non-text content (images, icons)',
  'Keyboard navigation support throughout the website',
  'Sufficient color contrast ratios for readability',
  'Resizable text without loss of content or functionality',
  'Skip navigation links for screen reader users',
  'ARIA labels and roles for interactive elements',
  'Consistent navigation structure across all pages',
  'Forms with proper labels and error identification',
]

export const accessibilityCompliance = 'This website endeavors to conform to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as published by the World Wide Web Consortium (W3C).'

export const accessibilityContact = {
  email: 'wadmin@sgsits.ac.in',
  phone: '0731-2582100',
}

// ── Copyright Policy ──────────────────────────────────────────────────────
export const copyrightPolicySections: PolicySection[] = [
  {
    title: 'Copyright Notice',
    content: 'All content on the SGSITS website including text, graphics, photographs, logos, icons, images, audio clips, digital downloads, data compilations, and software is the property of Shri G. S. Institute of Technology & Science (SGSITS), Indore or its content suppliers and is protected by the Indian Copyright Act, 1957 and international copyright laws.',
  },
  {
    title: 'Permitted Use',
    content: 'You may view, download, and print content from this website solely for your personal, non-commercial use, provided that you do not remove any copyright or proprietary notices. You may not reproduce, distribute, transmit, display, perform, publish, license, or create derivative works from any content without the express written permission of SGSITS.',
  },
  {
    title: 'Trademarks',
    content: 'The SGSITS name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of SGSITS. You must not use such marks without the prior written permission of SGSITS.',
  },
]

// ── Hyperlink Policy ──────────────────────────────────────────────────────
export const hyperlinkPolicySections: PolicySection[] = [
  {
    title: 'Links to External Sites',
    content: 'This website may contain hyperlinks to external websites operated by third parties. These links are provided for your convenience and reference only. SGSITS does not endorse the content of any external websites nor does it accept responsibility for the content, privacy practices, or functionality of these external sites.',
  },
  {
    title: 'Links to SGSITS Website',
    content: 'You may link to our homepage, provided you do so in a way that is fair and legal and does not damage our reputation or take advantage of it. You must not establish a link that suggests any form of association, approval or endorsement on our part where none exists.',
  },
  {
    title: 'Broken Links',
    content: 'SGSITS makes every effort to ensure that all hyperlinks on this website are functional. However, we cannot guarantee that all links will always be available. If you encounter a broken link, please report it to wadmin@sgsits.ac.in.',
  },
]

// ── Security Policy ───────────────────────────────────────────────────────
export const securityMeasures: string[] = [
  'SSL/TLS encryption for all data transmission',
  'Regular security audits and vulnerability assessments',
  'Firewall protection and intrusion detection systems',
  'Access controls and authentication mechanisms',
  'Regular data backup procedures',
  'Staff training on information security practices',
  'Incident response procedures for security breaches',
]

// ── Site Map ──────────────────────────────────────────────────────────────
export interface SiteMapSection {
  title: string
  links: { label: string; to: string }[]
}

export const siteMapSections: SiteMapSection[] = [
  {
    title: 'About',
    links: [
      { label: 'About the Institute', to: '/about/institute' },
      { label: 'Vision & Mission', to: '/about/vision-mission' },
      { label: "Director's Message", to: '/about/director-message' },
      { label: 'Governing Body', to: '/about/governing-body' },
      { label: 'Academic Council', to: '/about/academic-council' },
      { label: 'Administration', to: '/about/administration' },
      { label: 'Committees', to: '/about/committees' },
      { label: 'Accreditation', to: '/about/accreditation' },
      { label: 'Infrastructure', to: '/about/infrastructure' },
      { label: 'IQAC', to: '/about/iqac' },
      { label: 'Telephone Directory', to: '/about/telephone-directory' },
    ],
  },
  {
    title: 'Academics',
    links: [
      { label: 'UG Courses', to: '/academics/ug-courses' },
      { label: 'PG Courses', to: '/academics/pg-courses' },
      { label: 'PhD Courses', to: '/academics/phd-courses' },
      { label: 'Academic Calendar', to: '/academics/academic-calendar' },
      { label: 'Ordinances', to: '/academics/ordinances' },
      { label: 'Code of Conduct', to: '/academics/code-of-conduct' },
    ],
  },
  {
    title: 'Admissions',
    links: [
      { label: 'UG Admission', to: '/admission/ug' },
      { label: 'PG Admission', to: '/admission/pg' },
      { label: 'PhD Admission', to: '/admission/phd' },
      { label: 'Prospectus', to: '/admission/prospectus' },
    ],
  },
  {
    title: 'Placements',
    links: [
      { label: 'T&P Cell', to: '/placement/tnp-cell' },
      { label: 'Placement Record', to: '/placement/record' },
      { label: 'Leading Companies', to: '/placement/companies' },
      { label: 'Contact Placement', to: '/placement/contact' },
    ],
  },
]

// ── Help Page / FAQ ───────────────────────────────────────────────────────
export interface FAQItem {
  question: string
  answer: string
}

export const helpFAQs: FAQItem[] = [
  { question: 'How do I apply for UG admission at SGSITS?', answer: 'UG admissions are through JEE Main score and MPDTE counselling. Visit the Admissions section for detailed process.' },
  { question: 'Where can I find exam results?', answer: 'Exam results are published on the official Results portal. Visit Academics > Examinations & Results for links.' },
  { question: 'How do I contact a specific department?', answer: 'Department contact numbers are available in the Telephone Directory under About > Telephone Directory.' },
  { question: 'How can I apply for hostel accommodation?', answer: 'Hostel allotment is done during admission. Contact the Hostel Office at hostel@sgsits.ac.in for queries.' },
  { question: 'Where can I find information about scholarships?', answer: 'Visit Students > Scholarships for information on government and institute scholarship schemes.' },
  { question: 'How do I access the student portal?', answer: 'Access the student portal from the Login page using your enrollment number and SGSITS-provided password.' },
]

// ── Feedback Page ─────────────────────────────────────────────────────────
export const feedbackContact = {
  email: 'feedback@sgsits.ac.in',
  phone: '0731-2582100',
  address: '23, Park Road, Indore — 452003, Madhya Pradesh',
}

export const feedbackCategories = ['Website Feedback', 'Academic Feedback', 'Facility Feedback', 'Administrative Feedback', 'Other'] as const

// ── Web Info Manager ──────────────────────────────────────────────────────
export const webInfoManager = {
  name: 'Dr. K.K. Sharma',
  designation: 'Web Information Manager',
  dept: 'Department of Information Technology',
  email: 'wadmin@sgsits.ac.in',
  phone: '0731-2582403',
  responsibilities: [
    'Maintaining accuracy and currency of website content',
    'Coordinating with departments for content updates',
    'Ensuring compliance with NIC web guidelines',
    'Managing website accessibility and usability',
    'Handling feedback and complaints related to website content',
  ],
  lastUpdated: 'May 2026',
}

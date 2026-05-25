/**
 * Policy Service — CMS-backed content for policy pages
 *
 * Backend: GET/PUT /api/v1/settings/cms/policy.{key}
 *
 * Policy keys:
 *   policy.privacy         — Privacy Policy
 *   policy.terms           — Terms of Use
 *   policy.disclaimer      — Disclaimer
 *   policy.accessibility   — Accessibility Statement
 *   policy.copyright       — Copyright Policy
 *   policy.hyperlink       — Hyperlink Policy
 *
 * Each section is stored as a JSON blob with:
 *   { title, intro, lastUpdated, effectiveDate, sections: [{ title, content }][], contact }
 *
 * Falls back to hardcoded defaults when backend unreachable.
 */

import apiClient from '../api/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PolicySection {
  title: string
  content: string
}

export interface PolicyContent {
  title: string
  intro: string
  lastUpdated: string
  effectiveDate: string
  sections: PolicySection[]
  contact?: string
}

// ─── Defaults (used as fallback) ─────────────────────────────────────────────

const defaults: Record<string, PolicyContent> = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy describes how Shri G. S. Institute of Technology & Science ("SGSITS") collects, uses, and protects information obtained through the official SGSITS website and affiliated digital services.',
    lastUpdated: 'January 15, 2025',
    effectiveDate: 'February 1, 2025',
    sections: [
      {
        title: '1. Information We Collect',
        content:
          'We collect information you provide directly to us, such as when you fill out forms, contact us, apply for admissions, or otherwise interact with the SGSITS website. This may include your name, email address, phone number, postal address, educational qualifications, and other relevant details.\n\nWe also automatically collect certain technical information when you access our website, including your IP address, browser type and version, operating system, referral URLs, pages visited, and date/time of your visit.',
      },
      {
        title: '2. How We Use Your Information',
        content:
          'The information we collect is used primarily to facilitate your interaction with SGSITS services, including processing admission applications, responding to queries, sending important academic notifications, and providing access to student portals and resources.\n\nWe may use contact information to send newsletters, event announcements, and institutional updates. You may opt out of non-essential communications at any time.',
      },
      {
        title: '3. Data Sharing and Disclosure',
        content:
          'SGSITS does not sell, trade, or rent your personal information to third parties. We may share your information with authorized government bodies (such as AICTE, UGC, or state regulatory authorities) as required by law or for accreditation purposes.',
      },
      {
        title: '4. Cookies and Tracking Technologies',
        content:
          'Our website uses cookies to enhance user experience, remember preferences, and gather analytical data. Essential cookies are necessary for basic site functionality and cannot be disabled. Analytics cookies help us understand how visitors use our site.',
      },
      {
        title: '5. Data Security',
        content:
          'SGSITS implements appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction. Our website uses industry-standard SSL/TLS encryption for data transmission.',
      },
      {
        title: '6. Your Rights and Contact',
        content:
          'You have the right to access, correct, or request deletion of your personal data held by SGSITS. To exercise these rights, or to raise any privacy-related concern, please contact our Data Protection Officer at privacy@sgsits.ac.in.',
      },
    ],
    contact: 'privacy@sgsits.ac.in',
  },

  terms: {
    title: 'Terms of Use',
    intro:
      'By accessing and using the SGSITS website, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please discontinue use of this website immediately.',
    lastUpdated: 'January 15, 2025',
    effectiveDate: 'February 1, 2025',
    sections: [
      { title: '1. Acceptance of Terms', content: 'Use of this website constitutes acceptance of these Terms of Use and all applicable laws and regulations. SGSITS reserves the right to modify these terms at any time without prior notice.' },
      { title: '2. Permitted Use', content: 'This website is provided for informational and academic purposes related to SGSITS. You may not use this website for any unlawful purpose or in any manner that could damage, disable, or impair the website.' },
      { title: '3. Intellectual Property', content: 'All content on this website, including text, graphics, logos, images, and software, is the property of SGSITS and is protected by applicable intellectual property laws.' },
      { title: '4. Disclaimer of Warranties', content: 'This website is provided on an "as is" and "as available" basis without any representations or warranties, express or implied, of any kind.' },
      { title: '5. Limitation of Liability', content: 'SGSITS shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use this website.' },
      { title: '6. Governing Law', content: 'These Terms of Use shall be governed by and construed in accordance with the laws of India, and you agree to submit to the exclusive jurisdiction of the courts in Indore, Madhya Pradesh.' },
    ],
    contact: 'itcell@sgsits.ac.in',
  },

  disclaimer: {
    title: 'Disclaimer',
    intro:
      'The information provided on the SGSITS website is for general informational purposes only. While we strive to keep the information up-to-date and accurate, we make no representations or warranties of any kind.',
    lastUpdated: 'January 15, 2025',
    effectiveDate: 'February 1, 2025',
    sections: [
      { title: '1. Accuracy of Information', content: 'SGSITS makes every effort to ensure that the information published on this website is accurate and up-to-date. However, we do not guarantee the completeness or accuracy of any information and disclaim liability for errors or omissions.' },
      { title: '2. External Links', content: 'Our website may contain links to external websites. SGSITS is not responsible for the content, privacy practices, or availability of these external sites.' },
      { title: '3. No Professional Advice', content: 'The information on this website does not constitute professional, legal, financial, or academic advice. For specific guidance, please contact the relevant SGSITS department directly.' },
      { title: '4. Changes to Content', content: 'SGSITS reserves the right to change, update, or delete any information on this website at any time without prior notice.' },
    ],
    contact: 'registrar@sgsits.ac.in',
  },

  accessibility: {
    title: 'Accessibility Statement',
    intro:
      'SGSITS is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.',
    lastUpdated: 'January 15, 2025',
    effectiveDate: 'February 1, 2025',
    sections: [
      { title: '1. Conformance Status', content: 'The SGSITS website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We are actively working towards full conformance.' },
      { title: '2. Accessibility Features', content: 'This website includes features such as keyboard navigation support, text size controls, screen reader compatibility, high contrast mode, and descriptive alt text for images.' },
      { title: '3. Known Limitations', content: 'Some older PDF documents may not be fully accessible. We are in the process of converting these to accessible formats. Please contact us if you need an accessible version of any document.' },
      { title: '4. Feedback', content: 'We welcome feedback on the accessibility of the SGSITS website. If you encounter any barriers, please contact our IT Cell.' },
    ],
    contact: 'itcell@sgsits.ac.in',
  },

  copyright: {
    title: 'Copyright Policy',
    intro:
      'All content on the SGSITS website is protected by copyright law. Unauthorized reproduction or distribution of any content from this website is strictly prohibited.',
    lastUpdated: 'January 15, 2025',
    effectiveDate: 'February 1, 2025',
    sections: [
      { title: '1. Copyright Ownership', content: 'All materials on this website, including text, photographs, graphics, logos, and software, are the intellectual property of SGSITS or its respective owners and are protected under the Copyright Act, 1957.' },
      { title: '2. Permitted Use', content: 'You may view, download, and print content from this website for your personal, non-commercial use only, provided you do not modify the content and retain all copyright and other proprietary notices.' },
      { title: '3. Prohibited Use', content: 'You may not reproduce, republish, distribute, transmit, display, or create derivative works from any content on this website for commercial purposes without prior written permission from SGSITS.' },
      { title: '4. Third-Party Content', content: 'Some content on this website may be owned by third parties. SGSITS acknowledges all such third-party intellectual property rights.' },
    ],
    contact: 'registrar@sgsits.ac.in',
  },

  hyperlink: {
    title: 'Hyperlink Policy',
    intro:
      'This policy governs the use of links to and from the SGSITS website. It applies to all external websites that link to the SGSITS website and to all external websites that the SGSITS website links to.',
    lastUpdated: 'January 15, 2025',
    effectiveDate: 'February 1, 2025',
    sections: [
      { title: '1. Linking to SGSITS Website', content: 'You may link to the SGSITS website provided the link does not imply any endorsement, association, or affiliation with SGSITS unless explicitly authorized. The link must not present the SGSITS website in a misleading manner.' },
      { title: '2. Links from SGSITS Website', content: 'External links on the SGSITS website are provided for the convenience of users. SGSITS does not endorse, recommend, or take responsibility for the content of externally linked websites.' },
      { title: '3. Framing', content: 'You may not frame, embed, or otherwise display the SGSITS website within another website without prior written permission.' },
      { title: '4. Reporting Broken Links', content: 'If you encounter a broken or incorrect link on the SGSITS website, please report it to our IT Cell so we can promptly correct it.' },
    ],
    contact: 'itcell@sgsits.ac.in',
  },
}

// ─── Service functions ────────────────────────────────────────────────────────

export const getPolicyContent = async (key: string): Promise<PolicyContent> => {
  try {
    const res = await apiClient.get(`/v1/settings/cms/policy.${key}`)
    const data = res.data?.data
    if (data && typeof data === 'object' && data.title) {
      return data as PolicyContent
    }
  } catch { /* fall through to default */ }
  return defaults[key] ?? {
    title: 'Policy Page',
    intro: '',
    lastUpdated: '',
    effectiveDate: '',
    sections: [],
  }
}

export const savePolicyContent = async (key: string, content: PolicyContent): Promise<void> => {
  await apiClient.put(`/v1/settings/cms/policy.${key}`, content)
}

export const getAllPolicyKeys = (): string[] =>
  Object.keys(defaults)

export const getPolicyDefault = (key: string): PolicyContent =>
  defaults[key] ?? { title: 'Policy Page', intro: '', lastUpdated: '', effectiveDate: '', sections: [] }

export const policyService = {
  getPolicyContent,
  savePolicyContent,
  getAllPolicyKeys,
  getPolicyDefault,
}

export default policyService

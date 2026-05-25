import type { HomeFaqsConfig } from './types'

export const defaultHomeFaqsConfig: HomeFaqsConfig = {
  heading: 'FAQs',
  subLabel: 'Frequently Asked Questions',
  viewAllLink: '/policy/help',
  items: [
    {
      id: 'faq1',
      question: 'What are the eligibility criteria for B.Tech admissions?',
      answer: 'Admissions are via JEE Main counselling (MP State). Candidates must have passed 10+2 with PCM and a minimum of 45% marks (40% for SC/ST).',
      contact: null,
      defaultOpen: false,
    },
    {
      id: 'faq2',
      question: 'Whom to contact for Postgraduate admissions?',
      answer: null,
      contact: { name: 'Office of Academics (PG)', phone: '+91-731-2431234', email: 'pg@sgsits.ac.in' },
      defaultOpen: true,
    },
    {
      id: 'faq3',
      question: 'Whom to contact for Undergraduate admissions?',
      answer: 'Contact the Admission Cell at admissions@sgsits.ac.in or call +91-731-2582100.',
      contact: null,
      defaultOpen: false,
    },
    {
      id: 'faq4',
      question: 'Whom to contact for queries related to GATE?',
      answer: 'PG Admission queries related to GATE scores are handled by the PG Admission Cell. Email pg@sgsits.ac.in.',
      contact: null,
      defaultOpen: false,
    },
    {
      id: 'faq5',
      question: 'How to pay fees online?',
      answer: 'Fees can be paid via the institute ERP portal using net banking, debit/credit card or UPI. Visit the Student Login portal for instructions.',
      contact: null,
      defaultOpen: false,
    },
    {
      id: 'faq6',
      question: 'Whom to contact for Faculty Recruitment?',
      answer: "Faculty recruitment queries should be addressed to the Registrar's office at registrar@sgsits.ac.in.",
      contact: null,
      defaultOpen: false,
    },
  ],
  enabled: true,
  order: 8,
}

export default defaultHomeFaqsConfig

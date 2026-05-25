/**
 * MOCK: Students Pages Data
 * Replace with: GET /api/students/*
 *
 * Consumed ONLY through src/services/studentsService.ts
 */

// ─── Student Activities & Clubs ───────────────────────────────────────────────

export interface StudentActivity {
  title: string
  description: string
}

export interface ActivitiesData {
  intro: string
  activities: StudentActivity[]
}

export const mockActivities: ActivitiesData = {
  intro: 'SGSITS provides a vibrant platform for student activities beyond academics. Various clubs and organizations operate under the Dean Student Welfare office.',
  activities: [
    { title: 'Rhythm — Annual Cultural Festival',   description: 'A 3-day extravaganza featuring music, dance, drama, fashion show, literary events, and guest performances by renowned artists.' },
    { title: 'Technosearch — Annual Technical Festival', description: 'Inter-college technical competition with events like robotics, coding contests, paper presentations, and project exhibitions.' },
    { title: 'IEEE Student Branch',                 description: 'Active IEEE student branch organizing workshops, hackathons, and guest lectures on emerging technologies.' },
    { title: 'Coding Club',                         description: 'Weekly coding sessions, competitive programming practice, and participation in ICPC, CodeChef, and HackerRank contests.' },
    { title: 'Robotics Club',                       description: 'Hands-on robotics projects, participation in national-level robotics competitions like Robocon and Yantra.' },
    { title: 'Literary & Debate Society',           description: 'Regular debates, elocution competitions, quiz contests, and publication of the institute magazine.' },
    { title: 'Photography Club',                    description: 'Campus photography, documentary projects, and participation in inter-college photography competitions.' },
    { title: 'Music & Drama Society',               description: 'Classical and western music practice, drama rehearsals, and performances at cultural events.' },
  ],
}

// ─── NCC ──────────────────────────────────────────────────────────────────────

export interface NCCData {
  about: string
  unitDetails: string
  officerName: string
  officerContact: string
  enrolledCadets: number
  activities: string[]
  achievements: string[]
}

export const mockNCC: NCCData = {
  about: 'The National Cadet Corps (NCC) unit at SGSITS has been instilling discipline, patriotism, and leadership values among students since the institution\'s founding. Our Army wing trains cadets in a range of military skills and community service activities.',
  unitDetails: 'Army Wing — 6 Madhya Pradesh Battalion NCC, Indore',
  officerName: 'Lt. Col. (Retd.) R.K. Singh (NCC Officer)',
  officerContact: 'ncc@sgsits.ac.in',
  enrolledCadets: 150,
  activities: [
    'Annual Training Camps (ATC)',
    'Combined Annual Training Camps (CATC)',
    'Republic Day & Independence Day Parades',
    'Social Service & Community Outreach Programs',
    'Trekking & Adventure Activities',
    'Blood Donation Camps',
    'Disaster Relief Training',
    'Republic Day Camp (New Delhi) selection',
  ],
  achievements: [
    'NCC Day Parade, Indore — Best Cadet Award 2025',
    'State-level shooting competition — 2nd place 2024',
    'Republic Day Camp selection — 3 cadets (2024)',
    'Best NCC Unit Award, Madhya Pradesh — 2023',
  ],
}

// ─── NSS ──────────────────────────────────────────────────────────────────────

export interface NSSData {
  about: string
  unitDetails: string
  programOfficerName: string
  programOfficerContact: string
  enrolledVolunteers: number
  activities: string[]
  achievements: string[]
}

export const mockNSS: NSSData = {
  about: 'The National Service Scheme (NSS) unit at SGSITS is committed to community development, social awareness, and nation building. Our volunteers regularly engage in village adoption programs, health drives, and environmental activities.',
  unitDetails: 'NSS Unit — SGSITS Indore (2 Units, 200 volunteers)',
  programOfficerName: 'Dr. P.K. Sharma (NSS Program Officer)',
  programOfficerContact: 'nss@sgsits.ac.in',
  enrolledVolunteers: 200,
  activities: [
    'Village Adoption and Rural Development Programs',
    'Blood Donation Camps',
    'Environmental Awareness (Tree Plantation, Swachh Bharat)',
    'Health & Hygiene Awareness Campaigns',
    'Literacy Programs and Adult Education',
    'Disaster Relief Activities',
    '7-day Special Camp in Adopted Village',
    'Republic Day & Independence Day Celebrations',
  ],
  achievements: [
    'Best NSS Unit — RGPV Bhopal 2025',
    'National Level NSS Award nomination — 2024',
    '500 units of blood donated annually',
    'Planted 2000+ trees across Indore 2023-24',
  ],
}

// ─── Government Scholarships ──────────────────────────────────────────────────

export interface Scholarship {
  title: string
  description: string
  eligibility?: string
  portalUrl?: string
}

export interface ScholarshipGovtData {
  intro: string
  scholarships: Scholarship[]
  contactEmail: string
  contactPhone: string
}

export const mockScholarshipGovt: ScholarshipGovtData = {
  intro: 'Various government scholarship schemes are available for eligible students of SGSITS. The scholarship cell assists students with application process and documentation.',
  scholarships: [
    { title: 'Post-Matric Scholarship (SC/ST)',       description: 'For SC/ST students. Covers tuition fee, maintenance allowance, and book grant. Apply through the State Scholarship Portal.',          eligibility: 'SC/ST students',                     portalUrl: 'https://scholarshipportal.mp.nic.in' },
    { title: 'Post-Matric Scholarship (OBC)',         description: 'For OBC students with family income below ₹8 lakh per annum. Partial fee waiver and maintenance allowance.',                         eligibility: 'OBC students, income < ₹8 LPA',       portalUrl: 'https://scholarshipportal.mp.nic.in' },
    { title: 'National Scholarship Portal (NSP)',     description: 'Central government scholarships through the National Scholarship Portal. Multiple schemes based on category, income, and merit.',    eligibility: 'As per individual scheme criteria',   portalUrl: 'https://scholarships.gov.in' },
    { title: 'State Merit Scholarship',              description: 'For meritorious students from MP who scored above 85% in board examinations. Merit-based monthly stipend.',                           eligibility: '>85% in 12th from MP Board' },
    { title: 'Gaon Ki Beti Yojana',                  description: 'For girls from rural areas of Madhya Pradesh who secure more than 60% marks in 12th grade examination.',                              eligibility: 'Girls from rural MP, >60% in 12th' },
    { title: 'AICTE Pragati Scholarship',            description: 'For girl students in AICTE-approved technical institutions. Two scholarships per department per year.',                               eligibility: 'Girl students, family income < ₹8 LPA', portalUrl: 'https://www.aicte-india.org' },
  ],
  contactEmail: 'scholarships@sgsits.ac.in',
  contactPhone: '0731-2582104',
}

// ─── Institute Scholarships ───────────────────────────────────────────────────

export interface InstituteScholarship {
  title: string
  description: string
  criteria: string
  amount: string
}

export interface ScholarshipInstituteData {
  intro: string
  scholarships: InstituteScholarship[]
}

export const mockScholarshipInstitute: ScholarshipInstituteData = {
  intro: 'SGSITS provides its own scholarship and financial assistance schemes to deserving students, funded by the institute and its alumni.',
  scholarships: [
    { title: 'Director\'s Merit Scholarship',   description: 'Awarded to the university toppers of each department in the annual examination.',    criteria: 'Rank 1 in university result',                     amount: '₹10,000 per year' },
    { title: 'Alumni Excellence Scholarship',   description: 'Funded by SGSITS Alumni Association for students with outstanding overall performance.', criteria: 'CGPA ≥ 9.0, 2nd year onwards',                 amount: '₹8,000 per year'  },
    { title: 'Sports Achievement Award',        description: 'For students representing the institute at national/international sports events.',    criteria: 'State/national level sports achievement',         amount: '₹5,000 one-time'  },
    { title: 'Financial Assistance Scheme',     description: 'Emergency financial assistance for students in genuine financial hardship.',          criteria: 'Verified financial need',                         amount: 'Up to ₹15,000'    },
    { title: 'Research Incentive Award',        description: 'For UG/PG students who publish papers in peer-reviewed journals or conferences.',     criteria: 'Published paper in indexed journal/conference',   amount: '₹3,000–₹10,000'  },
  ],
}

// ─── SSS (Student Support Services) ──────────────────────────────────────────

export interface SSSService {
  title: string
  description: string
}

export interface SSSData {
  about: string
  services: SSSService[]
  contactEmail: string
  contactPhone: string
}

export const mockSSS: SSSData = {
  about: 'The Student Support Services (SSS) cell at SGSITS provides holistic support to students covering academic, psychological, financial, and career guidance needs.',
  services: [
    { title: 'Academic Counselling',        description: 'Guidance from faculty mentors for students struggling with academic performance, course selection, and career pathways.' },
    { title: 'Psychological Counselling',   description: 'Confidential counselling services with trained psychologists for stress, anxiety, and mental health support.' },
    { title: 'Anti-Ragging Cell',           description: 'Strict anti-ragging policy enforcement with a dedicated helpline and grievance redressal committee.' },
    { title: 'Career Guidance Cell',        description: 'Workshops, aptitude tests, and personal guidance sessions on career planning, competitive exams, and higher education.' },
    { title: 'Grievance Redressal',         description: 'Transparent system for students to raise and resolve grievances related to academics, facilities, and administration.' },
    { title: 'SC/ST Cell',                  description: 'Special support cell for SC/ST students providing guidance on scholarships, academic support, and career opportunities.' },
  ],
  contactEmail: 'studentsupport@sgsits.ac.in',
  contactPhone: '0731-2582104',
}

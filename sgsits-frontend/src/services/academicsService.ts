/**
 * Academics Service — wired to backend CMS sections
 *
 * Backend: GET/PUT /api/v1/settings/cms/<key>
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export type UGCoursesData         = Record<string, any>
export type PGCoursesData         = Record<string, any>
export type PhDCoursesData        = Record<string, any>
export type PTDCCourse            = Record<string, any>
export type AcademicCalendarEvent = Record<string, any>
export type OnlineCourseLink      = Record<string, any>

export interface AcademicsLandingCard {
  iconName: string
  title: string
  description: string
  path: string
  badge?: string
}

export interface AcademicsLandingMeta {
  sectionLabel?: string
  heroTitle?: string
  heroSubtitle?: string
}

export interface FirstYearChecklistItem { item: string; when: string }
export interface FirstYearSubject       { code: string; subject: string; credits: number }
export interface FirstYearContact       { label: string; phone?: string; email?: string; note?: string }

export interface FirstYearData {
  welcomeText?: string
  checklist: FirstYearChecklistItem[]
  subjects: FirstYearSubject[]
  contacts: FirstYearContact[]
}

export interface ExamScheduleEntry { type: string; months: string; note?: string }
export interface ExamResultsData {
  reEvaluationNote: string
  schedules: ExamScheduleEntry[]
}

const get = async <T>(key: string): Promise<T> =>
  ((await getCmsSection<T>(key)) ?? {}) as T

const getArr = async <T>(key: string): Promise<T[]> => {
  const data = await getCmsSection<T[]>(key)
  return Array.isArray(data) ? data : []
}

export const getUGCourses        = (): Promise<UGCoursesData>         => get('academics.ug_courses')
export const getPGCourses        = (): Promise<PGCoursesData>         => get('academics.pg_courses')
export const getPhDCourses       = (): Promise<PhDCoursesData>        => get('academics.phd_courses')
export const getPTDCCourses      = (): Promise<PTDCCourse[]>          => getArr('academics.ptdc_courses')
export const getAcademicCalendar = (): Promise<AcademicCalendarEvent[]> => getArr('academics.academic_calendar')
export const getOnlineCourses    = (): Promise<OnlineCourseLink[]>    => getArr('academics.online_courses')

export const getAcademicsLandingCards = (): Promise<AcademicsLandingCard[]> => getArr('academics.landing_cards')
export const getAcademicsLandingMeta  = async (): Promise<AcademicsLandingMeta> => {
  const data = await getCmsSection<AcademicsLandingMeta>('academics.landing_meta')
  return data ?? {}
}
export const saveAcademicsLandingCards = (data: AcademicsLandingCard[]) => saveCmsSection('academics.landing_cards', data)
export const saveAcademicsLandingMeta  = (data: AcademicsLandingMeta)  => saveCmsSection('academics.landing_meta', data)

// ─── Ordinances ───────────────────────────────────────────────────────────────

export interface OrdinancesGradeRow { grade: string; points: number; range: string; desc: string }
export interface OrdinancesDoc      { title: string; size: string; year: string; url?: string }
export interface OrdinancesData {
  intro?: string
  attendanceRules?: string[]
  gradeTable?: OrdinancesGradeRow[]
  examRules?: string[]
  integrityRules?: string[]
  documents?: OrdinancesDoc[]
}

export const getOrdinances  = (): Promise<OrdinancesData> => get('academics.ordinances')
export const saveOrdinances = (d: OrdinancesData)         => saveCmsSection('academics.ordinances', d)

// ─── Plagiarism Policy ────────────────────────────────────────────────────────

export interface PlagiarismData {
  intro?: string
  paragraphs?: string[]
}

export const getPlagiarism  = (): Promise<PlagiarismData> => get('academics.plagiarism')
export const savePlagiarism = (d: PlagiarismData)         => saveCmsSection('academics.plagiarism', d)

// ─── Code of Ethics ───────────────────────────────────────────────────────────

export interface CodeOfEthicsGuideline { title: string; desc: string }
export interface CodeOfEthicsData {
  intro?: string
  antiRaggingAlert?: string
  guidelines?: CodeOfEthicsGuideline[]
  pdfUrl?: string
}

export const getCodeOfEthics  = (): Promise<CodeOfEthicsData> => get('academics.code_of_ethics')
export const saveCodeOfEthics = (d: CodeOfEthicsData)         => saveCmsSection('academics.code_of_ethics', d)

// ─── OBE & NEP 2020 ──────────────────────────────────────────────────────────

export interface ObeNepData {
  intro?: string
  paragraphs?: string[]
}

export const getObeNep  = (): Promise<ObeNepData> => get('academics.obe_nep')
export const saveObeNep = (d: ObeNepData)         => saveCmsSection('academics.obe_nep', d)

export const getFirstYearInfo = async (): Promise<FirstYearData> => {
  const data = await getCmsSection<FirstYearData>('academic.first_year')
  return data ?? firstYearDefault
}

export const getExamResults = async (): Promise<ExamResultsData> => {
  const data = await getCmsSection<ExamResultsData>('academic.exam_results')
  return data ?? examResultsDefault
}

export const saveUGCourses        = (data: UGCoursesData)         => saveCmsSection('academics.ug_courses', data)
export const savePGCourses        = (data: PGCoursesData)         => saveCmsSection('academics.pg_courses', data)
export const savePhDCourses       = (data: PhDCoursesData)        => saveCmsSection('academics.phd_courses', data)
export const savePTDCCourses      = (data: PTDCCourse[])          => saveCmsSection('academics.ptdc_courses', data)
export const saveAcademicCalendar = (data: AcademicCalendarEvent[]) => saveCmsSection('academics.academic_calendar', data)
export const saveOnlineCourses    = (data: OnlineCourseLink[])    => saveCmsSection('academics.online_courses', data)
export const saveFirstYearInfo    = (data: FirstYearData)         => saveCmsSection('academic.first_year', data)
export const saveExamResults      = (data: ExamResultsData)       => saveCmsSection('academic.exam_results', data)

export const ugCoursesDefault: UGCoursesData = {
  eligibility: '10+2 with Physics, Chemistry, Mathematics (minimum 45% marks)',
  admissionProcess: 'Through JEE Main score + MP DTE Online Counseling',
  feeNote: 'Approx. ₹45,000 – ₹55,000 per year (subject to revision)',
}

export const pgCoursesDefault: PGCoursesData = {
  eligibilityItems: [
    'M.Tech: Relevant B.E./B.Tech degree with GATE score',
    'M.Pharm: B.Pharm with GPAT score',
    'MBA: Any graduate with MAT/CAT score ≥60 percentile',
    'MCA: B.Sc. with Mathematics, NIMCET / MP PET',
    'Minimum 55% marks in qualifying degree (50% for SC/ST)',
  ],
  feeRows: [
    { label: 'M.Tech Annual Fee',      value: '₹30,000 – ₹40,000',    accent: false },
    { label: 'MBA Annual Fee',         value: '₹50,000 – ₹70,000',    accent: false },
    { label: 'GATE Scholars (Full-time)', value: '₹12,400/month stipend', accent: true },
  ],
  feeNote: '*Fee subject to SFRC revision',
  ccmtPortalUrl:   'https://ccmt.admissions.nic.in',
  ccmtPortalTitle: 'CCMT — Centralized Counselling for M.Tech',
  ccmtPortalDesc:  'M.Tech admissions at SGSITS are through CCMT portal',
}
export const phdCoursesDefault: PhDCoursesData = {
  eligibilityPoints: [
    'M.Tech/ME with 55% marks (50% for SC/ST)',
    'M.Sc./MCA/MBA with 55% for respective departments',
    'GATE/NET qualified candidates may be exempt from written test',
    'Full-time and Part-time (sponsored) PhD options available',
    'Industry professionals with 5+ years experience eligible for Part-time',
  ],
  fellowshipRows: [
    { label: 'GATE/NET Scholars (Full-time)', value: '₹12,400/month', accent: true },
    { label: 'Sponsored/Industry Scholars',   value: 'Employer Funded' },
    { label: 'DST/SERB Project Scholars',     value: 'As per project grant' },
    { label: 'SGSITS also offers fee waivers for sponsored students', value: '', note: true },
  ],
}
export const ptdcCoursesDefault: PTDCCourse[] = []
export const academicCalendarDefault: AcademicCalendarEvent[] = []
export const onlineCoursesDefault: OnlineCourseLink[] = []

export const academicsLandingCardsDefault: AcademicsLandingCard[] = [
  { iconName: 'CalendarDays', title: 'Academic Calendar',    description: 'Semester dates, holidays, and important academic events.',                       path: '/academics/calendar'          },
  { iconName: 'BookOpen',     title: 'UG Courses',            description: 'Undergraduate engineering programmes across all departments.',                   path: '/academics/courses/ug'        },
  { iconName: 'GraduationCap',title: 'PG Courses',            description: 'M.E. / M.Tech / MBA postgraduate programmes and eligibility.',                  path: '/academics/courses/pg'        },
  { iconName: 'FlaskConical', title: 'Ph.D. Programs',        description: 'Doctoral research programmes, supervisors, and admission procedures.',          path: '/academics/courses/phd'       },
  { iconName: 'BookMarked',   title: 'PTDC Courses',          description: 'Part-Time Diploma Courses for working professionals.',                         path: '/academics/courses/ptdc'      },
  { iconName: 'Monitor',      title: 'Online Courses (MOOC)', description: 'NPTEL and MOOC courses integrated into the academic curriculum.',              path: '/academics/courses/online'    },
  { iconName: 'Star',         title: 'First Year Info',       description: 'Orientation, hostel, timetables and essentials for new students.',             path: '/academics/first-year',  badge: 'New Students' },
  { iconName: 'FileText',     title: 'Exam & Results',        description: 'Examination schedules, result notifications and academic records.',            path: '/academics/exam-results'      },
  { iconName: 'Scale',        title: 'Ordinances',            description: 'Official academic ordinances governing examinations and degrees.',             path: '/academics/ordinances'        },
  { iconName: 'ShieldCheck',  title: 'Plagiarism Policy',     description: 'Anti-plagiarism policy and consequences of academic misconduct.',              path: '/academics/plagiarism-policy' },
  { iconName: 'Scroll',       title: 'Code of Ethics',        description: 'Code of conduct and professional ethics for students and staff.',              path: '/academics/code-of-conduct'   },
  { iconName: 'LayoutGrid',   title: 'OBE & NEP 2020',       description: 'Outcome-Based Education and National Education Policy 2020 implementation.',  path: '/academics/obe-nep-2020'      },
]

export const academicsLandingMetaDefault: AcademicsLandingMeta = {
  sectionLabel: 'Academics',
  heroTitle: 'Academics at SGSITS',
  heroSubtitle: 'Explore academic programmes, calendars, examination policies, ordinances, and educational frameworks.',
}

export const firstYearDefault: FirstYearData = {
  welcomeText: 'Congratulations on your admission to Shri G. S. Institute of Technology & Science.',
  checklist: [
    { item: 'Institute Registration & Fee Payment',          when: 'Day 1–2' },
    { item: 'Student Identity Card collection',               when: 'Day 2' },
    { item: 'Library Card enrollment',                        when: 'Day 3' },
    { item: 'Hostel allotment (if applicable)',               when: 'Day 1–3' },
    { item: 'Anti-ragging affidavit submission (mandatory)',  when: 'Day 1' },
    { item: 'Faculty mentor assignment & first meeting',     when: 'Day 4–5' },
    { item: 'Orientation program attendance',                 when: 'Day 1–3' },
    { item: 'Computer Center registration for email ID',     when: 'Week 1' },
  ],
  subjects: [
    { code: 'MA-101', subject: 'Engineering Mathematics – I',             credits: 4 },
    { code: 'PH-101', subject: 'Engineering Physics',                     credits: 4 },
    { code: 'CH-101', subject: 'Engineering Chemistry',                   credits: 4 },
    { code: 'CS-101', subject: 'Programming Fundamentals (C Language)',   credits: 3 },
    { code: 'ME-101', subject: 'Engineering Graphics & Drawing',          credits: 3 },
    { code: 'BE-101', subject: 'Basic Electrical Engineering',            credits: 3 },
    { code: 'HU-101', subject: 'Communication Skills & Technical Writing',credits: 2 },
    { code: 'ME-102', subject: 'Workshop Practice',                       credits: 2 },
  ],
  contacts: [
    { label: 'Anti-Ragging Helpline',  phone: '1800-180-5522',   email: 'antiranging@sgsits.ac.in', note: '24×7, Toll-Free' },
    { label: 'Dean Student Welfare',   phone: '0731-2582105',    email: 'dsw@sgsits.ac.in' },
    { label: 'Exam Cell',              phone: '0731-2582106',    email: 'examcell@sgsits.ac.in' },
    { label: 'Hostel Administration',  phone: '0731-2582220',    email: 'hostel@sgsits.ac.in' },
    { label: 'Dispensary',             phone: '0731-2582210' },
  ],
}

export const examResultsDefault: ExamResultsData = {
  reEvaluationNote: 'Applications for re-evaluation/re-checking must be submitted within 15 days of official result declaration.',
  schedules: [
    { type: 'Mid-Semester Examination',  months: 'September (Sem 1) / February (Sem 2)',         note: '2 hours duration' },
    { type: 'End-Semester Examination',  months: 'November–December (Sem 1) / April–May (Sem 2)', note: '3 hours duration' },
    { type: 'Supplementary Examination', months: 'July / August',                                  note: 'For students with back-papers' },
  ],
}

export const ordinancesDefault: OrdinancesData = {
  intro: 'The Academic Ordinances of SGSITS govern all aspects of academic affairs including admission, registration, attendance, examinations, grading, and award of degrees.',
  attendanceRules: [
    '75% minimum attendance mandatory to sit for end-semester examinations',
    '65–74%: Allowed with penalty/fine at discretion of Head of Department',
    'Below 65%: Debarred from appearing in examinations — must repeat the semester',
    'Medical/sports exemptions for up to 10% attendance with proper documentation',
  ],
  gradeTable: [
    { grade: 'O',  points: 10, range: '90–100', desc: 'Outstanding' },
    { grade: 'A+', points: 9,  range: '80–89',  desc: 'Excellent' },
    { grade: 'A',  points: 8,  range: '70–79',  desc: 'Very Good' },
    { grade: 'B+', points: 7,  range: '60–69',  desc: 'Good' },
    { grade: 'B',  points: 6,  range: '55–59',  desc: 'Above Average' },
    { grade: 'C',  points: 5,  range: '50–54',  desc: 'Average' },
    { grade: 'P',  points: 4,  range: '45–49',  desc: 'Pass' },
    { grade: 'F',  points: 0,  range: 'Below 45', desc: 'Fail (Repeat required)' },
  ],
  examRules: [
    'Mid-semester exams: 2 per semester (best of 2 counted)',
    'End-semester exams: 70 marks (theory) + 30 marks (sessional)',
    'Minimum 40% in end-sem and 35% aggregate to pass a subject',
    'Supplementary exams for failed students after results declaration',
    'Re-checking / re-evaluation facility available on payment of fee',
  ],
  integrityRules: [
    'Use of unfair means leads to cancellation of exam paper',
    'Mobile phones/electronic devices prohibited in examination hall',
    'Plagiarism in reports/projects subject to zero marks',
    'Submission of false certificates: disciplinary action',
    'SGSITS Plagiarism policy follows UGC Regulations 2018',
  ],
  documents: [
    { title: 'B.Tech Ordinances & Regulations (NEP 2020)', size: '1.8 MB', year: '2024' },
    { title: 'M.Tech Ordinances & Scheme of Examination', size: '1.2 MB', year: '2024' },
    { title: 'Ph.D. Ordinances & Research Regulations',   size: '0.9 MB', year: '2023' },
    { title: 'MBA / MCA Ordinances & Evaluation System',  size: '0.7 MB', year: '2024' },
  ],
}

export const plagiarismDefault: PlagiarismData = {
  intro: 'SGSITS follows a strict anti-plagiarism policy for all academic submissions including dissertations, theses, research papers, and project reports.',
  paragraphs: [
    'Turnitin: All M.Tech dissertations and Ph.D. theses must be checked through Turnitin before submission. The maximum allowable similarity index is 15% (excluding references and bibliography).',
    'Levels of Plagiarism: Level 0 (0-10%): No penalty. Level 1 (10-40%): Revision required. Level 2 (40-60%): Rejected, resubmission allowed after 6 months. Level 3 (>60%): Rejected, disciplinary action initiated.',
  ],
}

export const codeOfEthicsDefault: CodeOfEthicsData = {
  intro: 'All students, faculty, and staff at SGSITS are expected to uphold the highest standards of professional ethics and institutional values.',
  antiRaggingAlert: 'Ragging in any form is a severe criminal offense under State and Central legislation. Any student found guilty of ragging on or off-campus is liable to face immediate police arrest, immediate expulsion from the institute, and a permanent academic ban.',
  guidelines: [
    { title: 'Academic Integrity',   desc: 'Uphold the highest standards of scholarship. Submit strictly original work, ensure proper citation of research and literature, and maintain absolute transparency during exams and projects.' },
    { title: 'Campus Behavior',      desc: 'Foster respect and inclusivity. SGSITS enforces a strict zero-tolerance policy towards ragging, harassment, or discrimination of any form. Treat all members of our community with dignity.' },
    { title: 'Use of Facilities',    desc: 'Engage with college resources responsibly. Take care of advanced laboratory apparatus, server rooms, libraries, and sports infrastructure. Any deliberate damage is subject to disciplinary action.' },
    { title: 'Disciplinary Process', desc: 'Be accountable. Code infractions are referred to the high-level Institute Discipline Committee. Consequences may include formal warnings, record suspension, or permanent expulsion.' },
  ],
  pdfUrl: '',
}

export const obeNepDefault: ObeNepData = {
  intro: 'SGSITS has adopted Outcome-Based Education (OBE) framework as per NBA/NAAC guidelines. The curriculum is designed around Program Outcomes (POs), Program Educational Objectives (PEOs), and Course Outcomes (COs).',
  paragraphs: [
    'Program Outcomes (POs): 12 graduate attributes defined by NBA including Engineering Knowledge, Problem Analysis, Design/Development of Solutions, Conduct Investigations, Modern Tool Usage, Engineer and Society, Environment and Sustainability, Ethics, Individual and Team Work, Communication, Project Management, and Life-long Learning.',
    'NEP 2020 Implementation: SGSITS is progressively implementing NEP 2020 features including multidisciplinary education, flexible curriculum with electives, research focus from UG level, credit-based system, and multiple entry-exit options.',
    'Continuous Improvement: Regular feedback from stakeholders (students, alumni, employers, parents) is collected and analyzed for continuous improvement of teaching-learning processes.',
  ],
}

export const academicsService = {
  getUGCourses, savePGCourses,
  getPGCourses, saveUGCourses,
  getPhDCourses, savePhDCourses,
  getPTDCCourses, savePTDCCourses,
  getAcademicCalendar, saveAcademicCalendar,
  getOnlineCourses, saveOnlineCourses,
  getFirstYearInfo, saveFirstYearInfo,
  getExamResults, saveExamResults,
  getAcademicsLandingCards, saveAcademicsLandingCards,
  getAcademicsLandingMeta, saveAcademicsLandingMeta,
  getOrdinances, saveOrdinances,
  getPlagiarism, savePlagiarism,
  getCodeOfEthics, saveCodeOfEthics,
  getObeNep, saveObeNep,
}

export default academicsService

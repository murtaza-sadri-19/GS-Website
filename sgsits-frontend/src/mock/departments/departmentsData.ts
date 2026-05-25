/**
 * MOCK: Departments List
 * Replace with: GET /api/departments
 *
 * Consumed ONLY through src/services/departmentService.ts.
 */

export interface DepartmentSummary {
  slug: string
  name: string
  shortName: string
  hodName: string
  hodEmail: string
  hodPhone?: string
  programsOffered: string[]
  facultyCount: number
  isActive: boolean
}

export const mockDepartments: DepartmentSummary[] = [
  {
    slug: 'applied-chemistry',
    name: 'Applied Chemistry & Chemical Technology',
    shortName: 'Applied Chemistry',
    hodName: 'Dr. Nitish Gupta',
    hodEmail: 'nitish.nidhi75@gmail.com',
    hodPhone: '+91-731-2582181',
    programsOffered: ['UG', 'PG'],
    facultyCount: 8,
    isActive: true,
  },
  {
    slug: 'applied-mathematics',
    name: 'Applied Mathematics & Computational Science',
    shortName: 'Applied Mathematics',
    hodName: 'Dr. Smita Verma',
    hodEmail: 'yvsmita@gmail.com',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 12,
    isActive: true,
  },
  {
    slug: 'applied-physics',
    name: 'Applied Physics & Optoelectronics',
    shortName: 'Applied Physics',
    hodName: 'Dr. Joseph Thomas Andrews',
    hodEmail: 'jtandrews@gmail.com',
    hodPhone: '+91-731-2582435',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 10,
    isActive: true,
  },
  {
    slug: 'biomedical-engineering',
    name: 'Biomedical Engineering',
    shortName: 'Biomedical Engg',
    hodName: 'Ms. Vibha Bhatnagar',
    hodEmail: 'vbhatnagar@sgsits.ac.in',
    hodPhone: '+91-731-2582471',
    programsOffered: ['UG', 'PG'],
    facultyCount: 6,
    isActive: true,
  },
  {
    slug: 'civil-engineering',
    name: 'Civil Engineering & Applied Mechanics',
    shortName: 'Civil Engg',
    hodName: 'Dr. R.K. Khare',
    hodEmail: 'rakeshkhare@hotmail.com',
    hodPhone: '9425053428',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 24,
    isActive: true,
  },
  {
    slug: 'computer-engineering',
    name: 'Computer Engineering',
    shortName: 'Computer Engg',
    hodName: 'Dr. Urjita Thakar',
    hodEmail: 'thakarurjita@gmail.com',
    hodPhone: '0731-2582401',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 22,
    isActive: true,
  },
  {
    slug: 'computer-technology',
    name: 'Computer Technology & Applications',
    shortName: 'CTA',
    hodName: 'Dr. Sunita Varma',
    hodEmail: 'svarma1@sgsits.ac.in',
    programsOffered: ['PG'],
    facultyCount: 10,
    isActive: true,
  },
  {
    slug: 'electrical-engineering',
    name: 'Electrical Engineering',
    shortName: 'Electrical Engg',
    hodName: 'Dr. H.K. Verma',
    hodEmail: 'hverma@sgsits.ac.in',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 18,
    isActive: true,
  },
  {
    slug: 'electronics-instrumentation',
    name: 'Electronics & Instrumentation Engineering',
    shortName: 'Electronics & Instru',
    hodName: 'Dr. R.C. Gurjar',
    hodEmail: 'rcgurjar94@gmail.com',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 14,
    isActive: true,
  },
  {
    slug: 'electronics-telecommunication',
    name: 'Electronics & Telecommunication Engineering',
    shortName: 'Electronics & Telecomm',
    hodName: 'Dr. Satish Jain',
    hodEmail: 'satishjain.jain@gmail.com',
    hodPhone: '+91-731-2582451',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 20,
    isActive: true,
  },
  {
    slug: 'humanities',
    name: 'Humanities & Social Sciences',
    shortName: 'Humanities',
    hodName: 'Dr. Neeraj Jain',
    hodEmail: 'Asaus343@gmail.com',
    programsOffered: ['UG'],
    facultyCount: 5,
    isActive: true,
  },
  {
    slug: 'industrial-production',
    name: 'Industrial & Production Engineering',
    shortName: 'Industrial & Prod',
    hodName: 'Dr. Girish Thakar',
    hodEmail: 'thakargirish@yahoo.com',
    hodPhone: '+91-731-2582371',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 15,
    isActive: true,
  },
  {
    slug: 'information-technology',
    name: 'Information Technology',
    shortName: 'Information Tech',
    hodName: 'Dr. K.K. Sharma',
    hodEmail: 'kkssgs@gmail.com',
    hodPhone: '0731-2582260',
    programsOffered: ['UG', 'PG'],
    facultyCount: 14,
    isActive: true,
  },
  {
    slug: 'management-studies',
    name: 'Management Studies (MBA)',
    shortName: 'MBA',
    hodName: 'Dr. R.C. Gupta',
    hodEmail: 'rcgupta.indore@gmail.com',
    hodPhone: '+91-731-2582651',
    programsOffered: ['PG', 'PhD'],
    facultyCount: 8,
    isActive: true,
  },
  {
    slug: 'mechanical-engineering',
    name: 'Mechanical Engineering',
    shortName: 'Mechanical Engg',
    hodName: 'Dr. B.R. Rawal',
    hodEmail: 'brrawal@gmail.com',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 25,
    isActive: true,
  },
  {
    slug: 'pharmacy',
    name: 'Pharmacy',
    shortName: 'Pharmacy',
    hodName: 'Dr. Vineet Singh',
    hodEmail: 'vchauhan@sgsits.ac.in',
    programsOffered: ['UG', 'PG', 'PhD'],
    facultyCount: 12,
    isActive: true,
  },
  {
    slug: 'coebg',
    name: 'Centre of Excellence for Bhartiya Gyan Parampara',
    shortName: 'Bhartiya Gyan Parampara',
    hodName: 'Dr. Neeraj Jain',
    hodEmail: 'Asaus343@gmail.com',
    programsOffered: ['Research/Centre'],
    facultyCount: 4,
    isActive: true,
  },
]

// ─── Homepage-only subset (12 departments shown in the grid) ─────────────────

export const homePageDepartments = [
  { name: 'Computer Engineering',          slug: 'computer-engineering' },
  { name: 'Information Technology',        slug: 'information-technology' },
  { name: 'Civil Engineering',             slug: 'civil-engineering' },
  { name: 'Mechanical Engineering',        slug: 'mechanical-engineering' },
  { name: 'Electrical Engineering',        slug: 'electrical-engineering' },
  { name: 'Electronics & Instrumentation', slug: 'electronics-instrumentation' },
  { name: 'Electronics & Telecomm.',       slug: 'electronics-telecommunication' },
  { name: 'Industrial & Production',       slug: 'industrial-production' },
  { name: 'Applied Physics',               slug: 'applied-physics' },
  { name: 'Applied Chemistry',             slug: 'applied-chemistry' },
  { name: 'Applied Mathematics',           slug: 'applied-mathematics' },
  { name: 'Pharmacy',                      slug: 'pharmacy' },
]

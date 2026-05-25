export interface UGProgram {
  name: string
  seats: number
  eligibility: string
  basis: string
}

export interface KeyDate {
  event: string
  date: string
}

export interface UGFee {
  category: string
  tuition: string
  other: string
  total: string
}

export interface AdmissionStep {
  iconName: string
  title: string
  desc: string
}

export interface UGAdmissionData {
  title: string
  description: string
  applyUrl: string
  mpdteUrl: string
  prospectusUrl: string
  admissionEmail: string
  admissionPhone: string
  steps: AdmissionStep[]
  programs: UGProgram[]
  keyDates: KeyDate[]
  fees: UGFee[]
  documents: string[]
}

export interface PGProgram {
  name: string
  dept: string
  seats: number
  eligibility: string
  basis: string
}

export interface PGFee {
  program: string
  tuition: string
  other: string
  total: string
}

export interface PGScholarship {
  title: string
  amount: string
  desc: string
  eligibility: string
}

export interface PGContact {
  role: string
  name: string
  dept: string
  phone: string
  email: string
}

export interface PGAdmissionData {
  title: string
  description: string
  applyUrl: string
  programs: PGProgram[]
  steps: AdmissionStep[]
  fees: PGFee[]
  scholarships: PGScholarship[]
  contacts: PGContact[]
}

export interface PhDResearchArea {
  dept: string
  iconName: string
  areas: string[]
}

export interface PhDVacancy {
  dept: string
  vacancies: number
  supervisors: string
  area: string
}

export interface PhDFacility {
  name: string
  desc: string
}

export interface PhDSelectionStep {
  title: string
  desc: string
}

export interface PhDAdmissionData {
  title: string
  description: string
  applyUrl: string
  brochureUrl: string
  guidelinesUrl: string
  rdPhone: string
  rdEmail: string
  rdAddress: string
  eligibilityQualifications: string[]
  eligibilityFellowships: string[]
  researchAreas: PhDResearchArea[]
  selectionSteps: PhDSelectionStep[]
  vacancies: PhDVacancy[]
  facilities: PhDFacility[]
}

export interface ProspectusHighlight {
  title: string
  items: string[]
}

export interface ProspectusFact {
  iconName: string
  label: string
  value: string
}

export interface ProspectusLink {
  label: string
  to: string
  desc: string
}

export interface ProspectusArchive {
  year: string
  fileUrl: string
}

export interface ProspectusData {
  title: string
  description: string
  englishUrl: string
  hindiUrl: string
  publishedDate: string
  fileDetails: string
  quickFacts: ProspectusFact[]
  highlights: ProspectusHighlight[]
  relatedLinks: ProspectusLink[]
  archive: ProspectusArchive[]
}

// ─── UG ADMISSION DEFAULT SEED ───────────────────────────────────────────────
export const mockUGAdmission: UGAdmissionData = {
  title: 'Undergraduate Admissions',
  description: "Join SGSITS – one of Madhya Pradesh's premier engineering institutes. Admissions to B.Tech and B.Pharm programs are conducted through MPDTE counselling based on JEE Main scores.",
  applyUrl: '#',
  mpdteUrl: '#',
  prospectusUrl: '/admission/prospectus',
  admissionEmail: 'admission@sgsits.ac.in',
  admissionPhone: '+91-731-2570 5714 / 5715',
  steps: [
    { iconName: 'ClipboardList', title: 'Apply for JEE Main', desc: 'Register and appear for JEE Main conducted by NTA. Secure a valid rank.' },
    { iconName: 'FileText', title: 'MPDTE Counselling', desc: 'Register on the MPDTE portal, fill choices, and participate in seat allotment rounds.' },
    { iconName: 'CheckCircle', title: 'Document Verification', desc: 'Report to the college for physical verification of all original documents.' },
    { iconName: 'CreditCard', title: 'Fee Payment', desc: 'Pay the admission fee online through the MPDTE portal or college fee counter.' },
    { iconName: 'BookOpen', title: 'Class Commencement', desc: 'Attend orientation and begin your academic journey at SGSITS.' },
  ],
  programs: [
    { name: 'B.Tech Computer Engineering', seats: 120, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' },
    { name: 'B.Tech Information Technology', seats: 60, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' },
    { name: 'B.Tech Civil Engineering', seats: 60, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' },
    { name: 'B.Tech Mechanical Engineering', seats: 120, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' },
    { name: 'B.Tech Electrical Engineering', seats: 60, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' },
    { name: 'B.Tech Electronics & Instrumentation', seats: 60, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' },
    { name: 'B.Tech Electronics & Telecommunication', seats: 60, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' },
    { name: 'B.Tech Industrial & Production Engg.', seats: 60, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' },
    { name: 'B.Pharm', seats: 60, eligibility: '10+2 with PCB/PCM (min 45%)', basis: 'MP PEPT / MPDTE' },
  ],
  keyDates: [
    { event: 'JEE Main Registration Opens', date: 'January 2025' },
    { event: 'JEE Main Exam (Session 1)', date: 'February 2025' },
    { event: 'JEE Main Exam (Session 2)', date: 'April 2025' },
    { event: 'MPDTE Counselling Registration', date: 'June 2025' },
    { event: 'Document Verification', date: 'July 2025' },
    { event: 'Seat Allotment Round 1', date: 'July 2025' },
    { event: 'Fee Payment Deadline', date: 'August 2025' },
    { event: 'Commencement of Classes', date: 'August 2025' },
  ],
  fees: [
    { category: 'General / OBC', tuition: '₹67,000', other: '₹12,500', total: '₹79,500' },
    { category: 'SC / ST (MP Domicile)', tuition: '₹10,000', other: '₹12,500', total: '₹22,500' },
    { category: 'EWS', tuition: '₹50,000', other: '₹12,500', total: '₹62,500' },
    { category: 'NRI / Foreign', tuition: '$2,500', other: '$500', total: '$3,000' },
  ],
  documents: [
    'Class 10 Mark Sheet & Certificate (Original + 2 copies)',
    'Class 12 Mark Sheet & Certificate (Original + 2 copies)',
    'JEE Main Score Card / Rank Card',
    'MPDTE Counselling Allotment Letter',
    'Category Certificate (SC/ST/OBC/EWS) if applicable',
    'Domicile Certificate (Madhya Pradesh)',
    'Migration / Transfer Certificate',
    'Character Certificate from last institution',
    'Passport-size photographs (6 copies)',
    'Aadhaar Card (self & parent)',
    'Income Certificate (for fee concession)',
    'Medical Fitness Certificate',
  ]
}

// ─── PG ADMISSION DEFAULT SEED ───────────────────────────────────────────────
export const mockPGAdmission: PGAdmissionData = {
  title: 'Postgraduate Admissions',
  description: 'Advance your career with M.Tech, M.E., MBA, or MCA programs at SGSITS. Admissions are based on GATE, MPGET, CAT, MAT, or NIMCET scores.',
  applyUrl: '#',
  steps: [
    { iconName: 'GraduationCap', title: 'GATE / MPGET Score', desc: 'Appear for GATE (conducted by IITs/IISc) or MPGET (MP state exam). A valid score is mandatory.' },
    { iconName: 'ClipboardList', title: 'Online Application', desc: 'Fill the SGSITS PG application form online. Upload required documents and pay the application fee.' },
    { iconName: 'FileText', title: 'Merit List', desc: 'Merit list is prepared based on GATE/MPGET score. Shortlisted candidates are called for counselling.' },
    { iconName: 'CheckCircle', title: 'Document Verification', desc: 'Report to the institute with original documents for verification and final allotment.' },
    { iconName: 'CreditCard', title: 'Fee Payment', desc: 'Complete admission by paying the first-year fees online or at the accounts office.' },
  ],
  programs: [
    { name: 'M.Tech Computer Engineering', dept: 'Computer Engineering', seats: 18, eligibility: 'B.Tech CE/IT/CSE (min 60%)', basis: 'GATE CS / MPGET' },
    { name: 'M.Tech VLSI Design', dept: 'Electronics & Telecom', seats: 18, eligibility: 'B.Tech ECE/ET/EI (min 60%)', basis: 'GATE EC / MPGET' },
    { name: 'M.Tech Structural Engineering', dept: 'Civil Engineering', seats: 18, eligibility: 'B.Tech Civil (min 60%)', basis: 'GATE CE / MPGET' },
    { name: 'M.Tech Thermal Engineering', dept: 'Mechanical Engineering', seats: 18, eligibility: 'B.Tech ME (min 60%)', basis: 'GATE ME / MPGET' },
    { name: 'M.Tech Power Electronics', dept: 'Electrical Engineering', seats: 18, eligibility: 'B.Tech EE/EI (min 60%)', basis: 'GATE EE / MPGET' },
    { name: 'M.Tech Instrumentation', dept: 'Electronics & Instrumentation', seats: 18, eligibility: 'B.Tech EI/EC (min 60%)', basis: 'GATE IN / MPGET' },
    { name: 'M.E. Industrial Engineering', dept: 'Industrial & Production', seats: 18, eligibility: 'B.Tech IP/ME (min 60%)', basis: 'GATE ME / MPGET' },
    { name: 'MBA', dept: 'Management Studies', seats: 60, eligibility: 'Any Graduate (min 50%) + CAT/MAT/CMAT', basis: 'CAT / MAT / CMAT / MPGET' },
    { name: 'MCA', dept: 'Computer Applications', seats: 30, eligibility: 'B.Sc. (Math) or BCA (min 50%)', basis: 'NIMCET / MPGET' },
  ],
  fees: [
    { program: 'M.Tech (All branches)', tuition: '₹42,000', other: '₹11,000', total: '₹53,000' },
    { program: 'M.E. Industrial Engineering', tuition: '₹42,000', other: '₹11,000', total: '₹53,000' },
    { program: 'MBA', tuition: '₹55,000', other: '₹13,000', total: '₹68,000' },
    { program: 'MCA', tuition: '₹38,000', other: '₹10,500', total: '₹48,500' },
  ],
  scholarships: [
    { title: 'GATE Fellowship', amount: '₹12,400/month', desc: 'GATE qualified M.Tech students receive MHRD stipend for up to 2 years.', eligibility: 'Valid GATE score required' },
    { title: 'State Government Scholarship', amount: 'Variable', desc: 'SC/ST/OBC students from MP may avail state scholarship for PG programs.', eligibility: 'MP domicile + category certificate' },
    { title: 'Merit Scholarship (SGSITS)', amount: '₹5,000/semester', desc: 'Awarded to students who secure CGPA ≥ 8.5 in the previous semester.', eligibility: 'CGPA ≥ 8.5' },
  ],
  contacts: [
    { role: 'Postgraduate Admission Coordinator', name: 'Dr. P.K. Sharma', dept: 'Academic Affairs', phone: '+91-731-2570-5718', email: 'pg.admission@sgsits.ac.in' },
    { role: 'MBA Program Coordinator', name: 'Dr. Sunita Joshi', dept: 'Management Studies', phone: '+91-731-2570-5720', email: 'mba.admission@sgsits.ac.in' },
    { role: 'MCA Program Coordinator', name: 'Dr. Anil Verma', dept: 'Computer Applications', phone: '+91-731-2570-5722', email: 'mca.admission@sgsits.ac.in' },
  ]
}

// ─── PHD ADMISSION DEFAULT SEED ───────────────────────────────────────────────
export const mockPhDAdmission: PhDAdmissionData = {
  title: 'PhD Admissions',
  description: 'Pursue doctoral research at SGSITS under experienced faculty. We offer research opportunities across 7 departments with excellent infrastructure and GATE fellowships.',
  applyUrl: '#',
  brochureUrl: '#',
  guidelinesUrl: '#',
  rdPhone: '+91-731-2570-5725',
  rdEmail: 'phd.admission@sgsits.ac.in',
  rdAddress: 'Dean (R&D), SGSITS, Indore – 452003',
  eligibilityQualifications: [
    'M.Tech / M.E. / M.Sc. (Engg.) with minimum 60% marks or 6.5 CGPA',
    'MBA (for Management PhD) with minimum 60% marks',
    'M.Pharm / M.Sc. Pharmacy (for Pharmacy PhD) with minimum 60%',
    'SC/ST candidates: 55% or 6.0 CGPA'
  ],
  eligibilityFellowships: [
    'GATE qualified candidates are eligible for MHRD fellowship',
    'JRF: ₹37,000/month (first 2 years)',
    'SRF: ₹42,000/month (subsequent years)',
    'HRA and medical allowance as per MHRD norms'
  ],
  researchAreas: [
    { dept: 'Computer Engineering', iconName: 'Cpu', areas: ['Machine Learning & AI', 'Cybersecurity', 'IoT & Embedded Systems', 'Cloud Computing', 'Natural Language Processing', 'Computer Vision'] },
    { dept: 'Electronics & Telecommunication', iconName: 'Zap', areas: ['VLSI Design', 'Signal Processing', '5G/6G Communication', 'Antenna Design', 'Embedded Systems', 'RF & Microwave Engineering'] },
    { dept: 'Civil Engineering', iconName: 'Building2', areas: ['Structural Engineering', 'Geotechnical Engineering', 'Transportation Engineering', 'Water Resources', 'Environmental Engineering', 'Smart Materials'] },
    { dept: 'Mechanical Engineering', iconName: 'Wrench', areas: ['Thermal & Fluid Systems', 'Manufacturing Processes', 'Robotics & Automation', 'Renewable Energy', 'CFD Simulation', 'Composite Materials'] },
    { dept: 'Electrical Engineering', iconName: 'Zap', areas: ['Power Systems', 'Electric Vehicles', 'Smart Grid', 'Power Electronics', 'Control Systems', 'Energy Harvesting'] },
    { dept: 'Pharmacy', iconName: 'Pill', areas: ['Drug Delivery Systems', 'Pharmaceutical Chemistry', 'Pharmacognosy', 'Biotechnology', 'Clinical Pharmacy', 'Nanotechnology in Pharmacy'] },
    { dept: 'Management Studies', iconName: 'BarChart3', areas: ['Business Analytics', 'Strategic Management', 'Supply Chain Management', 'Financial Markets', 'Human Resource Management', 'Digital Marketing'] },
  ],
  selectionSteps: [
    { title: 'Apply Online', desc: 'Submit PhD application form with research proposal and SOP.' },
    { title: 'Written Examination', desc: 'Subject-specific written test conducted by SGSITS (waived for GATE qualified candidates).' },
    { title: 'Research Presentation', desc: 'Present your proposed research area to the departmental committee.' },
    { title: 'Interview', desc: 'Personal interview with the supervisor and PhD committee members.' },
    { title: 'Merit & Admission', desc: 'Final merit list published; selected candidates complete enrollment formalities.' },
  ],
  vacancies: [
    { dept: 'Computer Engineering', vacancies: 4, supervisors: 'Dr. R.K. Gupta, Dr. A. Sharma', area: 'Machine Learning, Cloud Computing' },
    { dept: 'Electronics & Telecom', vacancies: 3, supervisors: 'Dr. S. Patel, Dr. M. Jain', area: 'VLSI Design, 5G Communication' },
    { dept: 'Mechanical Engineering', vacancies: 5, supervisors: 'Dr. P. Verma, Dr. H. Singh', area: 'Thermal Engineering, Robotics' },
    { dept: 'Civil Engineering', vacancies: 3, supervisors: 'Dr. K. Tiwari, Dr. N. Mishra', area: 'Structural Engineering, Geotechnics' },
    { dept: 'Electrical Engineering', vacancies: 2, supervisors: 'Dr. A. Dubey', area: 'Power Systems, Smart Grid' },
    { dept: 'Pharmacy', vacancies: 3, supervisors: 'Dr. S. Agrawal, Dr. R. Chouhan', area: 'Drug Delivery, Pharmaceutical Chemistry' },
    { dept: 'Management Studies', vacancies: 2, supervisors: 'Dr. P. Saxena', area: 'Business Analytics, Strategic Mgmt.' },
  ],
  facilities: [
    { name: 'High Performance Computing Lab', desc: 'Cluster with 128-core processing for simulation and AI research.' },
    { name: 'VLSI & Embedded Lab', desc: 'FPGA boards, oscilloscopes, spectrum analyzers for electronics research.' },
    { name: 'Materials Testing Lab', desc: 'UTM, fatigue testing, SEM, and XRD for material characterization.' },
    { name: 'Structural Research Lab', desc: 'Loading frames, shake table, and data acquisition systems.' },
    { name: 'Central Instrumentation Facility', desc: 'Shared facility with advanced analytical instruments for all departments.' },
    { name: 'Digital Library & e-Resources', desc: 'Access to IEEE Xplore, Springer, Elsevier, and 50+ journals.' },
  ]
}

// ─── PROSPECTUS DEFAULT SEED ────────────────────────────────────────────────
export const mockProspectus: ProspectusData = {
  title: 'SGSITS Prospectus 2025–26',
  description: 'Your complete guide to programs, admissions, fees, facilities, and campus life at Shri G. S. Institute of Technology & Science, Indore.',
  englishUrl: '#',
  hindiUrl: '#',
  publishedDate: 'Published: March 2025',
  fileDetails: 'File size: ~8 MB | Pages: 120 | Format: PDF',
  quickFacts: [
    { iconName: 'Calendar', label: 'Established', value: '1952' },
    { iconName: 'Award', label: 'Accreditation', value: 'NAAC A+' },
    { iconName: 'Building2', label: 'Departments', value: '12' },
    { iconName: 'Users', label: 'Students', value: '5,000+' },
    { iconName: 'GraduationCap', label: 'Faculty', value: '250+' },
    { iconName: 'MapPin', label: 'Campus Area', value: '30 Acres' },
    { iconName: 'Star', label: 'NIRF Rank', value: 'Band 101–150' },
    { iconName: 'BookOpen', label: 'Programs', value: '20+' },
  ],
  highlights: [
    { title: 'Programs & Courses', items: ['B.Tech in 8 branches', 'M.Tech in 6 specializations', 'MBA & MCA programs', 'PhD research programs', 'Certificate & Short-term courses'] },
    { title: 'Admission Procedures', items: ['UG admission via JEE Main + MPDTE', 'PG admission via GATE + MPGET', 'PhD selection process', 'NRI admission procedure', 'Seat matrix and reservations'] },
    { title: 'Fee & Scholarships', items: ['Program-wise fee structure', 'Government fee concessions', 'GATE fellowship details', 'Merit scholarships', 'SC/ST/OBC benefits'] },
    { title: 'Campus & Facilities', items: ['Academic infrastructure', 'Hostels & Mess', 'Sports & Cultural facilities', 'Medical centre', 'Transport facilities'] },
    { title: 'Research & Innovation', items: ['R&D labs and facilities', 'Funded research projects', 'Publications and patents', 'Industry collaborations', 'Startup & incubation'] },
    { title: 'Placement & Careers', items: ['Top recruiters & packages', 'Placement statistics', 'Internship programs', 'Career development cell', 'Alumni network'] },
  ],
  relatedLinks: [
    { label: 'UG Admission', to: '/admission/ug', desc: 'B.Tech & B.Pharm programs' },
    { label: 'PG Admission', to: '/admission/pg', desc: 'M.Tech, MBA & MCA programs' },
    { label: 'PhD Admission', to: '/admission/phd', desc: 'Doctoral research programs' },
    { label: 'Fee Structure', to: '/admission/ug', desc: 'Detailed fee information' },
  ],
  archive: [
    { year: '2024–25', fileUrl: '#' },
    { year: '2023–24', fileUrl: '#' },
    { year: '2022–23', fileUrl: '#' },
    { year: '2021–22', fileUrl: '#' },
  ]
}

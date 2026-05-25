/**
 * MOCK: Placement / T&P Cell Data
 * Replace with: GET /api/placement/*
 *
 * Consumed ONLY through src/services/placementService.ts
 */

// ─── Placement Records (year-wise) ────────────────────────────────────────────

export interface PlacementRecord {
  year: string
  studentsPlaced: number
  companies: number
  highestPackage: string
  averagePackage: string
  topRecruiters: string[]
}

export const mockPlacementRecords: PlacementRecord[] = [
  { year: '2023-24', studentsPlaced: 1820, companies: 245, highestPackage: '₹45 LPA', averagePackage: '₹6.8 LPA', topRecruiters: ['Microsoft', 'TCS', 'Infosys', 'Wipro', 'L&T', 'DRDO', 'Capgemini', 'HCL'] },
  { year: '2022-23', studentsPlaced: 1650, companies: 210, highestPackage: '₹38 LPA', averagePackage: '₹5.9 LPA', topRecruiters: ['Amazon', 'Cognizant', 'TCS', 'Wipro', 'Bosch', 'BPCL', 'Infosys', 'HCL'] },
  { year: '2021-22', studentsPlaced: 1540, companies: 190, highestPackage: '₹32 LPA', averagePackage: '₹5.2 LPA', topRecruiters: ['TCS', 'Infosys', 'Wipro', 'L&T', 'DRDO', 'Tech Mahindra', 'Capgemini'] },
  { year: '2020-21', studentsPlaced: 1380, companies: 165, highestPackage: '₹28 LPA', averagePackage: '₹4.8 LPA', topRecruiters: ['TCS', 'Infosys', 'Wipro', 'HCL', 'L&T', 'DRDO', 'ONGC'] },
  { year: '2019-20', studentsPlaced: 1290, companies: 148, highestPackage: '₹22 LPA', averagePackage: '₹4.1 LPA', topRecruiters: ['TCS', 'Cognizant', 'Infosys', 'L&T', 'BHEL', 'HCL', 'Accenture'] },
]

// ─── Department-wise Placement ────────────────────────────────────────────────

export interface DeptPlacementStat {
  dept: string
  placed: number
  total: number
  avg: string
  highest: string
}

export const mockDeptPlacement: DeptPlacementStat[] = [
  { dept: 'Computer Engineering',    placed: 98, total: 120, avg: '₹9.8 LPA', highest: '₹48 LPA' },
  { dept: 'Information Technology',  placed: 95, total: 100, avg: '₹9.2 LPA', highest: '₹42 LPA' },
  { dept: 'Electronics & Comm.',     placed: 88, total: 100, avg: '₹7.8 LPA', highest: '₹32 LPA' },
  { dept: 'Mechanical Engineering',  placed: 82, total: 120, avg: '₹6.5 LPA', highest: '₹28 LPA' },
  { dept: 'Civil Engineering',       placed: 70, total: 80,  avg: '₹5.8 LPA', highest: '₹18 LPA' },
  { dept: 'Electrical Engineering',  placed: 85, total: 100, avg: '₹7.2 LPA', highest: '₹26 LPA' },
  { dept: 'Electronics & Instr.',    placed: 80, total: 90,  avg: '₹6.8 LPA', highest: '₹24 LPA' },
  { dept: 'Pharmacy',                placed: 72, total: 80,  avg: '₹5.5 LPA', highest: '₹16 LPA' },
]

// ─── T&P Cell Team ────────────────────────────────────────────────────────────

export interface TNPTeamMember {
  name: string
  title: string
  dept: string
  phone: string
  email: string
  img: string
  exp: string
}

export const mockTNPTeam: TNPTeamMember[] = [
  {
    name: 'Prof. V.K. Sharma',
    title: 'Training & Placement Officer (TPO)',
    dept: 'Department of Computer Engineering',
    phone: '0731-2582150',
    email: 'tpo@sgsits.ac.in',
    img: 'https://picsum.photos/seed/tpo_sharma/200/200',
    exp: '20 years',
  },
  {
    name: 'Dr. Anjali Mehta',
    title: 'UG Placement Coordinator',
    dept: 'T&P Cell',
    phone: '0731-2582151',
    email: 'placement.ug@sgsits.ac.in',
    img: 'https://picsum.photos/seed/tpo_anjali/200/200',
    exp: '12 years',
  },
  {
    name: 'Mr. Rahul Patidar',
    title: 'PG & Corporate Relations',
    dept: 'T&P Cell',
    phone: '0731-2582152',
    email: 'placement.pg@sgsits.ac.in',
    img: 'https://picsum.photos/seed/tpo_rahul/200/200',
    exp: '8 years',
  },
]

// ─── Placement Process Steps ──────────────────────────────────────────────────

export interface PlacementProcessStep {
  num: string
  title: string
  desc: string
}

export const mockPlacementProcess: PlacementProcessStep[] = [
  { num: '01', title: 'Company Registration',  desc: 'Companies register on the T&P portal and submit JD, package details, and eligibility criteria.' },
  { num: '02', title: 'Pre-Placement Talk',    desc: 'Company HR team visits or conducts virtual PPT to brief students about roles and culture.' },
  { num: '03', title: 'Aptitude Test',         desc: 'Written or online screening — quant, logical reasoning, verbal ability, and coding (if applicable).' },
  { num: '04', title: 'Group Discussion',      desc: 'For communication-heavy roles — case studies, topic-based GD and extempore sessions.' },
  { num: '05', title: 'Technical Interview',   desc: 'Final technical depth assessment — DSA, core subjects, projects, and domain expertise.' },
  { num: '06', title: 'Offer Letter',          desc: 'Selected students receive official offer letters. Joining formalities coordinated by T&P Cell.' },
]

// ─── Training Programs ────────────────────────────────────────────────────────

export const mockTrainingPrograms: string[] = [
  'Quantitative Aptitude & Logical Reasoning (AMCAT, Cocubes pattern)',
  'Verbal Ability & Communication Skills Enhancement',
  'Technical Interview Preparation (DSA, DBMS, OS, Networks)',
  'Resume Building & LinkedIn Profile Optimization Workshops',
  'Mock Interviews with Industry Professionals',
  'Soft Skills and Professional Etiquette Training',
  'Group Discussion Facilitation and Practice Sessions',
  'GATE & Higher Education Guidance Programs',
]

// ─── Recruiting Partners ──────────────────────────────────────────────────────

export const mockRecruitingPartners: string[] = [
  'TCS', 'Infosys', 'Wipro', 'Accenture', 'L&T', 'BHEL', 'Amazon', 'Microsoft',
  'Google', 'IBM', 'HCL', 'Cognizant', 'Tech Mahindra', 'Capgemini', 'Oracle', 'Deloitte',
]

// ─── T&P Cell Contact ─────────────────────────────────────────────────────────

export interface PlacementContactPerson {
  name: string
  designation: string
  dept: string
  phone: string
  email: string
  role: 'primary' | 'secondary'
}

export const mockPlacementContacts: PlacementContactPerson[] = [
  {
    name: 'Prof. V.K. Sharma',
    designation: 'Training & Placement Officer (TPO)',
    dept: 'Department of Computer Engineering',
    phone: '0731-2582150',
    email: 'tpo@sgsits.ac.in',
    role: 'primary',
  },
  {
    name: 'Placement Coordinator (UG)',
    designation: 'UG Placement In-Charge',
    dept: 'T&P Cell',
    phone: '0731-2582151',
    email: 'placement.ug@sgsits.ac.in',
    role: 'secondary',
  },
  {
    name: 'Placement Coordinator (PG)',
    designation: 'PG & PhD Placement In-Charge',
    dept: 'T&P Cell',
    phone: '0731-2582152',
    email: 'placement.pg@sgsits.ac.in',
    role: 'secondary',
  },
]

export interface PlacementOfficeInfo {
  address: string
  mondayFridayHours: string
  saturdayHours: string
  sundayStatus: string
}

export const mockPlacementOfficeInfo: PlacementOfficeInfo = {
  address: 'Training & Placement Cell, Ground Floor, Administrative Block, SGSITS Campus, 23 Park Road, Indore - 452003 (M.P.)',
  mondayFridayHours: '9:30 AM – 5:30 PM',
  saturdayHours: '9:30 AM – 1:00 PM',
  sundayStatus: 'Closed',
}

export interface TNPCellInfo {
  aboutText: string
  phone: string
  email: string
  ctaLabel: string
  ctaEmail: string
}

export const mockTNPCellInfo: TNPCellInfo = {
  aboutText:
    'The Training & Placement (T&P) Cell of SGSITS is the dedicated interface between the institute and industry. It coordinates campus recruitment drives, summer internships, pre-placement offers (PPOs), and career development programs throughout the academic year. The cell maintains strong industry connections with 180+ organizations — ranging from Fortune 500 MNCs to high-growth startups. The recruitment season runs from August to March every year. In the last decade, the T&P Cell has facilitated placements for over 10,000 students across all branches.',
  phone: '0731-2582150',
  email: 'tpo@sgsits.ac.in',
  ctaLabel: 'Register Your Company for Campus Drive',
  ctaEmail: 'tpo@sgsits.ac.in',
}

// ─── Leading Companies (logos / names) ───────────────────────────────────────
// sector values: 'IT' | 'Product' | 'Core' | 'PSU' | 'Consulting' | 'Startup'

export interface LeadingCompany {
  name: string
  sector: string
  highlight?: boolean
  logoUrl?: string
}

export const mockLeadingCompanies: LeadingCompany[] = [
  // IT Services
  { name: 'TCS',               sector: 'IT',         highlight: true  },
  { name: 'Infosys',           sector: 'IT',         highlight: true  },
  { name: 'Wipro',             sector: 'IT',         highlight: true  },
  { name: 'Accenture',         sector: 'IT',         highlight: true  },
  { name: 'Cognizant',         sector: 'IT'                           },
  { name: 'HCL Technologies',  sector: 'IT'                           },
  { name: 'Tech Mahindra',     sector: 'IT'                           },
  { name: 'Capgemini',         sector: 'IT'                           },
  { name: 'Mphasis',           sector: 'IT'                           },
  { name: 'Hexaware',          sector: 'IT'                           },
  { name: 'Zensar Technologies', sector: 'IT'                         },
  { name: 'Persistent Systems', sector: 'IT'                          },
  // Product / FAANG
  { name: 'Amazon',            sector: 'Product',    highlight: true  },
  { name: 'Microsoft',         sector: 'Product',    highlight: true  },
  { name: 'Google',            sector: 'Product',    highlight: true  },
  { name: 'Oracle',            sector: 'Product'                      },
  { name: 'SAP',               sector: 'Product'                      },
  { name: 'IBM',               sector: 'Product'                      },
  { name: 'Qualcomm',          sector: 'Product'                      },
  { name: 'Texas Instruments', sector: 'Product'                      },
  // Core Engineering
  { name: 'L&T',               sector: 'Core',       highlight: true  },
  { name: 'BHEL',              sector: 'Core',       highlight: true  },
  { name: 'Bosch',             sector: 'Core'                         },
  { name: 'Siemens',           sector: 'Core'                         },
  { name: 'ABB',               sector: 'Core'                         },
  { name: 'Honeywell',         sector: 'Core'                         },
  { name: 'Emerson',           sector: 'Core'                         },
  { name: 'Schneider Electric', sector: 'Core'                        },
  { name: 'Mahindra & Mahindra', sector: 'Core'                       },
  { name: 'Bajaj Auto',        sector: 'Core'                         },
  { name: 'Cummins India',     sector: 'Core'                         },
  { name: 'John Deere',        sector: 'Core'                         },
  // PSU
  { name: 'NTPC',              sector: 'PSU',        highlight: true  },
  { name: 'ONGC',              sector: 'PSU',        highlight: true  },
  { name: 'ISRO',              sector: 'PSU'                          },
  { name: 'DRDO',              sector: 'PSU'                          },
  { name: 'BARC',              sector: 'PSU'                          },
  { name: 'HAL',               sector: 'PSU'                          },
  { name: 'BEL',               sector: 'PSU'                          },
  { name: 'GAIL',              sector: 'PSU'                          },
  { name: 'IOCL',              sector: 'PSU'                          },
  // Consulting
  { name: 'Deloitte',          sector: 'Consulting', highlight: true  },
  { name: 'KPMG',              sector: 'Consulting', highlight: true  },
  { name: 'PwC',               sector: 'Consulting'                   },
  { name: 'EY',                sector: 'Consulting'                   },
  { name: 'ZS Associates',     sector: 'Consulting'                   },
  { name: 'Aon',               sector: 'Consulting'                   },
  // Startups
  { name: 'PhonePe',           sector: 'Startup'                      },
  { name: 'Razorpay',          sector: 'Startup'                      },
  { name: 'Flipkart',          sector: 'Startup'                      },
  { name: 'Zomato',            sector: 'Startup'                      },
  { name: 'BrowserStack',      sector: 'Startup'                      },
]

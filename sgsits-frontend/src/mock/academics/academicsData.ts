/**
 * MOCK: Academics Pages Data
 * Replace with: GET /api/academics/*
 *
 * Consumed ONLY through src/services/academicsService.ts
 */

// ─── UG Courses ───────────────────────────────────────────────────────────────

export interface UGCourse {
  name: string
  seats: number
  code: string
}

export interface UGCoursesData {
  intro: string
  stats: { label: string; value: string }[]
  courses: UGCourse[]
}

export const mockUGCourses: UGCoursesData = {
  intro: 'SGSITS offers B.Tech and B.Pharm programs approved by AICTE and affiliated to RGPV Bhopal. Admissions are through MP DTE counselling based on JEE Main scores.',
  stats: [
    { label: 'Programs',   value: '10'       },
    { label: 'Total Seats',value: '780'      },
    { label: 'Duration',   value: '4 Years'  },
    { label: 'Semesters',  value: '8'        },
  ],
  courses: [
    { name: 'Computer Engineering',                        seats: 120, code: 'CSE' },
    { name: 'Civil Engineering & Applied Mechanics',       seats: 120, code: 'CE'  },
    { name: 'Electrical Engineering',                      seats: 120, code: 'EE'  },
    { name: 'Mechanical Engineering',                      seats: 120, code: 'ME'  },
    { name: 'Electronics & Telecommunication Engg',        seats: 60,  code: 'ETC' },
    { name: 'Electronics & Instrumentation Engg',          seats: 60,  code: 'EI'  },
    { name: 'Information Technology',                      seats: 60,  code: 'IT'  },
    { name: 'Biomedical Engineering',                      seats: 30,  code: 'BM'  },
    { name: 'Industrial & Production Engineering',         seats: 30,  code: 'IP'  },
    { name: 'B.Pharm (Pharmacy)',                          seats: 60,  code: 'PH'  },
  ],
}

// ─── PG Courses ───────────────────────────────────────────────────────────────

export interface PGCourse {
  program: string
  dept: string
  intake: number
  eligibility: string
}

export interface PGCoursesData {
  intro: string
  stats: { label: string; value: string }[]
  programs: PGCourse[]
}

export const mockPGCourses: PGCoursesData = {
  intro: 'SGSITS offers a comprehensive range of postgraduate programs across engineering, management, and pharmacy disciplines. M.Tech programs are primarily GATE-based. All programs are 2 years (4 semesters) in duration.',
  stats: [
    { label: 'PG Programs',     value: '11+'     },
    { label: 'Program Duration',value: '2 Years' },
    { label: 'Primary Entrance',value: 'GATE/MAT'},
  ],
  programs: [
    { program: 'M.Tech — Computer Engineering',           dept: 'Computer Engineering',           intake: 18,  eligibility: 'B.E./B.Tech in CS/IT, GATE'      },
    { program: 'M.Tech — Information Technology',         dept: 'Information Technology',         intake: 18,  eligibility: 'B.E./B.Tech in IT/CS, GATE'      },
    { program: 'M.Tech — Structural Engineering',         dept: 'Civil Engineering',              intake: 18,  eligibility: 'B.E./B.Tech Civil Engg, GATE'     },
    { program: 'M.Tech — Power Systems',                  dept: 'Electrical Engineering',         intake: 18,  eligibility: 'B.E./B.Tech Electrical, GATE'     },
    { program: 'M.Tech — Machine Design',                 dept: 'Mechanical Engineering',         intake: 18,  eligibility: 'B.E./B.Tech Mechanical, GATE'     },
    { program: 'M.Tech — VLSI Design',                    dept: 'Electronics & Telecomm',         intake: 18,  eligibility: 'B.E./B.Tech EC/EI/EE, GATE'      },
    { program: 'M.Tech — Signal Processing',              dept: 'Electronics & Instrumentation',  intake: 18,  eligibility: 'B.E./B.Tech EC/EI, GATE'         },
    { program: 'M.Tech — Thermal Engineering',            dept: 'Mechanical Engineering',         intake: 18,  eligibility: 'B.E./B.Tech Mechanical, GATE'     },
    { program: 'M.Pharm — Pharmaceutical Sciences',       dept: 'Pharmacy',                       intake: 15,  eligibility: 'B.Pharm, GPAT'                   },
    { program: 'MBA — Business Administration',           dept: 'Management Studies',             intake: 120, eligibility: 'Any Graduate, MAT/CAT/MP PET'    },
    { program: 'MCA — Computer Applications',            dept: 'CTA',                             intake: 60,  eligibility: 'B.Sc. with Maths, NIMCET/MP PET' },
  ],
}

// ─── PhD Courses ──────────────────────────────────────────────────────────────

export interface PhDDept {
  dept: string
  areas: string
}

export interface PhDProcessStep {
  step: string
  desc: string
}

export interface PhDCoursesData {
  intro: string
  stats: { label: string; value: string }[]
  departments: PhDDept[]
  processSteps: PhDProcessStep[]
}

export const mockPhDCourses: PhDCoursesData = {
  intro: 'SGSITS offers Ph.D. (Doctor of Philosophy) programs across all 13 academic departments through Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV) and Devi Ahilya Vishwavidyalaya (DAVV). The institute has 200+ active research scholars and 100+ faculty supervisors with funded research projects from DST, AICTE, SERB, and other government bodies.',
  stats: [
    { label: 'Active Scholars', value: '200+' },
    { label: 'Supervisors',     value: '100+' },
    { label: 'Departments',     value: '13'   },
    { label: 'Avg. Duration',   value: '3–5 Yrs' },
  ],
  departments: [
    { dept: 'Computer Engineering',              areas: 'Machine Learning, NLP, Cybersecurity, Cloud Computing'                   },
    { dept: 'Information Technology',            areas: 'Data Mining, IoT, Network Security, Big Data'                            },
    { dept: 'Civil Engineering',                 areas: 'Structural Engineering, Geotechnical, Water Resources, Transportation'   },
    { dept: 'Mechanical Engineering',            areas: 'Thermal, Manufacturing, Tribology, Robotics, CAD/CAM'                    },
    { dept: 'Electrical Engineering',            areas: 'Power Systems, Control, Renewable Energy, Smart Grid'                    },
    { dept: 'Electronics & Telecomm',            areas: 'VLSI, Signal Processing, Embedded Systems, Communication'                },
    { dept: 'Electronics & Instrumentation',     areas: 'Sensors, MEMS, Biomedical Instrumentation, Control'                      },
    { dept: 'Industrial & Production',           areas: 'Supply Chain, Lean Manufacturing, Quality, Industrial Automation'        },
    { dept: 'Applied Mathematics',               areas: 'Operations Research, Fluid Mechanics, Mathematical Modelling'            },
    { dept: 'Applied Physics',                   areas: 'Optoelectronics, Nanomaterials, Plasma Physics, Photonics'               },
    { dept: 'Applied Chemistry',                 areas: 'Green Chemistry, Polymer Science, Electrochemistry, Nanochemistry'        },
    { dept: 'Management Studies',                areas: 'Finance, Marketing, HR, Operations Research, Entrepreneurship'           },
    { dept: 'Pharmacy',                          areas: 'Drug Delivery, Pharmacology, Pharmaceutical Analysis, Herbal Medicine'   },
  ],
  processSteps: [
    { step: 'Notification', desc: 'SGSITS publishes PhD admission notification (typically July-August and January-February)' },
    { step: 'Application',  desc: 'Apply online/offline with academic documents, research proposal, and application fee' },
    { step: 'Written Test', desc: 'Departmental written test (research aptitude + subject knowledge). GATE/NET holders may be exempt' },
    { step: 'Interview',    desc: 'Shortlisted candidates appear for interview before departmental research committee' },
    { step: 'Admission',    desc: 'Selected candidates register and identify thesis supervisor (co-guide optional)' },
    { step: 'Course Work',  desc: '1-year compulsory course work followed by comprehensive viva and research work' },
  ],
}

// ─── PTDC Courses ─────────────────────────────────────────────────────────────

export interface PTDCCourse {
  program: string
  dept: string
  duration: string
  description: string
}

export const mockPTDCCourses: PTDCCourse[] = [
  { program: 'PTDC in Computer Engineering',       dept: 'Computer Engineering', duration: '1 Year', description: 'Post-graduate Diploma for working professionals with B.E./B.Tech background.' },
  { program: 'PTDC in Information Technology',     dept: 'Information Technology', duration: '1 Year', description: 'Advanced diploma covering modern IT frameworks and tools for industry professionals.' },
  { program: 'PTDC in Electrical Engineering',     dept: 'Electrical Engineering', duration: '1 Year', description: 'Focused diploma on power systems, renewable energy, and smart grid technologies.' },
  { program: 'PTDC in Mechanical Engineering',     dept: 'Mechanical Engineering', duration: '1 Year', description: 'Advanced diploma in CAD/CAM, thermal systems, and manufacturing processes.' },
  { program: 'PTDC in Electronics',                dept: 'Electronics & Telecomm', duration: '1 Year', description: 'Diploma covering embedded systems, VLSI, and communication technologies.' },
]

// ─── Academic Calendar ────────────────────────────────────────────────────────

export interface AcademicCalendarEvent {
  event: string
  dates: string
  category: 'Odd Semester' | 'Even Semester' | 'Examination' | 'Holiday' | 'General'
}

export const mockAcademicCalendar: AcademicCalendarEvent[] = [
  { event: 'Odd Semester Classes Begin (2025-26)', dates: 'July 14, 2025',          category: 'Odd Semester'   },
  { event: 'First Internal Assessment Tests',      dates: 'Aug 25–30, 2025',        category: 'Examination'    },
  { event: 'Independence Day (National Holiday)',  dates: 'Aug 15, 2025',           category: 'Holiday'        },
  { event: 'Second Internal Assessment Tests',     dates: 'Sep 22–27, 2025',        category: 'Examination'    },
  { event: 'Mid-Semester Break',                   dates: 'Oct 2–6, 2025',          category: 'Holiday'        },
  { event: 'Diwali Break',                         dates: 'Oct 20–22, 2025',        category: 'Holiday'        },
  { event: 'Odd Semester Classes End',             dates: 'Nov 28, 2025',           category: 'Odd Semester'   },
  { event: 'Practical/Oral Examinations',          dates: 'Dec 1–6, 2025',          category: 'Examination'    },
  { event: 'Odd Semester End-Term Examinations',   dates: 'Dec 8–24, 2025',         category: 'Examination'    },
  { event: 'Winter Break',                         dates: 'Dec 25, 2025–Jan 4, 2026', category: 'Holiday'      },
  { event: 'Even Semester Classes Begin',          dates: 'Jan 5, 2026',            category: 'Even Semester'  },
  { event: 'Republic Day (National Holiday)',      dates: 'Jan 26, 2026',           category: 'Holiday'        },
  { event: 'First Internal Assessment Tests',      dates: 'Feb 16–21, 2026',        category: 'Examination'    },
  { event: 'Holi Break',                           dates: 'Mar 13–14, 2026',        category: 'Holiday'        },
  { event: 'Second Internal Assessment Tests',     dates: 'Apr 6–11, 2026',         category: 'Examination'    },
  { event: 'Even Semester Classes End',            dates: 'May 15, 2026',           category: 'Even Semester'  },
  { event: 'Practical/Oral Examinations',          dates: 'May 18–23, 2026',        category: 'Examination'    },
  { event: 'Even Semester End-Term Examinations',  dates: 'May 25–Jun 12, 2026',    category: 'Examination'    },
  { event: 'Summer Break',                         dates: 'Jun 15–Jul 13, 2026',    category: 'Holiday'        },
]

// ─── Online Courses / NPTEL ───────────────────────────────────────────────────

export interface OnlineCourseLink {
  title: string
  platform: string
  url: string
  description: string
}

export const mockOnlineCourses: OnlineCourseLink[] = [
  { title: 'NPTEL Online Courses',            platform: 'NPTEL (IIT-Led)',   url: 'https://nptel.ac.in',             description: 'SGSITS is an NPTEL Local Chapter. Students can enroll in 1000+ online courses from IITs and IISc and earn certificates.' },
  { title: 'Coursera for Campus',             platform: 'Coursera',          url: 'https://www.coursera.org',        description: 'Access to 7000+ courses from top universities through institutional subscription.' },
  { title: 'Swayam Platform',                 platform: 'SWAYAM (Govt.)',    url: 'https://swayam.gov.in',           description: 'Free online courses by Indian government initiative across disciplines.' },
  { title: 'SGSITS LMS',                      platform: 'Internal',          url: '#',                               description: 'Institute-wide Learning Management System for course materials, assignments and assessments.' },
]

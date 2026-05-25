/**
 * MOCK: Faculty Dashboard & Profile Data
 * Consolidated from:
 *   src/data/mockTeacherContent.ts — Profile, publications, research, qualifications, marks
 *   src/data/instituteProfessors.ts — Distinguished professor profiles
 *
 * Consumed ONLY through src/services/facultyService.ts
 */

export type ProfileStatus = 'pending' | 'approved' | 'rejected'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type ResearchStatus = 'Proposed' | 'Ongoing' | 'Completed' | 'On Hold'

// Current teacher identity — replace with auth.user.id once backend lands.
export const CURRENT_TEACHER_ID = 'F001'

// ── Teacher Profile ───────────────────────────────────────────────────────────

export interface TeacherProfile {
  faculty_id: string
  name: string
  email: string
  phone: string
  designation: string
  qualification: string
  experience_years: number
  specialization: string
  subjects_taught: string[]
  bio: string
  profile_photo: string
  office_location: string
  linkedin_url: string
  google_scholar_url: string
  personal_website: string
  branch_id: string
  status: ProfileStatus
  last_submitted: string
  approval_note?: string
}

export const mockTeacherProfile: TeacherProfile = {
  faculty_id:          'F001',
  name:                'Dr. Rajesh Kumar Pandey',
  email:               'rkpandey@sgsits.ac.in',
  phone:               '+91 98765 43210',
  designation:         'Professor',
  qualification:       'Ph.D. (Computer Science), IIT Bombay, 2009',
  experience_years:    15,
  specialization:      'Algorithms, Computational Complexity, Graph Theory',
  subjects_taught:     ['CS301 — Data Structures', 'CS303 — DS Lab', 'CS401 — Algorithms & Complexity'],
  bio:
    'Dr. Rajesh Kumar Pandey is a Professor in the Department of Computer Science & Engineering at SGSITS Indore. His research interests lie in algorithm design, computational complexity, and graph theory. He has published over 40 papers in peer-reviewed journals and conferences, and has supervised 12 Ph.D. scholars.',
  profile_photo:       'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  office_location:     'CSE Block, Room 302',
  linkedin_url:        'https://www.linkedin.com/in/rajeshkpandey',
  google_scholar_url:  'https://scholar.google.com/citations?user=abc123',
  personal_website:    'https://rkpandey.sgsits.ac.in',
  branch_id:           'CSE',
  status:              'approved',
  last_submitted:      '2026-04-08',
  approval_note:       'Approved by HOD on 2026-04-12.',
}

// ── Publications ──────────────────────────────────────────────────────────────

export interface Publication {
  id: string
  title: string
  journal_name: string
  publication_year: number
  authors: string
  publication_link: string
  description: string
  citation_count: number
  venue_type: 'Journal' | 'Conference' | 'Book Chapter' | 'Patent'
  status: ContentStatus
}

export const mockTeacherPublications: Publication[] = [
  { id: 'PUB001', title: 'Efficient Approximation Algorithms for Vertex Cover on Random Graphs',     journal_name: 'IEEE Transactions on Computers',              publication_year: 2024, authors: 'R. K. Pandey, M. Patil, P. Saxena',    publication_link: 'https://doi.org/10.1109/tc.2024.0123',             description: 'Novel approximation scheme achieving 1.5x improvement on sparse random graphs.',                              citation_count: 28, venue_type: 'Journal',      status: 'published' },
  { id: 'PUB002', title: 'A Sub-quadratic Algorithm for Maximum Matching in Bipartite Graphs',       journal_name: 'ACM Symposium on Theory of Computing (STOC)', publication_year: 2023, authors: 'R. K. Pandey, S. Gupta',               publication_link: 'https://doi.org/10.1145/3564246.3585157',           description: 'Improved bound on the time complexity of maximum bipartite matching.',                                         citation_count: 41, venue_type: 'Conference',   status: 'published' },
  { id: 'PUB003', title: 'Distributed Graph Coloring with Locality Constraints',                     journal_name: 'Journal of the ACM',                          publication_year: 2022, authors: 'R. K. Pandey, A. Shukla, K. Rani',    publication_link: 'https://doi.org/10.1145/3534225',                   description: 'New locality-sensitive algorithm for distributed coloring with provable bounds.',                              citation_count: 67, venue_type: 'Journal',      status: 'published' },
  { id: 'PUB004', title: 'Graph Algorithms in Action — A Hands-On Approach',                         journal_name: 'Manning Publications',                        publication_year: 2023, authors: 'R. K. Pandey',                         publication_link: 'https://www.manning.com/books/graph-algorithms',    description: 'Practitioner textbook covering 80+ graph algorithms with Python implementations.',                              citation_count: 15, venue_type: 'Book Chapter', status: 'published' },
  { id: 'PUB005', title: 'Adaptive Caching for Algorithmic Streaming Workloads',                     journal_name: 'IEEE International Conference on Big Data',   publication_year: 2025, authors: 'R. K. Pandey, P. Saxena, V. Kumar',  publication_link: 'https://doi.org/10.1109/bigdata.2025.0456',         description: 'Empirical study of cache-eviction policies on streaming graph workloads.',                                      citation_count:  9, venue_type: 'Conference',   status: 'published' },
  { id: 'PUB006', title: 'Method and System for Real-Time Path Computation in Dynamic Graphs',       journal_name: 'Indian Patent Office',                        publication_year: 2024, authors: 'R. K. Pandey, M. Patil',              publication_link: 'https://patents.google.com/patent/IN202411023456', description: 'Patented method for incremental shortest-path computation under edge updates.',                                 citation_count:  3, venue_type: 'Patent',       status: 'published' },
  { id: 'PUB007', title: 'On the Limits of LLM-Assisted Algorithm Design (Working Draft)',           journal_name: 'arXiv preprint',                              publication_year: 2026, authors: 'R. K. Pandey, P. Saxena',              publication_link: 'https://arxiv.org/abs/2603.01234',                  description: 'Survey of limitations and open problems in using LLMs for algorithmic problem solving.',                       citation_count:  0, venue_type: 'Journal',      status: 'draft'     },
]

// ── Research Projects ─────────────────────────────────────────────────────────

export interface ResearchProject {
  id: string
  research_title: string
  research_area: string
  description: string
  start_year: number
  end_year?: number
  status: ResearchStatus
  funding_agency?: string
  funding_amount_lakh?: number
  collaborators: string[]
  publish_status: ContentStatus
}

export const mockTeacherResearch: ResearchProject[] = [
  { id: 'RES001', research_title: 'Energy-Efficient ML Inference on Edge Devices',    research_area: 'Edge Computing & ML',  description: 'DST-funded 3-year project on hardware-aware inference optimization for IoT edge devices.',         start_year: 2025, end_year: 2028, status: 'Ongoing',   funding_agency: 'Dept. of Science & Technology', funding_amount_lakh: 38, collaborators: ['Dr. Priya Saxena (Co-PI)', 'Dr. Mahesh Patil', 'IIT Indore'], publish_status: 'published' },
  { id: 'RES002', research_title: 'Distributed Graph Algorithms for Social Networks', research_area: 'Graph Algorithms',     description: 'Theoretical work on locality-sensitive distributed algorithms for community detection.',           start_year: 2022, end_year: 2024, status: 'Completed', funding_agency: 'SERB',                          funding_amount_lakh: 12, collaborators: ['Prof. Amit Shukla', 'Dr. Kavita Rani'],                  publish_status: 'published' },
  { id: 'RES003', research_title: 'Real-Time Path Computation in Dynamic Networks',  research_area: 'Algorithms',           description: 'Incremental algorithms for shortest-path maintenance under edge insertions and deletions.',       start_year: 2021, end_year: 2023, status: 'Completed', funding_agency: 'Institute Seed Grant',          funding_amount_lakh:  5, collaborators: ['Dr. Mahesh Patil'],                                       publish_status: 'published' },
  { id: 'RES004', research_title: 'LLM-Assisted Algorithm Synthesis',                research_area: 'AI for Code',          description: 'Exploratory project on combining LLMs with classical algorithm-design techniques.',               start_year: 2026,              status: 'Proposed',  funding_agency: 'Pending review',                                         collaborators: ['Dr. Priya Saxena'],                                       publish_status: 'draft'     },
  { id: 'RES005', research_title: 'Streaming Algorithms for Telemetry Workloads',    research_area: 'Big Data',             description: 'Empirical and theoretical work on cache-aware streaming algorithms.',                               start_year: 2024,              status: 'On Hold',                                                                                  collaborators: ['Prof. Amit Shukla'],                                      publish_status: 'draft'     },
]

// ── Qualifications ────────────────────────────────────────────────────────────

export interface Qualification {
  id: string
  degree: string
  institution: string
  year: number
  specialization: string
  grade: string
  status: ContentStatus
}

export const mockTeacherQualifications: Qualification[] = [
  { id: 'QF001', degree: 'Ph.D.',              institution: 'Indian Institute of Technology, Bombay', year: 2009, specialization: 'Algorithms & Complexity',          grade: 'Awarded',                       status: 'published' },
  { id: 'QF002', degree: 'M.Tech.',             institution: 'Indian Institute of Technology, Kanpur', year: 2005, specialization: 'Computer Science & Engineering',   grade: '9.2 / 10.0 CGPA',               status: 'published' },
  { id: 'QF003', degree: 'B.E.',                institution: 'SGSITS, Indore',                         year: 2003, specialization: 'Computer Engineering',             grade: 'First Class with Distinction',  status: 'published' },
  { id: 'QF004', degree: 'GATE',                institution: 'IIT (qualifying exam)',                  year: 2003, specialization: 'Computer Science',                 grade: 'AIR 142',                       status: 'published' },
  { id: 'QF005', degree: 'NPTEL Certification', institution: 'NPTEL (IIT Madras)',                     year: 2022, specialization: 'Deep Learning for Computer Vision', grade: 'Elite + Silver',                status: 'published' },
]

// ── Course Outcomes (per subject) ─────────────────────────────────────────────

export interface CourseOutcome {
  co_name: string
  max_marks: number
}

export const mockSubjectCOs: Record<string, CourseOutcome[]> = {
  'CS301': [{ co_name: 'CO1', max_marks: 5 }, { co_name: 'CO2', max_marks: 5 }, { co_name: 'CO3', max_marks: 5 }, { co_name: 'CO4', max_marks: 5 }],
  'CS303': [{ co_name: 'CO1', max_marks: 10 }, { co_name: 'CO2', max_marks: 10 }, { co_name: 'CO3', max_marks: 10 }],
  'CS401': [{ co_name: 'CO1', max_marks: 5 }, { co_name: 'CO2', max_marks: 5 }, { co_name: 'CO3', max_marks: 5 }, { co_name: 'CO4', max_marks: 5 }],
}

export interface MarkRow {
  enrollment: string
  studentName: string
  co_marks: Record<string, number | null>
  isAbsent: boolean
}

// ── Distinguished Professors (Alumni/Institute Professors) ────────────────────

export interface InstituteProfessor {
  slug: string
  name: string
  year: string
  department: string
  image: string
  profileText: string
  achievements: string[]
}

export const mockInstituteProfessors: InstituteProfessor[] = [
  {
    slug: 'junjhunwala-ashok',
    name: 'Junjhunwala Ashok',
    year: '2014',
    department: 'Electrical Engineering',
    image: '/assets/professors/junjhunwala-ashok.svg',
    profileText: 'Professor Junjhunwala Ashok is recognized for long-standing contributions to electrical engineering education, applied systems research, and institution building. His guidance has shaped student innovation culture and interdisciplinary academic collaboration.',
    achievements: [
      'Led high-impact academic programs in electrical engineering.',
      'Mentored student and faculty research in core and applied domains.',
      'Contributed to institutional academic planning and quality improvement.',
    ],
  },
  {
    slug: 'pradeep-t',
    name: 'Pradeep T',
    year: '2015',
    department: 'Chemistry',
    image: '/assets/professors/pradeep-t.svg',
    profileText: 'Professor Pradeep T is known for his work in chemistry research, curriculum strengthening, and student mentorship. His academic initiatives have supported advanced laboratory learning and cross-disciplinary problem solving.',
    achievements: [
      'Advanced research activity in chemistry and materials-related studies.',
      'Developed outcome-focused academic and laboratory frameworks.',
      'Supported multiple student research and innovation cohorts.',
    ],
  },
  {
    slug: 'murty-b-s',
    name: 'Murty B S',
    year: '2016',
    department: 'Metallurgical and Materials Engineering',
    image: '/assets/professors/murty-b-s.svg',
    profileText: 'Professor Murty B S has made notable contributions to metallurgy and materials engineering through sustained research, mentoring, and leadership in advanced technical programs.',
    achievements: [
      'Strengthened advanced materials engineering research pathways.',
      'Guided faculty and postgraduate research collaborations.',
      'Contributed to national and international academic visibility.',
    ],
  },
  {
    slug: 'krishnakumar-r',
    name: 'Krishnakumar R',
    year: '2017',
    department: 'Engineering Design',
    image: '/assets/professors/krishnakumar-r.svg',
    profileText: 'Professor Krishnakumar R has significantly contributed to engineering design education, systems thinking, and practice-oriented pedagogy. His work reflects a strong blend of academic depth and industry relevance.',
    achievements: [
      'Promoted design-led engineering education and project culture.',
      'Helped build structured mentorship for design innovation teams.',
      'Supported collaborations linking academics with real-world applications.',
    ],
  },
]

export function getProfessorBySlug(slug: string): InstituteProfessor | undefined {
  return mockInstituteProfessors.find(p => p.slug === slug)
}

/**
 * Mock data for HOD-managed CONTENT entities required by the Role-wise
 * Actions doc (department profile, notices, downloads, events, gallery,
 * labs, achievements).
 *
 * Shared shape:
 *   status: 'draft' | 'published' | 'archived'
 */

export type ContentStatus = 'draft' | 'published' | 'archived'

// ── Department Profile (single record per branch) ────────────────────
export interface DepartmentProfile {
  branch_id: string
  department_name: string
  short_name: string
  about: string
  vision: string
  mission: string
  hod_message: string
  hod_name: string
  email: string
  phone: string
  established: string
  image_url: string
  status: ContentStatus
  updated_at: string
}

export const DEPT_PROFILE: DepartmentProfile = {
  branch_id: 'CSE',
  department_name: 'Department of Computer Science & Engineering',
  short_name: 'CSE',
  about:
    'Established in 1986, the Department of Computer Science & Engineering at SGSITS is recognized for its rigorous curriculum, dedicated faculty and contributions to research in algorithms, machine learning, distributed systems and cybersecurity.',
  vision:
    'To be a centre of excellence in computer science education and research that nurtures innovative engineers and contributes to the technological growth of the nation.',
  mission:
    'To impart contemporary engineering education that combines fundamentals with hands-on practice, foster industry-relevant research, and develop ethical professionals committed to lifelong learning.',
  hod_message:
    'I welcome you to the Department of Computer Science & Engineering. Our mission is to prepare students for a rapidly evolving technology landscape through rigorous academics, applied research and strong industry collaboration. We are proud of our alumni who serve in leading roles across the global tech industry.',
  hod_name: 'Prof. A. K. Sachan',
  email: 'hod.cse@sgsits.ac.in',
  phone: '+91 731 2582165',
  established: '1986',
  image_url: '/assets/image.png',
  status: 'published',
  updated_at: '2026-05-12',
}

// ── HOD-published Notices (richer schema than DEPT_NOTICES) ──────────
export interface HodNotice {
  id: string
  title: string
  description: string
  category: 'Academic' | 'Administrative' | 'Examination' | 'Event' | 'General'
  audience: 'All' | 'Faculty' | 'Students'
  file_url?: string
  publish_date: string
  expiry_date?: string
  status: ContentStatus
  pinned: boolean
  created_by: string
}

export const HOD_NOTICES: HodNotice[] = [
  { id: 'HN001', title: 'Semester End Exam Invigilation Duty — Sem V',  description: 'All faculty members are requested to check the invigilation roster pinned on the department notice board. Any swap requests should be raised with the HOD office by 28 May 2026.', category: 'Examination',    audience: 'Faculty',  file_url: '/files/invigilation-sem-v.pdf', publish_date: '2026-05-21', expiry_date: '2026-06-30', status: 'published', pinned: true,  created_by: 'HOD Office' },
  { id: 'HN002', title: 'Elective Subject Allocation Sheet — Sem VII',  description: 'Sem VII students are required to fill the elective preference form by 30 May 2026. Forms are available at the department office. Allocation will be released by 5 June 2026.',  category: 'Academic',       audience: 'Students', publish_date: '2026-05-18', expiry_date: '2026-06-05', status: 'published', pinned: true,  created_by: 'HOD Office' },
  { id: 'HN003', title: 'Faculty Development Programme — Applied ML',    description: 'A 5-day FDP on Applied Machine Learning is scheduled from 10 June 2026. Interested faculty may register by 1 June 2026 with the department coordinator.',                          category: 'Event',          audience: 'Faculty',  publish_date: '2026-05-15', expiry_date: '2026-06-01', status: 'published', pinned: false, created_by: 'HOD Office' },
  { id: 'HN004', title: 'Syllabus Revision Committee Meeting',           description: 'A committee meeting for revision of B.E. Sem III–IV syllabus is scheduled on 30 May 2026, 11:00 AM, HOD Chamber. Concerned faculty please remain present.',                       category: 'Administrative', audience: 'Faculty',  publish_date: '2026-05-12', status: 'published', pinned: false, created_by: 'HOD Office' },
  { id: 'HN005', title: 'Department Library — New Arrivals',             description: 'New arrivals: 28 reference titles in AI, Compilers and Distributed Systems. Catalogue is available in the department reading room.',                                            category: 'General',        audience: 'All',      publish_date: '2026-05-08', status: 'published', pinned: false, created_by: 'HOD Office' },
  { id: 'HN006', title: 'Project Viva Schedule — Sem VIII (Draft)',      description: 'Draft schedule for B.E. Sem VIII final project viva. Faculty are requested to confirm slot preferences by 25 May 2026.',                                                           category: 'Academic',       audience: 'Faculty',  publish_date: '2026-05-22', status: 'draft',     pinned: false, created_by: 'HOD Office' },
]

// ── Department Downloads ────────────────────────────────────────────
export interface HodDownload {
  id: string
  title: string
  description: string
  category: 'Syllabus' | 'Lab Manual' | 'Assignment' | 'Question Paper' | 'Reference' | 'Form'
  semester?: number
  file_url: string
  file_size_kb: number
  uploaded_on: string
  uploaded_by: string
  status: ContentStatus
}

export const HOD_DOWNLOADS: HodDownload[] = [
  { id: 'DL001', title: 'B.E. CSE — Sem V Syllabus (Revised 2025)',  description: 'Updated syllabus for Sem V approved by the Academic Council.',     category: 'Syllabus',       semester: 5, file_url: '/files/syllabus-sem-v.pdf',      file_size_kb: 412, uploaded_on: '2026-05-15', uploaded_by: 'HOD Office',                status: 'published' },
  { id: 'DL002', title: 'Operating Systems Lab Manual',              description: 'Complete lab manual for CS501 lab with experiments and rubric.',   category: 'Lab Manual',     semester: 5, file_url: '/files/os-lab-manual.pdf',       file_size_kb: 1208, uploaded_on: '2026-05-10', uploaded_by: 'Prof. Sunita Gupta',         status: 'published' },
  { id: 'DL003', title: 'Data Structures — Assignment 1',            description: 'Assignment on linked lists and trees for Sem III students.',       category: 'Assignment',     semester: 3, file_url: '/files/ds-assignment-1.pdf',     file_size_kb: 188, uploaded_on: '2026-05-05', uploaded_by: 'Dr. Rajesh Kumar Pandey',    status: 'published' },
  { id: 'DL004', title: 'Algorithms — End Sem 2024-25 Question Paper', description: 'Previous year paper for CS401 for student reference.',           category: 'Question Paper', semester: 4, file_url: '/files/algo-2024-25-qp.pdf',     file_size_kb: 322, uploaded_on: '2026-04-28', uploaded_by: 'HOD Office',                status: 'published' },
  { id: 'DL005', title: 'NPTEL Reference List — Sem VII Electives',  description: 'Curated list of NPTEL courses aligned with Sem VII electives.',    category: 'Reference',      semester: 7, file_url: '/files/nptel-sem-vii.pdf',       file_size_kb: 256, uploaded_on: '2026-04-20', uploaded_by: 'HOD Office',                status: 'published' },
  { id: 'DL006', title: 'Internship Permission Form',                description: 'Form for students applying for industry internship.',              category: 'Form',                        file_url: '/files/internship-form.pdf',     file_size_kb: 96,  uploaded_on: '2026-04-10', uploaded_by: 'HOD Office',                status: 'published' },
  { id: 'DL007', title: 'Sem VI Mid-Sem Question Bank',              description: 'Question bank prepared by senior faculty for mid-sem revision.',   category: 'Question Paper', semester: 6, file_url: '/files/sem-vi-qbank.pdf',        file_size_kb: 540, uploaded_on: '2026-05-20', uploaded_by: 'Dr. Mahesh Patil',           status: 'draft' },
]

// ── Department Events ───────────────────────────────────────────────
export interface HodEvent {
  id: string
  title: string
  description: string
  event_type: 'Workshop' | 'FDP' | 'Guest Lecture' | 'Conference' | 'Hackathon' | 'Industrial Visit' | 'Cultural'
  venue: string
  start_date: string
  end_date: string
  organizer: string
  poster_url?: string
  status: ContentStatus
  audience: 'All' | 'Faculty' | 'Students' | 'External'
}

export const HOD_EVENTS: HodEvent[] = [
  { id: 'EV001', title: 'FDP on Applied Machine Learning',      description: '5-day faculty development program covering supervised, unsupervised and reinforcement learning with hands-on Python labs.', event_type: 'FDP',              venue: 'CSE Seminar Hall',    start_date: '2026-06-10', end_date: '2026-06-14', organizer: 'Dr. Priya Saxena',  poster_url: '/files/fdp-ml.png',   status: 'published', audience: 'Faculty' },
  { id: 'EV002', title: 'Guest Lecture — Cloud Security at Scale', description: 'Industry expert from Microsoft Azure team will present current practices in cloud security.',                              event_type: 'Guest Lecture',    venue: 'CR-301',              start_date: '2026-06-04', end_date: '2026-06-04', organizer: 'Prof. Amit Shukla', status: 'published', audience: 'Students' },
  { id: 'EV003', title: 'Hackathon — Code-a-thon 2026',          description: '24-hour hackathon for Sem III–VII students. Themes: sustainability, education, public health.',                              event_type: 'Hackathon',        venue: 'Computer Center',     start_date: '2026-07-12', end_date: '2026-07-13', organizer: 'Coding Club',       status: 'published', audience: 'Students' },
  { id: 'EV004', title: 'Workshop on Generative AI',             description: 'Two-day workshop on building applications with LLMs, RAG and agentic frameworks.',                                          event_type: 'Workshop',         venue: 'AI Lab',              start_date: '2026-06-20', end_date: '2026-06-21', organizer: 'Dr. Priya Saxena',  status: 'published', audience: 'All' },
  { id: 'EV005', title: 'Industrial Visit — Tech Mahindra Pune', description: 'Sem VI industrial visit to Tech Mahindra Pune campus.',                                                                     event_type: 'Industrial Visit', venue: 'Tech Mahindra, Pune', start_date: '2026-08-05', end_date: '2026-08-07', organizer: 'T&P Cell',          status: 'draft',     audience: 'Students' },
]

// ── Department Gallery (albums + images) ────────────────────────────
export interface HodGalleryAlbum {
  id: string
  title: string
  description: string
  cover_url: string
  image_count: number
  created_on: string
  category: 'Event' | 'Lab' | 'Convocation' | 'Cultural' | 'Industrial Visit' | 'Other'
  status: ContentStatus
}

export const HOD_GALLERY: HodGalleryAlbum[] = [
  { id: 'GA001', title: 'Tech Fest 2026 — Day 1',         description: 'Opening day of the annual technical festival hosted by the CSE department.', cover_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', image_count: 48, created_on: '2026-02-20', category: 'Event',              status: 'published' },
  { id: 'GA002', title: 'AI Lab Inauguration',            description: 'Inauguration of the new AI / ML lab funded under TEQIP Phase III.',         cover_url: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400', image_count: 22, created_on: '2026-01-15', category: 'Lab',                status: 'published' },
  { id: 'GA003', title: 'Convocation 2025',                description: 'Photos from the 2025 graduation ceremony.',                                  cover_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400', image_count: 64, created_on: '2025-12-18', category: 'Convocation',        status: 'published' },
  { id: 'GA004', title: 'Industrial Visit — Infosys Mysore', description: 'Sem VII batch visit to the Infosys Mysore campus.',                       cover_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', image_count: 35, created_on: '2025-11-08', category: 'Industrial Visit',   status: 'published' },
  { id: 'GA005', title: 'Cultural Evening — Rhythm 2026',   description: 'CSE participation in the institute cultural fest.',                        cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', image_count: 28, created_on: '2026-02-22', category: 'Cultural',           status: 'draft'     },
]

// ── Labs ────────────────────────────────────────────────────────────
export interface HodLab {
  id: string
  lab_name: string
  description: string
  lab_incharge: string
  equipment_list: string[]
  capacity: number
  room_no: string
  image_url?: string
  status: ContentStatus
}

export const HOD_LABS: HodLab[] = [
  { id: 'LAB001', lab_name: 'Programming Lab — I',     description: 'Foundation programming lab equipped for Sem I–II students. C, C++ and Python practicals.', lab_incharge: 'Prof. Sunita Gupta', equipment_list: ['60 Lenovo workstations (i5/16GB)', 'Smart board', 'Linux + Windows dual boot', 'Visual Studio Code', 'GCC toolchain'], capacity: 60, room_no: 'CR-Lab-101', status: 'published' },
  { id: 'LAB002', lab_name: 'Data Structures Lab',     description: 'Lab for CS303 — Data Structures practicals.',                                              lab_incharge: 'Dr. Rajesh Kumar Pandey', equipment_list: ['50 HP workstations (i5/8GB)', 'Projector', 'GDB / Valgrind debugging suite'], capacity: 50, room_no: 'CR-Lab-201', status: 'published' },
  { id: 'LAB003', lab_name: 'AI / Machine Learning Lab', description: 'High-spec lab with GPU servers for ML and deep learning research.',                       lab_incharge: 'Dr. Priya Saxena',  equipment_list: ['30 Dell Precision workstations (i7/32GB)', '2x NVIDIA RTX A5000 GPU server', 'Jupyter Hub', 'TensorFlow, PyTorch, Hugging Face stack'], capacity: 30, room_no: 'CR-Lab-301', status: 'published' },
  { id: 'LAB004', lab_name: 'Operating Systems Lab',   description: 'Lab for OS practicals — kernel modules, process scheduling, file systems.',                lab_incharge: 'Prof. Sunita Gupta', equipment_list: ['40 HP workstations (i5/16GB)', 'Ubuntu 24.04', 'QEMU / KVM virtualization'], capacity: 40, room_no: 'CR-Lab-302', status: 'published' },
  { id: 'LAB005', lab_name: 'Cloud Computing Lab',     description: 'Dedicated lab for cloud architecture and DevOps practicals.',                              lab_incharge: 'Prof. Amit Shukla', equipment_list: ['25 thin clients', 'AWS Educate access', 'Kubernetes cluster (3 nodes)', 'Jenkins, Terraform, Ansible'], capacity: 25, room_no: 'CR-Lab-303', status: 'published' },
  { id: 'LAB006', lab_name: 'Cyber Security Lab',      description: 'Lab for penetration testing, network forensics and security research.',                   lab_incharge: 'Dr. Mahesh Patil',  equipment_list: ['20 workstations with Kali Linux', 'Isolated network sandbox', 'Wireshark, Metasploit, Burp Suite'], capacity: 20, room_no: 'CR-Lab-304', status: 'draft'     },
]

// ── Achievements ────────────────────────────────────────────────────
export interface HodAchievement {
  id: string
  title: string
  description: string
  achievement_date: string
  category: 'Student' | 'Faculty' | 'Department' | 'Alumni' | 'Research'
  image_url?: string
  link_url?: string
  status: ContentStatus
}

export const HOD_ACHIEVEMENTS: HodAchievement[] = [
  { id: 'AC001', title: 'Smart India Hackathon 2025 — National Winners',     description: 'Team CodeBlooded from CSE Sem VII won the SIH 2025 finale (Health Tech track) with a ₹1L prize.',          achievement_date: '2025-12-18', category: 'Student',    link_url: '#', status: 'published' },
  { id: 'AC002', title: 'NAAC A+ Grade for Institute',                       description: 'SGSITS reaccredited with A+ grade by NAAC; CSE department contributed heavily to the assessment.',         achievement_date: '2025-11-22', category: 'Department',                  status: 'published' },
  { id: 'AC003', title: 'Dr. Priya Saxena — Best Paper Award @ ICCCNT 2026', description: 'Award for the paper "Federated Learning for Healthcare Edge Devices" at the IEEE ICCCNT 2026 conference.', achievement_date: '2026-04-10', category: 'Faculty',    link_url: '#', status: 'published' },
  { id: 'AC004', title: 'Alumni Spotlight — Aarav Sharma at Microsoft IDC',  description: '2024 batch alumnus joins Microsoft IDC as a Senior Software Engineer (Azure team) with a ₹42L package.',    achievement_date: '2026-01-08', category: 'Alumni',                      status: 'published' },
  { id: 'AC005', title: 'DST Research Grant — ₹38 Lakh',                     description: 'Department awarded a 3-year DST grant for research on energy-efficient ML inference on edge devices.',     achievement_date: '2026-02-14', category: 'Research',                    status: 'published' },
  { id: 'AC006', title: 'ACM ICPC — Asia West Regional Top 25',              description: 'Three teams from CSE qualified for the Asia West regional and finished in the top 25.',                    achievement_date: '2025-10-30', category: 'Student',                     status: 'published' },
  { id: 'AC007', title: 'Smart India Internal Hackathon — Spring 2026',     description: 'Internal hackathon held to shortlist teams for SIH 2026.',                                                  achievement_date: '2026-03-15', category: 'Department',                  status: 'draft' },
]

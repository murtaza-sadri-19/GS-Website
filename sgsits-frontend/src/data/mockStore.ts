/**
 * SGSITS Mock Data Store
 * In-memory reactive store with full CRUD.
 * Replace with real API calls when the backend is ready.
 */

// ─── Seed Data Imports ────────────────────────────────────────────────────────
import { mockBrandingConfig, type BrandingConfig } from '../mock/branding/brandingData'
import {
  mockSidebarLinks,
  mockSectionBanners,
  mockDefaultSectionBanner,
  type SidebarLink,
  type SectionBanner,
} from '../mock/sidebar/sidebarData'
import { mockChatbotConfig, type ChatbotConfig } from '../mock/chatbot/chatbotData'
import { mockSeoData, mockDefaultSeoMeta, type SeoMeta } from '../mock/seo/seoData'
import { mockUiLabels, type UiLabelsConfig } from '../mock/uilabels/uiLabelsData'
import { mockHomePageData } from '../mock/home/homeData'
import {
  mockVisionMission,
  mockGoverningBody,
  mockAdministration,
  mockTelephoneDirectory,
  mockIQAC,
  mockAcademicCouncil,
  mockAccreditation,
  mockInfrastructure,
  mockDirectorMessage,
  mockCommittees
} from '../mock/about/aboutData'
import { mockSiteSettings, mockFooterData, mockTopBarData } from '../mock/settings/settingsData'
import { mockNavItems } from '../mock/navbar/navData'
import {
  mockUGCourses,
  mockPGCourses,
  mockPhDCourses,
  mockPTDCCourses,
  mockAcademicCalendar,
  mockOnlineCourses
} from '../mock/academics/academicsData'
import { mockDepartments } from '../mock/departments/departmentsData'
import { mockUGAdmission, mockPGAdmission, mockPhDAdmission, mockProspectus } from '../mock/admission/admissionData'
import {
  mockDeptPlacement,
  mockTNPTeam,
  mockPlacementProcess,
  mockTrainingPrograms,
  mockRecruitingPartners,
  mockPlacementContacts,
  mockPlacementOfficeInfo,
  mockTNPCellInfo,
  mockLeadingCompanies
} from '../mock/placement/placementData'
import {
  mockActivities,
  mockNCC,
  mockNSS,
  mockScholarshipGovt,
  mockScholarshipInstitute,
  mockSSS
} from '../mock/students/studentsData'
import {
  mockLibrary,
  mockBoysHostel,
  mockGirlsHostel,
  mockComputerCenter,
  mockGamesSports,
  mockDispensary,
  mockIDEALab,
  mockGymnasium,
  mockWorkshop,
  mockCIDI,
  mockTransitHostel,
  mockStaffQuarters
} from '../mock/facilities/facilitiesData'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Notice {
  id: string
  title: string
  category: 'academic' | 'administrative' | 'exam' | 'tender' | 'general'
  date: string        // YYYY-MM-DD
  highlight: boolean
  fileUrl?: string
}

export interface NewsItem {
  id: string
  title: string
  category: string
  excerpt: string
  content: string
  image?: string
  date: string
  author: string
}

export interface EventItem {
  id: string
  title: string
  description: string
  venue: string
  date: string        // YYYY-MM-DD
  time: string
  category: string
  image?: string
  registrationUrl?: string
}

export interface Tender {
  id: string
  title: string
  refNo: string
  publishDate: string
  dueDate: string
  status: 'Open' | 'Closed' | 'Extended'
  amount?: string
  fileUrl?: string
}

export interface Alert {
  id: string
  text: string
  isActive: boolean
  priority: number    // 1 = shown first
  link?: string
}

export interface FacultyMember {
  id: string
  name: string
  designation: string
  department: string
  email: string
  phone?: string
  photo?: string
  qualification: string
  specialization: string
  experience: string
  publications: number
}

export interface GalleryAlbum {
  id: string
  title: string
  description: string
  date: string
  coverImage: string
  photos: string[]
  category: string
}

export interface PlacementRecord {
  year: string
  studentsPlaced: number
  companies: number
  highestPackage: string
  averagePackage: string
  topRecruiters: string[]
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const seed_notices: Notice[] = [
  { id: 'n1',  title: 'Information Bulletin regarding B.Tech Admissions 2025-26',         category: 'academic',        date: '2025-05-20', highlight: true, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n2',  title: 'Result of MBA (Financial Administration) II Sem Examination',      category: 'exam',            date: '2025-05-10', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n3',  title: 'Revised Academic Calendar for UG & PG classes 2024-25',            category: 'academic',        date: '2025-05-08', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n4',  title: 'Schedule of Internal Assessment Tests — Even Semester 2025',       category: 'exam',            date: '2025-05-02', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n5',  title: 'Instructions for students regarding uniform and general discipline', category: 'administrative', date: '2025-04-28', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n6',  title: 'Tender notice for laboratory equipment procurement batch 2025',    category: 'tender',          date: '2025-04-20', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n7',  title: 'Notice regarding hostel fee payment deadlines for current session', category: 'administrative', date: '2025-04-15', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n8',  title: 'Ph.D. Admissions open for 2025-26 — apply before June 15',         category: 'academic',        date: '2025-04-10', highlight: true, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'  },
  { id: 'n9',  title: 'National Conference on Emerging Technologies — Call for Papers',    category: 'general',         date: '2025-04-05', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n10', title: 'Scholarship application portal open for SC/ST/OBC students',       category: 'general',         date: '2025-03-28', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n11', title: 'Fee payment deadline for odd semester 2025-26 — July 31',          category: 'administrative',  date: '2025-03-20', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n12', title: 'Postponement of end semester examination — new schedule notified', category: 'exam',            date: '2025-03-15', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n13', title: 'Convocation 2025 registration form — fill by April 25',            category: 'academic',        date: '2025-03-10', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'n14', title: 'Anti-ragging policy 2025 — mandatory acknowledgment form',         category: 'administrative',  date: '2025-03-01', highlight: false, fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
]

const seed_news: NewsItem[] = [
  {
    id: 'nw1',
    title: 'SGSITS secures ₹2.4 Cr DST-SERB grant for renewable energy grid research',
    category: 'Research',
    excerpt: 'Prof. R.K. Nema and team receive prestigious DST-SERB funding to develop intelligent power distribution grids.',
    content: `Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore has achieved a significant milestone in academic research. The Department of Electrical Engineering has been awarded a prestigious research grant of ₹2.4 Crores by the Science and Engineering Research Board (SERB), a statutory body of the Department of Science and Technology (DST), Government of India.

The project, titled "Development of Intelligent and Resilient Power Distribution Grids for Renewable Energy Integration", is led by Principal Investigator Prof. R.K. Nema and his dedicated team of researchers. The primary focus of the research is to build smart power grids capable of seamlessly managing fluctuational inputs from solar, wind, and other renewable sources without compromising grid stability.

### Advancing Smart Grid Infrastructure

The funding will be utilized to set up a state-of-the-art Smart Grid Simulation and Emulation Laboratory at the campus. This facility will host advanced hardware-in-the-loop (HIL) simulators, high-precision power analyzers, and energy storage modeling systems.

Speaking on the occasion, Prof. R.K. Nema stated:

> "As the world transitions to green energy, distribution grids face unprecedented challenges with bidirectional power flows and high harmonics. Our goal is to develop machine learning algorithms that can predict grid instability and automatically reroute power in real-time."

### Collaborative Scope and Outcomes

The project will collaborate with industry partners and leading global laboratories. Over the next three years, the department intends to register multiple patent-pending technologies and train dozens of postgraduate and doctoral scholars, bolstering SGSITS's stature as a premier research hub in Central India.`,
    image: 'https://picsum.photos/seed/sgsfeature/800/500',
    date: '2025-05-15',
    author: 'SGSITS PR Cell'
  },
  {
    id: 'nw2',
    title: 'AI Lab launches NVIDIA Jetson-based autonomous robot research program',
    category: 'Achievement',
    excerpt: 'Students can now build and deploy edge-computing robots for real-world applications.',
    content: `The Department of Computer Engineering at SGSITS has officially inaugurated its advanced Robotics and Edge Computing initiative with the launch of the NVIDIA Jetson-based autonomous robot research program. The initiative aims to equip undergraduate and postgraduate students with hands-on experience in training neural networks for computer vision, localization, and navigation on physical machines.

Thanks to a generous research grant and strategic partnerships, the department has acquired a suite of Jetson Orin Nano and Jetson AGX Xavier developer kits. These units will serve as the artificial "brains" for custom-built quadrupedal and wheeled robotic platforms engineered on campus.

### Bridging Simulation and Reality

Students participating in the program will work on a variety of cutting-edge applications, including autonomous agricultural monitoring, warehouse logistics automation, and search-and-rescue navigation. The lab features a localized motion capture system that allows students to validate their algorithms in a controlled environment before real-world testing.

Dr. Urjita Thakar, Head of Computer Engineering, commented on the deployment:

> "Theoretical understanding of deep learning is only half the battle. By deploying models on physical edge hardware where power, thermal, and compute constraints are very real, our students gain invaluable industrial skills that are highly sought after by deep-tech employers globally."

### Future Milestones

The program's curriculum will be integrated into the elective courses for final-year B.Tech and M.Tech students. In addition, the Robotics Club plans to field an autonomous drone team for the national collegiate robotics competition next spring.`,
    image: 'https://picsum.photos/seed/sgsai25/800/500',
    date: '2025-05-18',
    author: 'Dept. of CE'
  },
  {
    id: 'nw3',
    title: 'Record ₹45 LPA package at Microsoft — highest in state for batch 2025',
    category: 'Achievement',
    excerpt: 'A final-year CE student secured the highest campus placement in MP.',
    content: `In a historic moment for the Training & Placement (T&P) Cell and the entire institute, a final-year Computer Engineering student has secured an extraordinary placement package of ₹45 Lakhs Per Annum (LPA) at Microsoft. This marks the highest campus placement offer received by any student in the state of Madhya Pradesh for the graduation batch of 2025.

The student, Ayush Saxena, cleared a rigorous multi-stage selection process including competitive programming rounds, technical system design interviews, and behavioral assessments to secure the software engineering role at Microsoft's Hyderabad campus.

### Highlighting Academic Excellence

Ayush, who has been an active open-source contributor and leader of the campus coding club, credited his success to the robust curriculum and supportive ecosystem at SGSITS Indore.

> "The mentorship of my professors and the competitive coding environment fostered by my seniors were instrumental. SGSITS provided me with the technical foundation and the confidence to compete with the best minds in the country. The rigorous lab sessions and data structures curriculum helped me ace the Microsoft rounds."

### Overall Placement Success

This record-breaking offer highlights a phenomenal placement season for the institute, with an average package of B.Tech students rising to ₹6.8 LPA. Over 240 companies visited the campus this year, recruiting more than 1,800 students across various disciplines. T&P Officer noted that demand for skills in Cloud Computing, AI/ML, and VLSI Design has seen a dramatic surge, positioning SGSITS as a prime recruitment destination in the region.`,
    image: 'https://picsum.photos/seed/sgspl25/800/500',
    date: '2025-05-12',
    author: 'T&P Cell'
  },
  {
    id: 'nw4',
    title: 'SGSITS cricket team wins inter-university championship 2nd consecutive year',
    category: 'Event',
    excerpt: 'The team defeated rival institutes in a hard-fought final at DAVV ground, Indore.',
    content: `The SGSITS Indore Cricket Team has etched its name in the history books by clinching the Inter-University Cricket Championship for the second consecutive year. In a high-stakes final played at the DAVV Ground under lights, the SGSITS team displayed exemplary sportsmanship and tactical brilliance to defeat their formidable rivals, the Indore Institute of Science and Technology (IIST).

Choosing to bat first, SGSITS put up a massive total of 185 runs in 20 overs, powered by a blistering century from opening batsman and team captain, Rohan Mehta. Mehta hit 8 sixes and 10 boundaries in a masterclass performance that put the opposition on the back foot from the first over.

### Strong Bowling Line-up

Defending the total, the SGSITS bowling attack showed immaculate discipline. Spinner Amit Patel took a crucial 4-wicket haul for just 18 runs in his 4 overs, dismantling the opponent's middle order. IIST was eventually bowled out for 132 runs in 17.4 overs, securing a comfortable 53-run victory for SGSITS.

Speaking at the post-match ceremony, Rohan Mehta said:

> "This victory is a testament to the hard work the boys put in over the last six months. We practiced under tough conditions, and every single member of the squad contributed to this title defense. I want to thank the sports department and our coach for their unwavering faith in us."

### Celebrations on Campus

Upon their return to campus, the team was greeted with a grand reception by Director Dr. R.K. Khare, faculty, and hundreds of students. The institute sports committee announced a special cash prize of ₹1 Lakh for the team in recognition of their outstanding achievement.`,
    image: 'https://picsum.photos/seed/sgssp25/800/500',
    date: '2025-05-05',
    author: 'Sports Committee'
  },
  {
    id: 'nw5',
    title: 'Pharmacy breakthrough: Novel drug carrier approved for oncology trials',
    category: 'Research',
    excerpt: 'Bio-compatibility study paves new avenues for highly target-specific cancer treatments.',
    content: `The Department of Pharmacy at SGSITS Indore has announced a major scientific breakthrough with the development and regulatory approval of a novel lipid-based nanocarrier for highly targeted cancer chemotherapy. The project, funded by the Council of Scientific and Industrial Research (CSIR), has successfully passed initial preclinical trials and has been approved for translational oncology research.

The research centers on creating biocompatible, biodegradable nanoparticles that encapsulate potent chemotherapeutic agents. These nanocarriers are functionalized with specific ligands that bind exclusively to receptors overexpressed on cancer cells, thereby minimizing side effects on healthy tissues.

### Revolutionizing Chemotherapy Administration

Traditional chemotherapy often suffers from poor bioavailability and systemic toxicity. By localizing drug release, the new carrier increases drug concentration at the tumor site by up to 10 times compared to standard delivery methods.

Leading researcher Dr. Ananya Sen explained the significance:

> "Our nanoparticles remain stable in the blood circulation but rapidly disintegrate to release the drug once inside the acidic environment of the cancer cell. This targeted mechanism significantly reduces cardiac and renal toxicity, which are the main limiting factors in patient tolerance during chemotherapy."

### Clinical Trajectory

With IND (Investigational New Drug) clearance from national regulators, the department is preparing to collaborate with regional oncology research centers for clinical trials. The milestone positions SGSITS at the forefront of pharmaceutical nanotechnology research in Central India.`,
    image: 'https://picsum.photos/seed/sgsbio25/800/500',
    date: '2025-04-28',
    author: 'Dept. of Pharmacy'
  },
  {
    id: 'nw6',
    title: 'New ₹8 Cr central instrumentation lab inaugurated by Hon. Governor',
    category: 'Achievement',
    excerpt: 'Facility will support advanced research in materials science and nano-technology.',
    content: `A new chapter in advanced research has begun at SGSITS Indore with the formal inauguration of the state-of-the-art Central Instrumentation Laboratory (CIL). Built at a cost of ₹8 Crores, the multi-disciplinary facility was inaugurated by the Honorable Governor of Madhya Pradesh in a prestigious ceremony attended by leading educationists, scientists, and industry leaders.

The lab is equipped with world-class, high-end scientific equipment including Field Emission Scanning Electron Microscopes (FE-SEM), X-ray Diffractometers (XRD), High-Performance Liquid Chromatographs (HPLC), and Gas Chromatography-Mass Spectrometers (GC-MS). This centralized pool of sophisticated instruments will be accessible to research scholars across Civil, Mechanical, Pharmacy, Applied Physics, and Chemistry departments.

### Elevating Research Capabilities

Previously, research scholars had to send samples to external institutions in other states, leading to long delays and high costs. The local availability of these instruments is expected to accelerate research projects and double the publication output of the institute.

During his address, the Honorable Governor remarked:

> "Facilities like this Central Instrumentation Lab are crucial for realizing our national vision of self-reliance in science and technology. I urge the researchers and students of SGSITS to use these instruments to solve local agricultural, industrial, and environmental challenges facing our state."

### Access and Training

The laboratory will operate on a subsidized model for academic scholars and will also offer commercial testing services to local industries, making the facility self-sustainable. The institute will also conduct regular hands-on training workshops for operating these advanced machines starting next month.`,
    image: 'https://picsum.photos/seed/sgsinf25/800/500',
    date: '2025-04-15',
    author: 'SGSITS PR Cell'
  },
  {
    id: 'nw7',
    title: 'SGSITS ranked #1 in M.P. in NIRF 2025 engineering rankings',
    category: 'Achievement',
    excerpt: 'SGSITS ranked first among all engineering institutions in Madhya Pradesh.',
    content: `Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore has once again proven its academic supremacy by securing the #1 position in Madhya Pradesh in the prestigious National Institutional Ranking Framework (NIRF) 2025 engineering rankings released by the Ministry of Education, Government of India.

The rankings, which evaluate institutions across five broad parameters—Teaching, Learning and Resources (TLR), Research and Professional Practice (RP), Graduation Outcomes (GO), Outreach and Inclusivity (OI), and Perception—placed SGSITS in the top tier nationally, reaffirming its reputation as the premier engineering college in Central India.

### Strong Academic Performance

SGSITS scored exceptionally high in Graduation Outcomes, driven by its stellar placement records, and Teaching & Learning Resources, owing to its highly qualified faculty and smart campus infrastructure. The institute's research publication count and patent filings have also seen a steady 20% year-on-year increase.

Reacting to the achievement, Director Dr. R.K. Khare expressed his gratitude:

> "This top ranking is a reflection of the collective effort of our exceptional faculty, hard-working students, and supportive alumni. Our commitment to academic rigor, industrial integration, and research excellence has consistently borne fruit, and we will continue to strive for higher milestones on the national stage."

### Looking Ahead

The institute has planned several new infrastructural additions, including a smart library complex and virtual classroom networks, to further strengthen its learning resources and push for a top-50 national ranking in the coming years.`,
    image: 'https://picsum.photos/seed/sgsawd25/800/500',
    date: '2025-04-05',
    author: 'Academic Section'
  },
  {
    id: 'nw8',
    title: 'MoU signed with Tata Technologies for student training programs',
    category: 'Industry',
    excerpt: '3-year partnership to provide 500+ students with hands-on automotive and manufacturing training.',
    content: `In a major push towards enhancing student employability and industry readiness, SGSITS Indore has signed a historic Memorandum of Understanding (MoU) with Tata Technologies. The three-year strategic partnership will establish a state-of-the-art Center for Invention, Innovation, Incubation, and Training (CIIIT) at the campus, aimed at providing students with advanced training in automotive, aerospace, and industrial manufacturing engineering.

Under this agreement, Tata Technologies will set up laboratories with cutting-edge software suites (such as CATIA, SolidWorks, and Siemens PLM) and hardware platforms including industrial robotic arms, CNC machines, and 3D printers.

### Bridging the Industry-Academia Gap

The curriculum of the center has been co-developed by academic professors and industry experts from Tata Technologies. Over 500 students will be trained annually across engineering streams, with a focus on Product Lifecycle Management (PLM), Electric Vehicle (EV) technology, and Smart Manufacturing (Industry 4.0).

A senior representative of Tata Technologies commented on the scope of training:

> "We want to ensure that engineering graduates are ready for the shop floor from day one. By exposing SGSITS students to the exact same software, hardware, and methodologies used by top global manufacturers, we are bridging the critical skills gap between academia and the industrial workforce."

### Placement and Internships

As part of the MoU, Tata Technologies will also offer direct internships and placement opportunities to top-performing students trained at the center, significantly boosting high-end engineering careers for SGSITS graduates.`,
    image: 'https://picsum.photos/seed/sgsmou25/800/500',
    date: '2025-03-20',
    author: 'Industry Liaison Cell'
  },
]

const seed_events: EventItem[] = [
  { id: 'ev1', title: 'Institute Day 2025',                      description: 'Grand convocation & prize distribution ceremony for graduating batch 2024-25. Chief Guest: Secretary, AICTE.', venue: 'SGSITS Main Auditorium',        date: '2025-06-15', time: '10:00 AM', category: 'Academic',   image: 'https://picsum.photos/seed/sgsevd1/600/400' },
  { id: 'ev2', title: 'TechFest: Invictus 2025',                description: 'National-level technical competition with 5000+ participants from 120+ colleges.', venue: 'SGSITS Campus',                  date: '2025-06-22', time: '09:00 AM', category: 'Technical',  image: 'https://picsum.photos/seed/sgsevd2/600/400', registrationUrl: '/events' },
  { id: 'ev3', title: 'Campus Placement Drive — TCS & Infosys', description: 'Placement drive for final year B.Tech, MCA & MBA students. Aptitude test followed by technical rounds.', venue: 'Placement Cell, Admin Block', date: '2025-07-05', time: '08:30 AM', category: 'Placement', image: 'https://picsum.photos/seed/sgsevd3/600/400' },
  { id: 'ev4', title: 'Annual Research Symposium 2025',          description: 'PhD scholars present research works; industry leaders invited for collaboration and feedback.', venue: 'Seminar Hall, Academic Block',  date: '2025-07-12', time: '10:00 AM', category: 'Academic',   image: 'https://picsum.photos/seed/sgsevd4/600/400' },
  { id: 'ev5', title: 'Rhythm 2025 — Cultural Festival',         description: '3-day cultural extravaganza with music, dance, drama, and celebrity performances.', venue: 'SGSITS Amphitheatre',            date: '2025-08-20', time: '05:00 PM', category: 'Cultural',   image: 'https://picsum.photos/seed/sgsevd5/600/400' },
  { id: 'ev6', title: 'National Sports Day — Athletics Meet',    description: 'Inter-department athletics meet with track events, field events and combat sports.', venue: 'SGSITS Sports Ground',          date: '2025-08-29', time: '07:00 AM', category: 'Sports',     image: 'https://picsum.photos/seed/sgsevd6/600/400' },
]

const seed_tenders: Tender[] = [
  { id: 't1', title: 'Supply of Laboratory Equipment for ECE Department',          refNo: 'SGSITS/Tender/2025/045', publishDate: '2025-05-10', dueDate: '2025-05-30', status: 'Open',   amount: '₹12,00,000' },
  { id: 't2', title: 'Annual Maintenance Contract for Computer Center (2025–26)',  refNo: 'SGSITS/Tender/2025/039', publishDate: '2025-04-25', dueDate: '2025-05-20', status: 'Open',   amount: '₹4,50,000'  },
  { id: 't3', title: 'Mess Catering Services for Boys & Girls Hostels',            refNo: 'SGSITS/Tender/2025/032', publishDate: '2025-04-10', dueDate: '2025-04-30', status: 'Closed', amount: '₹38,00,000' },
  { id: 't4', title: 'Civil Works — Renovation of Administrative Block',           refNo: 'SGSITS/Tender/2025/028', publishDate: '2025-03-20', dueDate: '2025-04-10', status: 'Closed', amount: '₹75,00,000' },
  { id: 't5', title: 'Supply of Furniture for New Classroom Block',                refNo: 'SGSITS/Tender/2025/051', publishDate: '2025-05-18', dueDate: '2025-06-10', status: 'Open',   amount: '₹8,50,000'  },
]

const seed_alerts: Alert[] = [
  { id: 'al1', text: 'B.Tech Admissions 2025-26 Information Bulletin now available', isActive: true,  priority: 1, link: '/notices' },
  { id: 'al2', text: 'Rolling Advertisement No SGSITS/R/3/2025 — visit sgsits.ac.in for applications', isActive: true, priority: 2, link: '/notices' },
  { id: 'al3', text: 'End Semester Examinations begin June 1, 2025 — Check timetable on notice board', isActive: true, priority: 3, link: '/notices' },
  { id: 'al4', text: 'TechFest Invictus 2025 — Register now before June 10!', isActive: false, priority: 4, link: '/events' },
]

const seed_faculty: FacultyMember[] = [
  { id: 'f1', name: 'Dr. Urjita Thakar',   designation: 'Professor & Head',    department: 'Computer Engineering',            email: 'thakarurjita@gmail.com',    phone: '0731-2582401', photo: '', qualification: 'Ph.D (IIT Bombay)',   specialization: 'Distributed Systems, Network Security', experience: '24 years', publications: 42 },
  { id: 'f2', name: 'Dr. K.K. Sharma',     designation: 'Professor & Head',    department: 'Information Technology',          email: 'kkssgs@gmail.com',          phone: '0731-2582260', photo: '', qualification: 'Ph.D (SGSITS)',       specialization: 'Database Systems, Data Mining',         experience: '26 years', publications: 35 },
  { id: 'f3', name: 'Dr. R.K. Khare',      designation: 'Professor & Head',    department: 'Civil Engineering',               email: 'rakeshkhare@hotmail.com',   phone: '0731-2582310', photo: '', qualification: 'Ph.D (IIT Roorkee)',  specialization: 'Structural Analysis, Seismic Engineering', experience: '29 years', publications: 68 },
  { id: 'f4', name: 'Dr. H.K. Verma',      designation: 'Professor & Head',    department: 'Electrical Engineering',          email: 'hverma@sgsits.ac.in',       phone: '0731-2582350', photo: '', qualification: 'Ph.D (IIT Kanpur)',   specialization: 'Power Systems, Renewable Energy',       experience: '24 years', publications: 51 },
  { id: 'f5', name: 'Dr. Satish Jain',     designation: 'Professor & Head',    department: 'Electronics & Telecommunication', email: 'satishjain.jain@gmail.com', phone: '0731-2582451', photo: '', qualification: 'Ph.D (IIT Delhi)',    specialization: 'VLSI Design, Signal Processing',        experience: '25 years', publications: 44 },
  { id: 'f6', name: 'Dr. P.K. Mishra',     designation: 'Professor',           department: 'Mechanical Engineering',          email: 'pkmishra@sgsits.ac.in',     phone: '0731-2582280', photo: '', qualification: 'Ph.D (IIT Bombay)',   specialization: 'Thermal Engineering, Fluid Mechanics',  experience: '22 years', publications: 38 },
  { id: 'f7', name: 'Dr. Neha Gupta',      designation: 'Associate Professor', department: 'Computer Engineering',            email: 'nehagupta@sgsits.ac.in',    phone: '',             photo: '', qualification: 'Ph.D (MANIT Bhopal)', specialization: 'Machine Learning, IoT',                 experience: '15 years', publications: 29 },
  { id: 'f8', name: 'Dr. A.K. Patidar',    designation: 'Professor & Head',    department: 'Applied Mathematics',             email: 'akpatidar@sgsits.ac.in',    phone: '0731-2582200', photo: '', qualification: 'Ph.D (IIT Bombay)',   specialization: 'Numerical Analysis, Graph Theory',      experience: '21 years', publications: 47 },
]

const seed_albums: GalleryAlbum[] = [
  { id: 'ga1', title: 'Convocation 2024',          description: '71st Annual Convocation — degree distribution to graduating batch 2023-24.', date: '2024-11-15', coverImage: 'https://picsum.photos/seed/sgsalb1/800/600', photos: Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/sgsalb1p${i}/600/400`), category: 'Convocation' },
  { id: 'ga2', title: 'TechFest Invictus 2024',    description: 'National-level technical festival with 4000+ participants from 100+ colleges.', date: '2024-09-20', coverImage: 'https://picsum.photos/seed/sgsalb2/800/600', photos: Array.from({ length: 10 }, (_, i) => `https://picsum.photos/seed/sgsalb2p${i}/600/400`), category: 'Technical Fest' },
  { id: 'ga3', title: 'Sports Day 2024',            description: 'Annual inter-department athletics meet and sports championship.', date: '2024-08-29', coverImage: 'https://picsum.photos/seed/sgsalb3/800/600', photos: Array.from({ length: 8  }, (_, i) => `https://picsum.photos/seed/sgsalb3p${i}/600/400`), category: 'Sports' },
  { id: 'ga4', title: 'Rhythm Cultural Fest 2024', description: '3-day cultural extravaganza with music, dance, drama and celebrity performances.', date: '2024-02-20', coverImage: 'https://picsum.photos/seed/sgsalb4/800/600', photos: Array.from({ length: 15 }, (_, i) => `https://picsum.photos/seed/sgsalb4p${i}/600/400`), category: 'Cultural' },
  { id: 'ga5', title: 'Campus Views',              description: 'A visual tour of SGSITS — buildings, labs, gardens and sports facilities.', date: '2024-01-01', coverImage: 'https://picsum.photos/seed/sgsalb5/800/600', photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/seed/sgsalb5p${i}/600/400`), category: 'Campus' },
  { id: 'ga6', title: 'Industry Visit — Infosys',  description: 'Students from CE & IT visit Infosys Pune campus for industrial exposure.', date: '2024-03-10', coverImage: 'https://picsum.photos/seed/sgsalb6/800/600', photos: Array.from({ length: 6  }, (_, i) => `https://picsum.photos/seed/sgsalb6p${i}/600/400`), category: 'Academic' },
]

const seed_placement: PlacementRecord[] = [
  { year: '2023-24', studentsPlaced: 1820, companies: 245, highestPackage: '₹45 LPA', averagePackage: '₹6.8 LPA', topRecruiters: ['Microsoft', 'TCS', 'Infosys', 'Wipro', 'L&T', 'DRDO', 'Capgemini', 'HCL'] },
  { year: '2022-23', studentsPlaced: 1650, companies: 210, highestPackage: '₹38 LPA', averagePackage: '₹5.9 LPA', topRecruiters: ['Amazon', 'Cognizant', 'TCS', 'Wipro', 'Bosch', 'BPCL', 'Infosys', 'HCL'] },
  { year: '2021-22', studentsPlaced: 1540, companies: 190, highestPackage: '₹32 LPA', averagePackage: '₹5.2 LPA', topRecruiters: ['TCS', 'Infosys', 'Wipro', 'L&T', 'DRDO', 'Tech Mahindra', 'Capgemini'] },
  { year: '2020-21', studentsPlaced: 1380, companies: 165, highestPackage: '₹28 LPA', averagePackage: '₹4.8 LPA', topRecruiters: ['TCS', 'Infosys', 'Wipro', 'HCL', 'L&T', 'DRDO', 'ONGC'] },
  { year: '2019-20', studentsPlaced: 1290, companies: 148, highestPackage: '₹22 LPA', averagePackage: '₹4.1 LPA', topRecruiters: ['TCS', 'Cognizant', 'Infosys', 'L&T', 'BHEL', 'HCL', 'Accenture'] },
]

const seed_about_institute = {
  narrativeParagraphs: [
    "Shri G. S. Institute of Technology & Science (SGSITS), Indore was established in 1952 by the Late Seth Shri Govindram Seksaria, a renowned industrialist and philanthropist. The institute is recognized as one of the premier technical institutions in Central India and has been a beacon of technical education and research excellence for over seven decades.",
    "SGSITS is a Government-Aided Autonomous Institute, jointly affiliated with Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal and Devi Ahilya Vishwavidyalaya (DAVV), Indore. The institute was granted autonomous status in 1989, giving it the academic agility to design its own industry-centric curriculum, conduct examinations, and pioneer cutting-edge engineering modules.",
    "Spread over a vibrant 52-acre campus in the heart of Indore city, SGSITS offers undergraduate, postgraduate, and doctoral programs across 17 departments spanning engineering, technology, sciences, pharmacy, and management disciplines. The institute is proudly accredited by NAAC with Grade A and several of its flagship programs are accredited by the National Board of Accreditation (NBA).",
    "With a focus on Outcome-Based Education, SGSITS is dedicated to fostering a culture of research, innovation, and ethical leadership, developing competent professionals ready to make a significant global impact."
  ],
  highlights: [
    { iconName: 'Building2', label: 'Established', value: '1952', desc: 'Over 70 years of academic legacy' },
    { iconName: 'Users', label: 'Faculty Members', value: '200+', desc: 'Experienced mentors & researchers' },
    { iconName: 'GraduationCap', label: 'Enrolled Students', value: '3,00,000+', desc: 'Across undergraduate and postgraduate studies' },
    { iconName: 'Award', label: 'NAAC Accreditation', value: 'Grade A', desc: 'Recognized for top-tier academic standards' },
    { iconName: 'BookOpen', label: 'Departments', value: '17', desc: 'Diverse disciplines in sciences & technology' },
    { iconName: 'Globe', label: 'Campus Size', value: '52 Acres', desc: 'Lush urban campus in the heart of Indore' }
  ],
  affiliations: [
    'Affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal',
    'Affiliated to Devi Ahilya Vishwavidyalaya (DAVV), Indore',
    'Approved by All India Council for Technical Education (AICTE), New Delhi',
    'Accredited by National Assessment and Accreditation Council (NAAC) — Grade A',
    'Core engineering programs accredited by National Board of Accreditation (NBA)',
    'Recognized by UGC under Section 2(f) and 12(B) of UGC Act',
    'Consistently ranked among the top tier engineering institutes in Central India'
  ]
}

const seed_departments_expanded = mockDepartments.map(d => {
  let category: 'engineering' | 'science' | 'other' = 'other'
  if (['computer-engineering', 'information-technology', 'civil-engineering', 'mechanical-engineering', 'electrical-engineering', 'electronics-instrumentation', 'electronics-telecommunication', 'industrial-production', 'biomedical-engineering'].includes(d.slug)) {
    category = 'engineering'
  } else if (['applied-chemistry', 'applied-mathematics', 'applied-physics', 'humanities'].includes(d.slug)) {
    category = 'science'
  }
  
  return {
    slug: d.slug,
    name: d.name,
    shortName: d.shortName,
    category,
    hodName: d.hodName,
    hodEmail: d.hodEmail,
    hodPhone: d.hodPhone || '',
    programsOffered: d.programsOffered,
    facultyCount: d.facultyCount,
    isActive: d.isActive,
    established: '1952',
    status: 'published' as const,
    description: `Fostering engineering breakthroughs, industrial leadership, and comprehensive research in ${d.shortName} sciences since the establishment.`,
    aboutParagraphs: [
      `The Department of ${d.name} at Shri G. S. Institute of Technology & Science remains a cornerstone of scholastic excellence. The division offers premium engineering tracks coupled with robust research infrastructure, ensuring that graduating students possess elite design skills, theoretical expertise, and practical insight.`
    ],
    infraHighlights: [
      "Dedicated Department Computer Center",
      "Advanced Hardware / Research Laboratories",
      "Comprehensive Reference Library with 5000+ volumes",
      "High-Speed Wi-Fi & LAN connectivity (10 Gbps backbone)"
    ],
    programsIntake: [
      `B.Tech / B.Pharma (4-Year Degree) - ${d.programsOffered.includes('UG') ? '120 Intake' : 'N/A'}`,
      `M.Tech / M.Pharma / MBA (2-Year Degree) - ${d.programsOffered.includes('PG') ? '18-25 Intake' : 'N/A'}`,
      `Ph.D (Doctoral Research) - ${d.programsOffered.includes('PhD') ? 'Active Scholars' : 'N/A'}`,
      `Part-Time Degree Courses (PTDC) - ${d.programsOffered.includes('PTDC') ? 'Active Schemes' : 'N/A'}`
    ],
    vision: `To emerge as a premier center of technical education and research in ${d.shortName} sciences, creating ethically sound professionals equipped to handle global industrial demands.`,
    mission: `Providing rich academic environments through advanced labs and Outcome-Based curriculums, fostering collaborative industrial projects, and instilling technical values conducive to social prosperity.`,
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop"
  }
})

const defaultCustomPages = [
  {
    slug: 'history',
    menu: 'about',
    title: 'Glorious Legacy & History',
    subtitle: 'Celebrating over seven decades of technical education and research excellence',
    narrativeParagraphs: [
      'Established in 1952, Shri Govindram Seksaria Institute of Technology & Science (SGSITS), Indore stands as one of Central India\'s oldest and most prestigious institutions of technical learning.',
      'Founded by the Late Seth Shri Govindram Seksaria, a visionary industrialist and philanthropist, the institute has nurtured generations of engineers, researchers, and global leaders.',
      'Our autonomous framework enables us to continuously innovate, designing courses that respond dynamically to the requirements of the global technosphere.'
    ],
    highlights: [
      { iconName: 'Award', label: 'Legacy', value: '70+ Years', desc: 'Pioneering technical innovation since 1952' }
    ],
    affiliations: [
      'Approved by AICTE, New Delhi',
      'Affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal'
    ]
  }
]

// ─── LocalStorage Helper ──────────────────────────────────────────────────────

const readLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
  } catch (e) {
    console.error('Error reading localStorage key', key, e)
  }
  try {
    localStorage.setItem(key, JSON.stringify(defaultValue))
  } catch (e) {
    console.error('Error writing default to localStorage key', key, e)
  }
  return defaultValue
}

const writeLocal = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Error writing to localStorage key', key, e)
  }
}

const uid = () => Math.random().toString(36).slice(2, 10)

export const mockStore = {
  // Notices
  getNotices: (): Notice[] => readLocal('sgsits_notices', seed_notices),
  addNotice: (d: Omit<Notice, 'id'>): Notice => {
    const notices = readLocal('sgsits_notices', seed_notices)
    const n = { ...d, id: uid() }
    writeLocal('sgsits_notices', [n, ...notices])
    return n
  },
  updateNotice: (id: string, d: Partial<Notice>): void => {
    const notices = readLocal('sgsits_notices', seed_notices)
    writeLocal('sgsits_notices', notices.map(n => n.id === id ? { ...n, ...d } : n))
  },
  deleteNotice: (id: string): void => {
    const notices = readLocal('sgsits_notices', seed_notices)
    writeLocal('sgsits_notices', notices.filter(n => n.id !== id))
  },

  // News
  getNews: (): NewsItem[] => readLocal('sgsits_news', seed_news),
  addNews: (d: Omit<NewsItem, 'id'>): NewsItem => {
    const news = readLocal('sgsits_news', seed_news)
    const n = { ...d, id: uid() }
    writeLocal('sgsits_news', [n, ...news])
    return n
  },
  updateNews: (id: string, d: Partial<NewsItem>): void => {
    const news = readLocal('sgsits_news', seed_news)
    writeLocal('sgsits_news', news.map(n => n.id === id ? { ...n, ...d } : n))
  },
  deleteNews: (id: string): void => {
    const news = readLocal('sgsits_news', seed_news)
    writeLocal('sgsits_news', news.filter(n => n.id !== id))
  },

  // Events
  getEvents: (): EventItem[] => readLocal('sgsits_events', seed_events),
  addEvent: (d: Omit<EventItem, 'id'>): EventItem => {
    const events = readLocal('sgsits_events', seed_events)
    const e = { ...d, id: uid() }
    writeLocal('sgsits_events', [...events, e])
    return e
  },
  updateEvent: (id: string, d: Partial<EventItem>): void => {
    const events = readLocal('sgsits_events', seed_events)
    writeLocal('sgsits_events', events.map(e => e.id === id ? { ...e, ...d } : e))
  },
  deleteEvent: (id: string): void => {
    const events = readLocal('sgsits_events', seed_events)
    writeLocal('sgsits_events', events.filter(e => e.id !== id))
  },

  // Tenders
  getTenders: (): Tender[] => readLocal('sgsits_tenders', seed_tenders),
  addTender: (d: Omit<Tender, 'id'>): Tender => {
    const tenders = readLocal('sgsits_tenders', seed_tenders)
    const t = { ...d, id: uid() }
    writeLocal('sgsits_tenders', [t, ...tenders])
    return t
  },
  updateTender: (id: string, d: Partial<Tender>): void => {
    const tenders = readLocal('sgsits_tenders', seed_tenders)
    writeLocal('sgsits_tenders', tenders.map(t => t.id === id ? { ...t, ...d } : t))
  },
  deleteTender: (id: string): void => {
    const tenders = readLocal('sgsits_tenders', seed_tenders)
    writeLocal('sgsits_tenders', tenders.filter(t => t.id !== id))
  },

  // Alerts
  getAlerts: (): Alert[] => readLocal('sgsits_alerts', seed_alerts),
  addAlert: (d: Omit<Alert, 'id'>): Alert => {
    const alerts = readLocal('sgsits_alerts', seed_alerts)
    const a = { ...d, id: uid() }
    writeLocal('sgsits_alerts', [...alerts, a])
    return a
  },
  updateAlert: (id: string, d: Partial<Alert>): void => {
    const alerts = readLocal('sgsits_alerts', seed_alerts)
    writeLocal('sgsits_alerts', alerts.map(a => a.id === id ? { ...a, ...d } : a))
  },
  deleteAlert: (id: string): void => {
    const alerts = readLocal('sgsits_alerts', seed_alerts)
    writeLocal('sgsits_alerts', alerts.filter(a => a.id !== id))
  },

  // Faculty
  getFaculty: (): FacultyMember[] => readLocal('sgsits_faculty', seed_faculty),
  addFaculty: (d: Omit<FacultyMember, 'id'>): FacultyMember => {
    const faculty = readLocal('sgsits_faculty', seed_faculty)
    const f = { ...d, id: uid() }
    writeLocal('sgsits_faculty', [...faculty, f])
    return f
  },
  updateFaculty: (id: string, d: Partial<FacultyMember>): void => {
    const faculty = readLocal('sgsits_faculty', seed_faculty)
    writeLocal('sgsits_faculty', faculty.map(f => f.id === id ? { ...f, ...d } : f))
  },
  deleteFaculty: (id: string): void => {
    const faculty = readLocal('sgsits_faculty', seed_faculty)
    writeLocal('sgsits_faculty', faculty.filter(f => f.id !== id))
  },

  // Gallery Albums
  getAlbums: (): GalleryAlbum[] => readLocal('sgsits_albums', seed_albums),
  addAlbum: (d: Omit<GalleryAlbum, 'id'>): GalleryAlbum => {
    const albums = readLocal('sgsits_albums', seed_albums)
    const a = { ...d, id: uid() }
    writeLocal('sgsits_albums', [a, ...albums])
    return a
  },
  updateAlbum: (id: string, d: Partial<GalleryAlbum>): void => {
    const albums = readLocal('sgsits_albums', seed_albums)
    writeLocal('sgsits_albums', albums.map(a => a.id === id ? { ...a, ...d } : a))
  },
  deleteAlbum: (id: string): void => {
    const albums = readLocal('sgsits_albums', seed_albums)
    writeLocal('sgsits_albums', albums.filter(a => a.id !== id))
  },

  // Placement
  getPlacement: (): PlacementRecord[] => readLocal('sgsits_placement', seed_placement),
  updatePlacementYear: (year: string, d: PlacementRecord): void => {
    const placement = readLocal('sgsits_placement', seed_placement)
    writeLocal('sgsits_placement', placement.map(r => r.year === year ? { ...r, ...d } : r))
  },
  deletePlacementYear: (year: string): void => {
    const placement = readLocal('sgsits_placement', seed_placement)
    writeLocal('sgsits_placement', placement.filter(r => r.year !== year))
  },

  // Homepage Data CMS
  getHomePageData: (): any => readLocal('sgsits_homepage', mockHomePageData),
  saveHomePageData: (data: any): void => writeLocal('sgsits_homepage', data),

  // About Section Data CMS
  getVisionMission: (): any => readLocal('sgsits_about_vision_mission', mockVisionMission),
  saveVisionMission: (data: any): void => writeLocal('sgsits_about_vision_mission', data),

  getGoverningBody: (): any => readLocal('sgsits_about_governing_body', mockGoverningBody),
  saveGoverningBody: (data: any): void => writeLocal('sgsits_about_governing_body', data),

  getAdministration: (): any => readLocal('sgsits_about_administration', mockAdministration),
  saveAdministration: (data: any): void => writeLocal('sgsits_about_administration', data),

  getTelephoneDirectory: (): any => readLocal('sgsits_about_telephone_directory', mockTelephoneDirectory),
  saveTelephoneDirectory: (data: any): void => writeLocal('sgsits_about_telephone_directory', data),

  getIQAC: (): any => readLocal('sgsits_about_iqac', mockIQAC),
  saveIQAC: (data: any): void => writeLocal('sgsits_about_iqac', data),

  getAcademicCouncil: (): any => readLocal('sgsits_about_academic_council', mockAcademicCouncil),
  saveAcademicCouncil: (data: any): void => writeLocal('sgsits_about_academic_council', data),

  getAccreditation: (): any => readLocal('sgsits_about_accreditation', mockAccreditation),
  saveAccreditation: (data: any): void => writeLocal('sgsits_about_accreditation', data),

  getInfrastructure: (): any => readLocal('sgsits_about_infrastructure', mockInfrastructure),
  saveInfrastructure: (data: any): void => writeLocal('sgsits_about_infrastructure', data),

  // Settings Data CMS
  getSiteSettings: (): any => readLocal('sgsits_settings_site_settings', mockSiteSettings),
  saveSiteSettings: (data: any): void => writeLocal('sgsits_settings_site_settings', data),

  getTopBarData: (): any => readLocal('sgsits_settings_topbar', mockTopBarData),
  saveTopBarData: (data: any): void => writeLocal('sgsits_settings_topbar', data),

  getFooterData: (): any => readLocal('sgsits_settings_footer', mockFooterData),
  saveFooterData: (data: any): void => writeLocal('sgsits_settings_footer', data),

  // Academics Data CMS
  getUGCourses: (): any => readLocal('sgsits_academics_ug', mockUGCourses),
  saveUGCourses: (data: any): void => writeLocal('sgsits_academics_ug', data),

  getPGCourses: (): any => readLocal('sgsits_academics_pg', mockPGCourses),
  savePGCourses: (data: any): void => writeLocal('sgsits_academics_pg', data),

  getPhDCourses: (): any => readLocal('sgsits_academics_phd', mockPhDCourses),
  savePhDCourses: (data: any): void => writeLocal('sgsits_academics_phd', data),

  getPTDCCourses: (): any => readLocal('sgsits_academics_ptdc', mockPTDCCourses),
  savePTDCCourses: (data: any): void => writeLocal('sgsits_academics_ptdc', data),

  getAcademicCalendar: (): any => readLocal('sgsits_academics_calendar', mockAcademicCalendar),
  saveAcademicCalendar: (data: any): void => writeLocal('sgsits_academics_calendar', data),

  getOnlineCourses: (): any => readLocal('sgsits_academics_online', mockOnlineCourses),
  saveOnlineCourses: (data: any): void => writeLocal('sgsits_academics_online', data),

  getAboutInstitute: (): any => readLocal('sgsits_about_institute', seed_about_institute),
  saveAboutInstitute: (data: any): void => writeLocal('sgsits_about_institute', data),

  getDirectorMessage: (): any => readLocal('sgsits_about_director_message', mockDirectorMessage),
  saveDirectorMessage: (data: any): void => writeLocal('sgsits_about_director_message', data),

  getCommittees: (): any => readLocal('sgsits_about_committees', mockCommittees),
  saveCommittees: (data: any): void => writeLocal('sgsits_about_committees', data),

  getNavItems: (): any => {
    const navs = readLocal('sgsits_navigation_items', mockNavItems)
    if (Array.isArray(navs) && !navs.some((n: any) => n.label === 'More')) {
      const moreItem = mockNavItems.find(n => n.label === 'More')
      if (moreItem) {
        const updated = [...navs.filter(n => n.label !== 'More'), moreItem]
        writeLocal('sgsits_navigation_items', updated)
        return updated
      }
    }
    return navs
  },
  saveNavItems: (data: any): void => writeLocal('sgsits_navigation_items', data),

  // Departments CRUD
  getDepartments: (): any[] => readLocal('sgsits_departments', seed_departments_expanded),
  saveDepartments: (data: any[]): void => writeLocal('sgsits_departments', data),
  getDepartmentBySlug: (slug: string): any => {
    const list = readLocal('sgsits_departments', seed_departments_expanded)
    return list.find((d: any) => d.slug === slug) ?? null
  },
  saveDepartmentBySlug: (slug: string, data: any): void => {
    const list = readLocal('sgsits_departments', seed_departments_expanded)
    writeLocal('sgsits_departments', list.map((d: any) => d.slug === slug ? { ...d, ...data } : d))
  },

  // Custom pages CRUD
  getCustomPages: (): any[] => readLocal('sgsits_custom_pages', defaultCustomPages),
  saveCustomPages: (data: any[]): void => writeLocal('sgsits_custom_pages', data),
  getCustomPage: (slug: string): any => {
    const list = readLocal('sgsits_custom_pages', defaultCustomPages)
    return list.find((p: any) => p.slug === slug) ?? null
  },
  saveCustomPage: (slug: string, data: any): void => {
    const list = readLocal('sgsits_custom_pages', defaultCustomPages)
    writeLocal('sgsits_custom_pages', list.map((p: any) => p.slug === slug ? { ...p, ...data } : p))
  },
  addCustomPage: (data: any): void => {
    const list = readLocal('sgsits_custom_pages', defaultCustomPages)
    writeLocal('sgsits_custom_pages', [...list, { ...data, id: uid() }])
  },
  deleteCustomPage: (slug: string): void => {
    const list = readLocal('sgsits_custom_pages', defaultCustomPages)
    writeLocal('sgsits_custom_pages', list.filter((p: any) => p.slug !== slug))
  },

  // Admissions CMS Data
  getUGAdmission: (): any => readLocal('sgsits_admission_ug', mockUGAdmission),
  saveUGAdmission: (data: any): void => writeLocal('sgsits_admission_ug', data),

  getPGAdmission: (): any => readLocal('sgsits_admission_pg', mockPGAdmission),
  savePGAdmission: (data: any): void => writeLocal('sgsits_admission_pg', data),

  getPhDAdmission: (): any => readLocal('sgsits_admission_phd', mockPhDAdmission),
  savePhDAdmission: (data: any): void => writeLocal('sgsits_admission_phd', data),

  getProspectus: (): any => readLocal('sgsits_admission_prospectus', mockProspectus),
  saveProspectus: (data: any): void => writeLocal('sgsits_admission_prospectus', data),

  // Placements CMS Data
  savePlacement: (data: any[]): void => writeLocal('sgsits_placement', data),

  getDeptPlacement: (): any[] => readLocal('sgsits_placement_dept', mockDeptPlacement),
  saveDeptPlacement: (data: any[]): void => writeLocal('sgsits_placement_dept', data),

  getTNPTeam: (): any[] => readLocal('sgsits_placement_team', mockTNPTeam),
  saveTNPTeam: (data: any[]): void => writeLocal('sgsits_placement_team', data),

  getPlacementProcess: (): any[] => readLocal('sgsits_placement_process', mockPlacementProcess),
  savePlacementProcess: (data: any[]): void => writeLocal('sgsits_placement_process', data),

  getTrainingPrograms: (): string[] => readLocal('sgsits_placement_training', mockTrainingPrograms),
  saveTrainingPrograms: (data: string[]): void => writeLocal('sgsits_placement_training', data),

  getRecruitingPartners: (): string[] => readLocal('sgsits_placement_partners', mockRecruitingPartners),
  saveRecruitingPartners: (data: string[]): void => writeLocal('sgsits_placement_partners', data),

  getPlacementContacts: (): any[] => readLocal('sgsits_placement_contacts', mockPlacementContacts),
  savePlacementContacts: (data: any[]): void => writeLocal('sgsits_placement_contacts', data),

  getPlacementOfficeInfo: (): any => readLocal('sgsits_placement_office', mockPlacementOfficeInfo),
  savePlacementOfficeInfo: (data: any): void => writeLocal('sgsits_placement_office', data),

  getTNPCellInfo: (): any => readLocal('sgsits_placement_cell_info', mockTNPCellInfo),
  saveTNPCellInfo: (data: any): void => writeLocal('sgsits_placement_cell_info', data),

  getLeadingCompanies: (): any[] => readLocal('sgsits_placement_companies', mockLeadingCompanies),
  saveLeadingCompanies: (data: any[]): void => writeLocal('sgsits_placement_companies', data),

  // Campus Life / Students CMS Data
  getActivities: (): any => readLocal('sgsits_students_activities', mockActivities),
  saveActivities: (data: any): void => writeLocal('sgsits_students_activities', data),

  getNCC: (): any => readLocal('sgsits_students_ncc', mockNCC),
  saveNCC: (data: any): void => writeLocal('sgsits_students_ncc', data),

  getNSS: (): any => readLocal('sgsits_students_nss', mockNSS),
  saveNSS: (data: any): void => writeLocal('sgsits_students_nss', data),

  getScholarshipGovt: (): any => readLocal('sgsits_students_scholarship_govt', mockScholarshipGovt),
  saveScholarshipGovt: (data: any): void => writeLocal('sgsits_students_scholarship_govt', data),

  getScholarshipInstitute: (): any => readLocal('sgsits_students_scholarship_institute', mockScholarshipInstitute),
  saveScholarshipInstitute: (data: any): void => writeLocal('sgsits_students_scholarship_institute', data),

  getSSS: (): any => readLocal('sgsits_students_sss', mockSSS),
  saveSSS: (data: any): void => writeLocal('sgsits_students_sss', data),

  // Facilities CMS Data
  getLibrary: (): any => readLocal('sgsits_facility_library', mockLibrary),
  saveLibrary: (data: any): void => writeLocal('sgsits_facility_library', data),

  getBoysHostel: (): any => readLocal('sgsits_facility_boys_hostel', mockBoysHostel),
  saveBoysHostel: (data: any): void => writeLocal('sgsits_facility_boys_hostel', data),

  getGirlsHostel: (): any => readLocal('sgsits_facility_girls_hostel', mockGirlsHostel),
  saveGirlsHostel: (data: any): void => writeLocal('sgsits_facility_girls_hostel', data),

  getComputerCenter: (): any => readLocal('sgsits_facility_computer_center', mockComputerCenter),
  saveComputerCenter: (data: any): void => writeLocal('sgsits_facility_computer_center', data),

  getGamesSports: (): any => readLocal('sgsits_facility_games_sports', mockGamesSports),
  saveGamesSports: (data: any): void => writeLocal('sgsits_facility_games_sports', data),

  getDispensary: (): any => readLocal('sgsits_facility_dispensary', mockDispensary),
  saveDispensary: (data: any): void => writeLocal('sgsits_facility_dispensary', data),

  getIDEALab: (): any => readLocal('sgsits_facility_idea_lab', mockIDEALab),
  saveIDEALab: (data: any): void => writeLocal('sgsits_facility_idea_lab', data),

  getGymnasium: (): any => readLocal('sgsits_facility_gymnasium', mockGymnasium),
  saveGymnasium: (data: any): void => writeLocal('sgsits_facility_gymnasium', data),

  getWorkshop: (): any => readLocal('sgsits_facility_workshop', mockWorkshop),
  saveWorkshop: (data: any): void => writeLocal('sgsits_facility_workshop', data),

  getCIDI: (): any => readLocal('sgsits_facility_cidi', mockCIDI),
  saveCIDI: (data: any): void => writeLocal('sgsits_facility_cidi', data),

  getTransitHostel: (): any => readLocal('sgsits_facility_transit_hostel', mockTransitHostel),
  saveTransitHostel: (data: any): void => writeLocal('sgsits_facility_transit_hostel', data),

  getStaffQuarters: (): any => readLocal('sgsits_facility_staff_quarters', mockStaffQuarters),
  saveStaffQuarters: (data: any): void => writeLocal('sgsits_facility_staff_quarters', data),

  // ─── Branding & Identity ──────────────────────────────────────────────────
  getBranding: (): BrandingConfig => readLocal('sgsits_branding', mockBrandingConfig),
  saveBranding: (data: BrandingConfig): void => writeLocal('sgsits_branding', data),

  // ─── Sidebar Navigation & Section Banners ────────────────────────────────
  getSidebarLinks: (section: string): SidebarLink[] =>
    (readLocal('sgsits_sidebar_links', mockSidebarLinks) as Record<string, SidebarLink[]>)[section] ?? [],
  getAllSidebarLinks: (): Record<string, SidebarLink[]> =>
    readLocal('sgsits_sidebar_links', mockSidebarLinks),
  saveAllSidebarLinks: (data: Record<string, SidebarLink[]>): void =>
    writeLocal('sgsits_sidebar_links', data),
  saveSidebarLinks: (section: string, links: SidebarLink[]): void => {
    const all = readLocal('sgsits_sidebar_links', mockSidebarLinks) as Record<string, SidebarLink[]>
    writeLocal('sgsits_sidebar_links', { ...all, [section]: links })
  },

  getSectionBanner: (section: string): SectionBanner =>
    ((readLocal('sgsits_section_banners', mockSectionBanners) as Record<string, SectionBanner>)[section]
      ?? mockDefaultSectionBanner),
  getAllSectionBanners: (): Record<string, SectionBanner> =>
    readLocal('sgsits_section_banners', mockSectionBanners),
  saveAllSectionBanners: (data: Record<string, SectionBanner>): void =>
    writeLocal('sgsits_section_banners', data),
  saveSectionBanner: (section: string, banner: SectionBanner): void => {
    const all = readLocal('sgsits_section_banners', mockSectionBanners) as Record<string, SectionBanner>
    writeLocal('sgsits_section_banners', { ...all, [section]: banner })
  },

  // ─── Chatbot Configuration ────────────────────────────────────────────────
  getChatbotConfig: (): ChatbotConfig => readLocal('sgsits_chatbot_config', mockChatbotConfig),
  saveChatbotConfig: (data: ChatbotConfig): void => writeLocal('sgsits_chatbot_config', data),

  // ─── Per-Page SEO Metadata ────────────────────────────────────────────────
  getPageSeo: (pageKey: string): SeoMeta => {
    const all = readLocal('sgsits_seo_data', mockSeoData) as Record<string, SeoMeta>
    return all[pageKey] ?? { ...mockDefaultSeoMeta, pageKey }
  },
  getAllPageSeo: (): Record<string, SeoMeta> =>
    readLocal('sgsits_seo_data', mockSeoData),
  savePageSeo: (pageKey: string, seo: SeoMeta): void => {
    const all = readLocal('sgsits_seo_data', mockSeoData) as Record<string, SeoMeta>
    writeLocal('sgsits_seo_data', { ...all, [pageKey]: seo })
  },
  saveAllPageSeo: (data: Record<string, SeoMeta>): void =>
    writeLocal('sgsits_seo_data', data),

  // ─── Global UI Labels ─────────────────────────────────────────────────────
  getUiLabels: (): UiLabelsConfig => readLocal('sgsits_ui_labels', mockUiLabels),
  saveUiLabels: (data: UiLabelsConfig): void => writeLocal('sgsits_ui_labels', data),
}

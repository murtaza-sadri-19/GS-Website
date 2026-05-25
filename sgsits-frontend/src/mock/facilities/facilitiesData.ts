/**
 * MOCK: Facilities Pages Data
 * Replace with: GET /api/facilities/*
 *
 * Consumed ONLY through src/services/facilitiesService.ts
 */

// ─── Central Library ─────────────────────────────────────────────────────────

export interface LibraryCollection {
  label: string
  value: string
}

export interface EResource {
  name: string
  url: string
  desc: string
}

export interface BorrowingRule {
  category: string
  books: number
  period: string
}

export interface LibraryData {
  intro: string
  email: string
  phone: string
  openingHours: string
  collections: LibraryCollection[]
  eResources: EResource[]
  borrowingRules: BorrowingRule[]
}

export const mockLibrary: LibraryData = {
  intro: 'The Central Library of SGSITS is a comprehensive knowledge resource centre spread over two floors of the main academic building. With over 50,000 books, thousands of bound journals, and access to premium international e-resources, the library supports the academic, research, and professional growth of all students and faculty. The library is fully automated using the KOHA Library Management System with an Online Public Access Catalogue (OPAC) for instant book search.',
  email: 'library@sgsits.ac.in',
  phone: '0731-2582700',
  openingHours: 'Mon–Sat: 8:00 AM – 8:00 PM | Sun: 9:00 AM – 2:00 PM',
  collections: [
    { label: 'Books & Textbooks',    value: '50,000+' },
    { label: 'Bound Journals',       value: '5,000+'  },
    { label: 'E-Journals (Online)',  value: '10,000+' },
    { label: 'CD/DVD Resources',     value: '2,000+'  },
    { label: 'Theses & Dissertations', value: '800+' },
    { label: 'Newspaper Subscriptions', value: '12'  },
  ],
  eResources: [
    { name: 'IEEE Xplore Digital Library', url: 'https://ieeexplore.ieee.org', desc: 'Technical papers, journals, and standards from IEEE' },
    { name: 'Elsevier ScienceDirect',      url: 'https://www.sciencedirect.com', desc: 'Science, technology and medicine full-text articles' },
    { name: 'Springer Link',               url: 'https://link.springer.com',    desc: 'Research in science, humanities and social sciences' },
    { name: 'ASCE Library',                url: 'https://ascelibrary.org',       desc: 'Civil engineering research and standards' },
    { name: 'DELNET',                      url: 'https://delnet.in',             desc: 'National network for library resource sharing' },
    { name: 'NPTEL Lectures',              url: 'https://nptel.ac.in',           desc: 'IIT and IISc video lectures for all engineering branches' },
  ],
  borrowingRules: [
    { category: 'B.Tech / B.Pharm Students',         books: 4,  period: '15 days' },
    { category: 'M.Tech / M.Pharm / MBA Students',   books: 6,  period: '15 days' },
    { category: 'Ph.D. Scholars',                    books: 8,  period: '30 days' },
    { category: 'Faculty Members',                   books: 10, period: '90 days' },
    { category: 'Staff Members',                     books: 4,  period: '30 days' },
  ],
}

// ─── Boys Hostel ─────────────────────────────────────────────────────────────

export interface HostelBlock {
  name: string
  capacity: number
  rooms: string
  year: string
}

export interface HostelData {
  intro: string
  wardenName: string
  wardenEmail: string
  wardenPhone: string
  totalCapacity: string
  stats: { label: string; value: string }[]
  blocks: HostelBlock[]
  amenities: string[]
}

export const mockBoysHostel: HostelData = {
  intro: 'SGSITS provides 4 boys hostels with a total accommodation capacity of 800+ students within the campus. The hostels are managed by the Hostel Administration under the Dean Student Welfare. Each hostel has a resident warden (faculty member), support staff, and a student Hostel Committee for day-to-day operations.',
  wardenName: 'Prof. N.K. Joshi',
  wardenEmail: 'chiefwarden@sgsits.ac.in',
  wardenPhone: '0731-2582800',
  totalCapacity: '800+',
  stats: [
    { label: 'Hostel Blocks',        value: '4'    },
    { label: 'Capacity (Students)',  value: '800+' },
    { label: 'Security & Support',   value: '24×7' },
  ],
  blocks: [
    { name: 'Hostel-1 (Old Block)', capacity: 200, rooms: 'Double & Triple Sharing', year: 'Established 1965' },
    { name: 'Hostel-2',             capacity: 200, rooms: 'Double Sharing (preferred)', year: 'Established 1980' },
    { name: 'Hostel-3 (New Block)', capacity: 250, rooms: 'Double & Triple Sharing', year: 'Established 2005' },
    { name: 'Hostel-4 (PG Hostel)', capacity: 150, rooms: 'Single & Double for PG scholars', year: 'Established 2010' },
  ],
  amenities: [
    'Furnished rooms with bed, table, chair, and cupboard',
    'Wi-Fi connectivity in all rooms (BSNL campus network)',
    'Common mess with veg and non-veg options (hygienic, FSSAI compliant)',
    'Reading room — open till 11:00 PM',
    'Common room with TV and indoor games (TT, Carrom, Chess)',
    'Laundry facility within premises',
    '24×7 security with CCTV surveillance',
    'Generator backup for power cuts',
    'Hot water facility in bathrooms (solar-powered)',
    'Medical first-aid kit in each hostel',
  ],
}

export const mockGirlsHostel: HostelData = {
  intro: 'SGSITS provides 2 girls hostels within the campus for female students. The hostels are managed by a lady warden and support staff, ensuring a safe and comfortable residential experience.',
  wardenName: 'Dr. S. Mishra (Lady Warden)',
  wardenEmail: 'girlshostel@sgsits.ac.in',
  wardenPhone: '0731-2582802',
  totalCapacity: '400+',
  stats: [
    { label: 'Hostel Blocks',       value: '2'    },
    { label: 'Capacity (Students)', value: '400+' },
    { label: 'Security',            value: '24×7' },
  ],
  blocks: [
    { name: 'Girls Hostel-1', capacity: 200, rooms: 'Double & Triple Sharing', year: 'Established 1990' },
    { name: 'Girls Hostel-2 (New)', capacity: 200, rooms: 'Double Sharing', year: 'Established 2015' },
  ],
  amenities: [
    'Furnished rooms with bed, table, chair, and cupboard',
    'High-speed Wi-Fi connectivity',
    'Common mess with healthy meal options',
    'Reading room — open till 11:00 PM',
    'Common room with TV and indoor games',
    '24×7 security with lady security guards and CCTV',
    'Generator backup for power cuts',
    'Hot water facility (solar + electric backup)',
    'Medical first-aid facility',
    'In-campus dispensary access',
  ],
}

// ─── Computer Center ──────────────────────────────────────────────────────────

export interface ComputerCenterData {
  intro: string
  email: string
  phone: string
  stats: { label: string; value: string }[]
  services: string[]
  software: string[]
}

export const mockComputerCenter: ComputerCenterData = {
  intro: 'The Computer Centre (CC) of SGSITS is the central IT infrastructure hub of the campus. It provides high-performance computing facilities, internet access, and software licenses to all students, researchers, and faculty members.',
  email: 'cc@sgsits.ac.in',
  phone: '0731-2582402',
  stats: [
    { label: 'Computers',         value: '300+' },
    { label: 'Internet Speed',    value: '1 Gbps' },
    { label: 'Wi-Fi Coverage',    value: 'Campus-wide' },
    { label: 'Operating Hours',   value: '8AM–9PM' },
  ],
  services: [
    'High-speed internet access for students and faculty',
    'Campus-wide Wi-Fi (indoor and outdoor)',
    'Virtual computing labs for software practicals',
    'Online examination platform',
    'SGSITS ERP — academic, examination, and payroll modules',
    'Email hosting for institute IDs',
    'Digital notice board and campus communication system',
  ],
  software: [
    'MATLAB & Simulink', 'AutoCAD', 'ANSYS', 'SolidWorks',
    'Visual Studio', 'Eclipse IDE', 'Android Studio',
    'Microsoft Office 365', 'Ubuntu Linux', 'Oracle DB',
  ],
}

// ─── Games & Sports ───────────────────────────────────────────────────────────

export interface SportsFacilityItem {
  name: string
  description: string
}

export interface GamesSportsData {
  intro: string
  sportsFacilities: SportsFacilityItem[]
  achievements: string[]
  contactName: string
  contactEmail: string
  contactPhone: string
}

export const mockGamesSports: GamesSportsData = {
  intro: 'SGSITS has a sprawling sports infrastructure that supports over 20 sports disciplines. The institute has produced state and national-level athletes and regularly participates in inter-university tournaments.',
  sportsFacilities: [
    { name: 'Cricket Ground',          description: 'Full-size cricket ground with a turf wicket and net practice area.' },
    { name: 'Football Field',          description: 'Standard football field with flood lights for evening practice.' },
    { name: 'Basketball Courts',       description: '2 cemented courts for outdoor basketball.' },
    { name: 'Volleyball Courts',       description: '2 volleyball courts for regular practice and tournaments.' },
    { name: 'Tennis Courts',           description: '2 hard tennis courts with standard net facilities.' },
    { name: 'Badminton Courts',        description: '4 indoor badminton courts in the Sports Complex.' },
    { name: 'Table Tennis Hall',       description: 'Dedicated TT hall with 6 tables.' },
    { name: 'Gymnasium',               description: 'Fully-equipped gym with cardio, weight training, and yoga space.' },
    { name: 'Athletics Track',         description: '400m athletics track for running events.' },
    { name: 'Chess Room',              description: 'Indoor chess room for tournaments and training.' },
  ],
  achievements: [
    'Inter-University Cricket Champions 2025',
    'State-level Football Championship — Runner-up 2024',
    'National-level Chess Championship — Qualifier 2025',
    'RGPV Inter-University Athletics — Multiple gold medals 2024',
  ],
  contactName: 'Dr. R.S. Chouhan (Sports Officer)',
  contactEmail: 'sports@sgsits.ac.in',
  contactPhone: '0731-2582120',
}

// ─── Dispensary ───────────────────────────────────────────────────────────────

export interface DispensaryData {
  intro: string
  timings: string
  emergencyPhone: string
  email: string
  services: string[]
  staffList: { role: string; name: string }[]
}

export const mockDispensary: DispensaryData = {
  intro: 'The campus health centre (dispensary) provides first-aid, OPD services, and basic health care to students and staff. Emergency medical assistance is available round the clock.',
  timings: 'OPD: Mon–Sat 9:00 AM – 5:00 PM | Emergency: 24×7',
  emergencyPhone: '0731-2582801',
  email: 'healthcenter@sgsits.ac.in',
  services: [
    'General OPD consultations',
    'First aid and emergency care',
    'Ambulance facility for major emergencies',
    'Medicine dispensing for common ailments',
    'Dental consultation (visiting)',
    'Eye check-up camps (periodic)',
    'Blood pressure, blood sugar, BMI monitoring',
    'Mental health counselling sessions',
  ],
  staffList: [
    { role: 'Medical Officer',       name: 'Dr. A.K. Mishra' },
    { role: 'Assistant Doctor',      name: 'Dr. S. Rao' },
    { role: 'Nursing Staff (2)',      name: 'Nursing Team' },
    { role: 'Pharmacist',            name: 'Mr. R. Sharma' },
  ],
}

// ─── IDEA Lab ────────────────────────────────────────────────────────────────

export interface IDEALabData {
  about: string
  stats: { label: string; value: string }[]
  equipment: string[]
  programs: string[]
  contactEmail: string
}

export const mockIDEALab: IDEALabData = {
  about: 'The IDEA Lab (Idea, Design, Experiment, and Application Lab) at SGSITS is a state-of-the-art innovation hub set up under AICTE guidelines. It provides students with a collaborative space to prototype, experiment, and build innovative solutions.',
  stats: [
    { label: 'Area',             value: '3000 sq ft'  },
    { label: 'Workstations',     value: '40+'         },
    { label: '3D Printers',      value: '4'           },
    { label: 'Open to students', value: 'Daily'       },
  ],
  equipment: [
    '3D Printers (FDM & SLA)',
    'Laser Cutter and Engraver',
    'CNC Router',
    'Soldering Stations and PCB Prototyping',
    'Arduino, Raspberry Pi, ESP32 kits',
    'Oscilloscopes and Signal Generators',
    'VR Headsets for design visualization',
    'High-performance design workstations',
  ],
  programs: [
    'Design Thinking Workshops',
    'Product Prototyping Bootcamps',
    'IoT and Embedded Systems Hackathons',
    'Industry Mentorship Sessions',
    'Startup Ideation Programs',
  ],
  contactEmail: 'idealab@sgsits.ac.in',
}

// ─── Gymnasium ────────────────────────────────────────────────────────────────
export interface GymnasiumData {
  about: string
  stats: { label: string; value: string }[]
  equipment: string[]
  timings: { slot: string; time: string }[]
  contactEmail: string
  contactPhone: string
}
export const mockGymnasium: GymnasiumData = {
  about: 'The SGSITS Gymnasium is a well-equipped fitness and wellness facility available free of charge to all enrolled students and at nominal charges to staff members. A qualified and certified physical trainer is present during all operating hours.',
  stats: [
    { label: 'Gym Area', value: '3,000 sq ft' },
    { label: 'Cardio Machines', value: '12+' },
    { label: 'Open Daily', value: '5 AM – 8 PM' },
  ],
  equipment: [
    'Treadmills (6 units)', 'Elliptical Cross Trainers (4 units)', 'Exercise Bikes (4 units)',
    'Multi-Station Gym Machine', 'Free Weights & Dumbbells (5 kg – 40 kg)', 'Barbell & Squat Rack',
    'Rowing Machine', 'Pull-up / Dip Station', 'Yoga Mats & Stretching Area',
    'Abdomen Bench & Leg Press', 'Boxing Bag', 'Battle Ropes',
  ],
  timings: [
    { slot: 'Boys — Morning', time: '6:00 AM – 8:00 AM' },
    { slot: 'Girls — Morning', time: '8:00 AM – 9:00 AM' },
    { slot: 'All — Afternoon', time: '1:00 PM – 3:00 PM' },
    { slot: 'Boys — Evening', time: '5:00 PM – 8:00 PM' },
    { slot: 'Girls — Evening', time: '3:00 PM – 5:00 PM' },
  ],
  contactEmail: 'sports@sgsits.ac.in',
  contactPhone: '0731-2582310',
}

// ─── Central Workshop ─────────────────────────────────────────────────────────
export interface WorkshopShop {
  name: string
  desc: string
}
export interface WorkshopData {
  about: string
  shops: WorkshopShop[]
  modernEquipment: string[]
  timings: { day: string; hours: string }[]
  contactEmail: string
  contactPhone: string
}
export const mockWorkshop: WorkshopData = {
  about: 'The Central Workshop of SGSITS is a mandatory practical training facility for all first-year engineering students. It spans 6 fully equipped shop sections covering traditional and modern manufacturing processes.',
  shops: [
    { name: 'Fitting Shop', desc: 'Filing, chipping, drilling, and surface finishing using hand tools and bench vices' },
    { name: 'Carpentry Shop', desc: 'Wood working, joints, furniture construction and pattern making' },
    { name: 'Welding Shop', desc: 'Arc welding (MIG, TIG), gas welding, soldering, and brazing' },
    { name: 'Foundry & Smithy', desc: 'Sand casting, pattern making, forging and heat treatment processes' },
    { name: 'Machine Shop', desc: 'Lathe, milling, drilling, shaping, and grinding machines' },
    { name: 'Sheet Metal Shop', desc: 'Sheet metal cutting, bending, punching, and forming' },
  ],
  modernEquipment: [
    'CNC Turning Centre (2 machines)', 'CNC Milling Machine', '3D FDM Printers',
    'Laser Cutting Machine', 'Computer-Aided Manufacturing (CAM) workstations',
    'Universal Testing Machine (UTM)', 'Tool Room with precision measurement instruments',
    'Metrology Lab with CMM (Coordinate Measuring Machine)',
  ],
  timings: [
    { day: 'Working Days', hours: '9:00 AM – 5:00 PM' },
    { day: 'Saturday', hours: '9:00 AM – 1:00 PM' },
    { day: 'Sunday & Holidays', hours: 'Closed' },
  ],
  contactEmail: 'workshop@sgsits.ac.in',
  contactPhone: '0731-2582320',
}

// ─── CIDI ────────────────────────────────────────────────────────────────────
export interface CIDIProgram {
  title: string
  desc: string
  freq: string
}
export interface CIDIData {
  about: string
  stats: { label: string; value: string }[]
  facilities: string[]
  programs: CIDIProgram[]
  contactEmail: string
  contactPhone: string
}
export const mockCIDI: CIDIData = {
  about: 'The Centre for Innovation, Design & Incubation (CIDI) at SGSITS is the institute dedicated innovation hub, providing end-to-end support for students and faculty who want to turn ideas into products.',
  stats: [
    { label: 'Incubated Startups', value: '10+' },
    { label: 'Co-work Desks', value: '40+' },
    { label: 'Seed Funding Facilitated', value: '₹50L+' },
    { label: 'Mentors Network', value: '50+' },
  ],
  facilities: [
    'Co-working space with 40+ hot-desks and dedicated startup bays',
    '3D Printers (FDM & SLA) for rapid prototyping',
    'Electronics prototyping lab with oscilloscopes, soldering stations',
    'IoT development kits — Arduino, Raspberry Pi, ESP32, NodeMCU',
    'PCB fabrication facility',
    'High-speed internet (1 Gbps) and video conferencing room',
    'Presentation and mentorship meeting rooms',
    'Library with startup, entrepreneurship and business books',
  ],
  programs: [
    { title: 'Idea Pitching Bootcamp', desc: 'Monthly sessions where students pitch business ideas to industry mentors and investors', freq: 'Monthly' },
    { title: 'Startup Incubation Program', desc: '6-month mentored incubation with seed funding assistance and market entry support', freq: 'Bi-annual' },
    { title: 'IPR & Patent Workshop', desc: 'Guidance on filing patents, copyrights, and trademarks for student innovations', freq: 'Quarterly' },
    { title: 'Hackathon & Smart India', desc: 'Internal qualifying rounds for Smart India Hackathon and AICTE competitions', freq: 'Annual' },
  ],
  contactEmail: 'cidi@sgsits.ac.in',
  contactPhone: '0731-2582160',
}

// ─── Transit Hostel ───────────────────────────────────────────────────────────
export interface TransitHostelData {
  about: string
  stats: { label: string; value: string }[]
  amenities: string[]
  timings: string
  contactEmail: string
  contactPhone: string
}
export const mockTransitHostel: TransitHostelData = {
  about: 'The SGSITS Transit Hostel provides short-term accommodation for visiting faculty, researchers, and official guests of the institute.',
  stats: [
    { label: 'Rooms', value: '20+' },
    { label: 'Type', value: 'Single/Double' },
    { label: 'Availability', value: 'On Request' },
  ],
  amenities: [
    'AC and non-AC room options',
    'Attached bathrooms',
    'Wi-Fi connectivity',
    'Breakfast and meals on request',
    '24×7 security',
    'Parking facility',
  ],
  timings: 'Check-in: 12:00 PM | Check-out: 11:00 AM | Reception: 24×7',
  contactEmail: 'transit@sgsits.ac.in',
  contactPhone: '0731-2582803',
}

// ─── Staff Quarters ───────────────────────────────────────────────────────────
export interface StaffQuartersData {
  about: string
  stats: { label: string; value: string }[]
  amenities: string[]
  contactEmail: string
  contactPhone: string
}
export const mockStaffQuarters: StaffQuartersData = {
  about: 'SGSITS provides residential quarters within the campus for teaching and non-teaching staff, ensuring convenient and comfortable accommodation close to the workplace.',
  stats: [
    { label: 'Quarters', value: '80+' },
    { label: 'Types', value: 'Type A/B/C/D' },
    { label: 'Allotment', value: 'Seniority-based' },
  ],
  amenities: [
    'Independent residential units for faculty families',
    'Piped water supply and underground drainage',
    'Campus-wide Wi-Fi access',
    '24×7 security with CCTV coverage',
    "Children's park and recreational space",
    'Power backup for essential services',
  ],
  contactEmail: 'estate@sgsits.ac.in',
  contactPhone: '0731-2582900',
}

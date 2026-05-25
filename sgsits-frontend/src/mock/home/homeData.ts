/**
 * MOCK: Home Page Content (CMS)
 * Replace with: GET /api/content/home
 *
 * Consumed ONLY through src/services/contentService.ts.
 *
 * Future CMS admin panel will allow:
 *  • enable/disable each section
 *  • reorder sections
 *  • edit all text fields
 *  • change images/icons
 *  • SEO meta per page
 */

// ─── Section-level types ─────────────────────────────────────────────────────

export interface HeroSection {
  instituteName: string
  welcomeText: string
  accentText: string          // rendered in gold italic
  imageUrl: string            // CSS variable or URL
  imagePosition: string       // e.g. 'center 28%'
}

export interface HeroTileData {
  id: number
  title: string
  subtitle: string
  iconName: string            // key into ICON_MAP in the component
  dark: boolean               // true = navy background, false = white background
  path: string
  enabled: boolean
  order: number
}

export interface AboutSection {
  label: string               // "Introduction"
  heading: string             // "ABOUT"
  accentText: string          // "SGSITS INDORE"
  body: string
  primaryButton: { label: string; to: string }
  secondaryButton: { label: string; to: string }
}

export interface DirectorSection {
  label: string               // "Leadership Message"
  heading: string             // "DIRECTOR'S"
  accentText: string          // "CORNER"
  name: string
  photo: string
  bio: string
  readMoreLabel: string
  readMoreTo: string
}

export interface AnnouncementItem {
  id: string
  title: string
  date: string                // display string e.g. "May 10, 2025" or "New"
  isNew: boolean
  to: string
}

export interface NewsSectionConfig {
  label: string               // "Campus Journalism"
  heading: string             // "CAMPUS"
  accentText: string          // "NEWS"
  description: string
}

export interface AcademicProgram {
  id: string
  iconName: string
  title: string
  description: string
  to: string
  ctaLabel: string
}

export interface AcademicProgramsSection {
  label: string
  heading: string
  accentText: string
  description: string
  programs: AcademicProgram[]
}

export interface DepartmentsSection {
  label: string
  heading: string
  accentText: string
  showAllLink: string
  items: { name: string; slug: string }[]
}

export interface StatItem {
  val: string
  label: string
}

export interface StatsSection {
  backgroundImage: string
  fallbackImage: string
  items: StatItem[]
}

export interface FacilityCard {
  id: string
  title: string
  description: string
  iconName: string
  imageUrl: string
  to: string
}

export interface CampusLifeSection {
  label: string
  heading: string
  accentText: string
  description: string
  facilities: FacilityCard[]
}

export interface FaqItem {
  id: string
  question: string
  answer?: string | null
  contact?: { name: string; phone: string; email: string } | null
  defaultOpen?: boolean
}

export interface FaqsSection {
  heading: string
  subLabel: string
  viewAllLink: string
  items: FaqItem[]
}

export interface GallerySection {
  heading: string
  accentText: string
  subLabel: string
  viewAllLink: string
}

export interface HomePageSectionMeta {
  id: string
  type: string
  enabled: boolean
  order: number
}

export interface HomePageData {
  meta: {
    title: string
    description: string
    keywords: string
  }
  sections: HomePageSectionMeta[]
  hero: HeroSection
  heroTiles: HeroTileData[]
  about: AboutSection
  director: DirectorSection
  announcements: AnnouncementItem[]
  newsSection: NewsSectionConfig
  academicsSection: AcademicProgramsSection
  departmentsSection: DepartmentsSection
  statsSection: StatsSection
  campusLifeSection: CampusLifeSection
  faqsSection: FaqsSection
  gallerySection: GallerySection
  preFooter?: {
    imageUrl: string
    label: string
  }
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockHomePageData: HomePageData = {

  meta: {
    title: 'SGSITS Indore — Welcome to Shri G.S. Institute of Technology & Science',
    description: 'SGSITS Indore is a premier autonomous engineering institution offering UG, PG and PhD programs in engineering, technology and management.',
    keywords: 'SGSITS, Indore, engineering college, autonomous institute, B.Tech, M.Tech, MBA, PhD, Madhya Pradesh',
  },

  // ── Section Config — admin can enable/disable and reorder homepage sections ──
  // Types: 'hero' | 'about' | 'news' | 'academics' | 'departments' | 'stats' | 'campus_life' | 'faqs_gallery'
  // Note: 'hero' renders both the hero banner AND the hero tiles (they are visually coupled).
  //       'about' renders the About blurb, Director's Corner, and Announcements panel.
  //       'faqs_gallery' renders the FAQs column and Photo Gallery column together.
  sections: [
    { id: 'hero',         type: 'hero',          enabled: true, order: 1 },
    { id: 'about',        type: 'about',         enabled: true, order: 2 },
    { id: 'news',         type: 'news',          enabled: true, order: 3 },
    { id: 'academics',    type: 'academics',     enabled: true, order: 4 },
    { id: 'departments',  type: 'departments',   enabled: true, order: 5 },
    { id: 'stats',        type: 'stats',         enabled: true, order: 6 },
    { id: 'campus_life',  type: 'campus_life',   enabled: true, order: 7 },
    { id: 'faqs_gallery', type: 'faqs_gallery',  enabled: true, order: 8 },
  ],

  hero: {
    instituteName: 'Shri G. S. Institute of Technology & Science',
    welcomeText: 'Welcome To SGSITS',
    accentText: 'Indore',
    imageUrl: 'var(--hero-img-url)',
    imagePosition: 'center 28%',
  },

  heroTiles: [
    { id: 1, title: 'Research',        subtitle: 'Mapping the Innovations',         iconName: 'FlaskConical', dark: false, path: '/about/iqac',        enabled: true, order: 1 },
    { id: 2, title: 'Startups',        subtitle: 'Success stories of researchers',  iconName: 'Rocket',       dark: true,  path: '/startup-cell',       enabled: true, order: 2 },
    { id: 3, title: 'News',            subtitle: 'Panorama of Events',              iconName: 'Newspaper',    dark: false, path: '/news',               enabled: true, order: 3 },
    { id: 4, title: 'SGSITS Outreach', subtitle: 'Innovate. Inspire. Transform.',   iconName: 'Landmark',     dark: true,  path: '/about/institute',    enabled: true, order: 4 },
  ],

  about: {
    label: 'Introduction',
    heading: 'ABOUT',
    accentText: 'SGSITS INDORE',
    body: 'Shri G. S. Institute of Technology & Science (SGSITS) is one of the premier technical institutions created to be Centres of Excellence for training, research and development in science, engineering and technology in India. Established as College of Engineering in 1952, the Institute was later declared an autonomous Institution of National standing, with powers to decide its own academic policy, conduct its own examinations, and award its own degrees.',
    primaryButton:   { label: 'Read More', to: '/about/institute' },
    secondaryButton: { label: 'Notices',   to: '/notices' },
  },

  director: {
    label: 'Leadership Message',
    heading: "DIRECTOR'S",
    accentText: 'CORNER',
    name: 'Prof. Neetesh Purohit',
    photo: '/director.jpeg',
    bio: 'Prof. Neetesh Purohit has taken over charge as Director, SGSITS Indore with effect from the forenoon of 15th February, 2024. Under his leadership the institute continues to scale new heights in research, placements and academic excellence.',
    readMoreLabel: 'Read Message',
    readMoreTo: '/about/director-message',
  },

  announcements: [
    { id: 'ann1', title: 'Information Bulletin regarding B.Tech Admissions 2025-26',              date: 'New',          isNew: true,  to: '/notices' },
    { id: 'ann2', title: 'Result of MBA (Financial Administration) II Sem Examination',          date: 'May 10, 2025', isNew: false, to: '/notices' },
    { id: 'ann3', title: 'Revised Academic Calendar for UG & PG classes 2024-25',               date: 'May 08, 2025', isNew: false, to: '/notices' },
    { id: 'ann4', title: 'Schedule of Internal Assessment Tests (Even Semester)',                date: 'May 02, 2025', isNew: false, to: '/notices' },
    { id: 'ann5', title: 'Instruction for students regarding uniform and general discipline',    date: 'Apr 28, 2025', isNew: false, to: '/notices' },
    { id: 'ann6', title: 'Tender notice for laboratory equipment procurement',                   date: 'Apr 20, 2025', isNew: false, to: '/notices' },
    { id: 'ann7', title: 'Notice regarding hostel fee payment deadlines for current students',   date: 'Apr 15, 2025', isNew: false, to: '/notices' },
  ],

  newsSection: {
    label: 'Campus Journalism',
    heading: 'CAMPUS',
    accentText: 'NEWS',
    description: 'Stories of research breakthroughs, student achievements, and academic excellence.',
  },

  academicsSection: {
    label: 'Academics',
    heading: 'ACADEMIC',
    accentText: 'PROGRAMS',
    description: 'Rigorous, comprehensive, and outcome-oriented educational journeys designed to cultivate leaders.',
    programs: [
      {
        id: 'prog-ug',
        iconName: 'BookOpen',
        title: 'Undergraduate Programs',
        description: 'Four-year B.Tech and B.Pharm degrees built on core engineering principles, practical lab exposure, and direct industry research.',
        to: '/academics/courses/ug',
        ctaLabel: 'Explore UG Degrees',
      },
      {
        id: 'prog-pg',
        iconName: 'GraduationCap',
        title: 'Postgraduate Programs',
        description: 'M.Tech, M.E., MBA, and MCA programs designed for deeper industrial expertise, technical leadership, and practical analytical mastery.',
        to: '/academics/courses/pg',
        ctaLabel: 'Explore PG Degrees',
      },
      {
        id: 'prog-phd',
        iconName: 'Microscope',
        title: 'Doctoral & Research',
        description: 'Rigorous Ph.D. programs across technical sciences supported by advanced laboratories, instrumentation centres, and government grants.',
        to: '/academics/courses/phd',
        ctaLabel: 'Explore Research Paths',
      },
    ],
  },

  departmentsSection: {
    label: 'Departments & Schools',
    heading: 'ACADEMIC',
    accentText: 'DEPARTMENTS',
    showAllLink: '/departments',
    items: [
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
    ],
  },

  statsSection: {
    backgroundImage: '/assets/campus.jpg',
    fallbackImage: 'https://picsum.photos/seed/sgsitscampus/1600/600',
    items: [
      { val: '10,000+', label: 'Students' },
      { val: '600+',    label: 'Faculty' },
      { val: '700+',    label: 'Staff' },
      { val: '70+',     label: 'Years of Excellence' },
    ],
  },

  campusLifeSection: {
    label: 'Student Experience',
    heading: 'CAMPUS',
    accentText: 'LIFE',
    description: 'A vibrant community balancing rigorous technical education with diverse cultural and athletic pursuits.',
    facilities: [
      {
        id: 'fac-library',
        title: 'Central Library',
        description: 'Over 50,000 volumes, e-journals, and digital resources. Access to IEEE, Elsevier, Springer, DELNET.',
        iconName: 'BookOpen',
        imageUrl: 'https://picsum.photos/seed/sgslib/600/400',
        to: '/facilities/library',
      },
      {
        id: 'fac-computer',
        title: 'Computer Center',
        description: 'High-speed internet, 500+ computers, servers, 24×7 network access for students and faculty.',
        iconName: 'Microscope',
        imageUrl: 'https://picsum.photos/seed/sgslab/600/400',
        to: '/facilities/computer-center',
      },
      {
        id: 'fac-sports',
        title: 'Sports Complex',
        description: 'Cricket, football, basketball, badminton, table tennis, and a fully equipped gymnasium.',
        iconName: 'Users',
        imageUrl: 'https://picsum.photos/seed/sgssports/600/400',
        to: '/facilities/sports',
      },
      {
        id: 'fac-activities',
        title: 'Student Activities',
        description: 'IEEE, Coding Club, Robotics, and literary clubs nurturing talent beyond academics.',
        iconName: 'Users',
        imageUrl: 'https://picsum.photos/seed/sgsclubs/600/400',
        to: '/students/activities',
      },
      {
        id: 'fac-hostel',
        title: 'Hostel Facilities',
        description: 'Separate Boys and Girls hostels with Wi-Fi, mess, laundry, common rooms — a home away from home.',
        iconName: 'Building',
        imageUrl: 'https://picsum.photos/seed/sgshostel/600/400',
        to: '/facilities/hostel/boys',
      },
      {
        id: 'fac-idea-lab',
        title: 'AICTE IDEA Lab',
        description: '3D printers, laser cutters, AR/VR headsets, IoT kits and electronics prototyping — fostering maker culture.',
        iconName: 'FileText',
        imageUrl: 'https://picsum.photos/seed/sgsaudi/600/400',
        to: '/facilities/idea-lab',
      },
    ],
  },

  faqsSection: {
    heading: 'FAQs',
    subLabel: 'Frequently Asked Questions',
    viewAllLink: '/policy/help',
    items: [
      {
        id: 'faq1',
        question: 'What are the eligibility criteria for B.Tech admissions?',
        answer: 'Admissions are via JEE Main counselling (MP State). Candidates must have passed 10+2 with PCM and a minimum of 45% marks (40% for SC/ST).',
        contact: null,
        defaultOpen: false,
      },
      {
        id: 'faq2',
        question: 'Whom to contact for Postgraduate admissions?',
        answer: null,
        contact: { name: 'Office of Academics (PG)', phone: '+91-731-2431234', email: 'pg@sgsits.ac.in' },
        defaultOpen: true,
      },
      {
        id: 'faq3',
        question: 'Whom to contact for Undergraduate admissions?',
        answer: 'Contact the Admission Cell at admissions@sgsits.ac.in or call +91-731-2582100.',
        contact: null,
        defaultOpen: false,
      },
      {
        id: 'faq4',
        question: 'Whom to contact for queries related to GATE?',
        answer: 'PG Admission queries related to GATE scores are handled by the PG Admission Cell. Email pg@sgsits.ac.in.',
        contact: null,
        defaultOpen: false,
      },
      {
        id: 'faq5',
        question: 'How to pay fees online?',
        answer: 'Fees can be paid via the institute ERP portal using net banking, debit/credit card or UPI. Visit the Student Login portal for instructions.',
        contact: null,
        defaultOpen: false,
      },
      {
        id: 'faq6',
        question: 'Whom to contact for Faculty Recruitment?',
        answer: "Faculty recruitment queries should be addressed to the Registrar's office at registrar@sgsits.ac.in.",
        contact: null,
        defaultOpen: false,
      },
    ],
  },

  gallerySection: {
    heading: 'Photo',
    accentText: 'Gallery',
    subLabel: 'Multi-Hued Reflections',
    viewAllLink: '/explore/gallery',
  },
  preFooter: {
    imageUrl: '/assets/campus-panorama.png',
    label: 'SGSITS Campus Sunset Panorama',
  },
}

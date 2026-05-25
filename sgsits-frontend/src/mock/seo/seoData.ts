/**
 * MOCK: Per-Page SEO Metadata
 * Replace with: GET /api/seo/:pageKey
 *
 * Consumed ONLY through src/services/seoService.ts
 *
 * Admin panel can:
 *  - Set page title for every page
 *  - Set meta description
 *  - Set Open Graph title, description, image
 *  - Set canonical URL
 *  - Set Twitter card data
 */

export interface SeoMeta {
  /** Unique page key matching route/section */
  pageKey: string
  /** HTML <title> — shown in browser tab and search results */
  pageTitle: string
  /** Meta description — shown in search result snippets */
  metaDescription: string
  /** Open Graph title (for social sharing) */
  ogTitle?: string
  /** Open Graph description */
  ogDescription?: string
  /** Open Graph image URL */
  ogImage?: string
  /** Canonical URL for duplicate content resolution */
  canonicalUrl?: string
  /** Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image'
  /** Keywords (legacy, still used by some engines) */
  keywords?: string
}

const BASE = 'SGSITS Indore'

export const mockSeoData: Record<string, SeoMeta> = {
  home: {
    pageKey: 'home',
    pageTitle: `${BASE} — An Institute of National Standing`,
    metaDescription: 'Shri Govindram Seksaria Institute of Technology & Science, Indore. NAAC accredited, AICTE approved. Offering B.Tech, M.Tech, MBA, and PhD programs since 1952.',
    ogTitle: `${BASE} — Official Website`,
    ogDescription: 'Premier engineering and technology institute in Madhya Pradesh, Indore. NAAC A grade. 70+ years of academic excellence.',
    ogImage: '/assets/image.png',
    twitterCard: 'summary_large_image',
    keywords: 'SGSITS, Indore engineering college, SGSITS Indore, BTech Indore, Shri GS Institute',
  },
  'about/institute': {
    pageKey: 'about/institute',
    pageTitle: `About the Institute — ${BASE}`,
    metaDescription: 'Learn about SGSITS Indore — its history, autonomous status, affiliated programs, and institutional achievements since 1952.',
    ogTitle: `About SGSITS — ${BASE}`,
    ogDescription: 'Established in 1952, SGSITS is a premier Govt. Aided Autonomous Institute in Madhya Pradesh.',
  },
  'about/vision-mission': {
    pageKey: 'about/vision-mission',
    pageTitle: `Vision & Mission — ${BASE}`,
    metaDescription: 'The vision and mission of SGSITS Indore — fostering technological excellence and creating industry-ready graduates.',
  },
  'about/director-message': {
    pageKey: 'about/director-message',
    pageTitle: `Director's Message — ${BASE}`,
    metaDescription: "Read the Director's message about SGSITS Indore's vision, achievements, and commitment to academic excellence.",
  },
  'about/governing-body': {
    pageKey: 'about/governing-body',
    pageTitle: `Governing Body — ${BASE}`,
    metaDescription: 'Meet the Governing Body of SGSITS Indore responsible for governance and academic oversight.',
  },
  'about/administration': {
    pageKey: 'about/administration',
    pageTitle: `Administration — ${BASE}`,
    metaDescription: 'SGSITS Indore administrative structure — directors, registrar, deans, and administrative officers.',
  },
  'about/committees': {
    pageKey: 'about/committees',
    pageTitle: `Administrative Committees — ${BASE}`,
    metaDescription: 'SGSITS Indore administrative and academic committees — members, roles, and responsibilities.',
  },
  'about/telephone-directory': {
    pageKey: 'about/telephone-directory',
    pageTitle: `Telephone Directory — ${BASE}`,
    metaDescription: 'Contact directory for SGSITS Indore — department numbers, faculty extensions, and administrative contacts.',
  },
  'about/infrastructure': {
    pageKey: 'about/infrastructure',
    pageTitle: `Infrastructure — ${BASE}`,
    metaDescription: 'SGSITS Indore campus infrastructure — smart classrooms, laboratories, libraries, and modern facilities.',
  },
  'about/iqac': {
    pageKey: 'about/iqac',
    pageTitle: `IQAC Cell — ${BASE}`,
    metaDescription: 'Internal Quality Assurance Cell (IQAC) of SGSITS Indore — quality benchmarks, audits, and initiatives.',
  },
  'about/academic-council': {
    pageKey: 'about/academic-council',
    pageTitle: `Academic Council — ${BASE}`,
    metaDescription: 'Academic Council of SGSITS Indore — members and their roles in academic governance.',
  },
  'about/accreditation': {
    pageKey: 'about/accreditation',
    pageTitle: `Accreditation (NBA/NAAC) — ${BASE}`,
    metaDescription: 'SGSITS Indore accreditation details — NAAC Grade A, NBA accredited programs, and NIRF rankings.',
  },
  'academics/calendar': {
    pageKey: 'academics/calendar',
    pageTitle: `Academic Calendar — ${BASE}`,
    metaDescription: 'SGSITS Indore academic calendar — important dates, examination schedules, and holiday list.',
  },
  'academics/courses/ug': {
    pageKey: 'academics/courses/ug',
    pageTitle: `UG Courses — ${BASE}`,
    metaDescription: 'Undergraduate B.Tech programs at SGSITS Indore — branches, eligibility, and admission process.',
  },
  'academics/courses/pg': {
    pageKey: 'academics/courses/pg',
    pageTitle: `PG Courses — ${BASE}`,
    metaDescription: 'Postgraduate M.Tech and MBA programs at SGSITS Indore — specializations and admission details.',
  },
  'academics/courses/phd': {
    pageKey: 'academics/courses/phd',
    pageTitle: `Ph.D. Programs — ${BASE}`,
    metaDescription: 'Doctoral research programs at SGSITS Indore — admission process, research areas, and faculty guides.',
  },
  departments: {
    pageKey: 'departments',
    pageTitle: `Departments — ${BASE}`,
    metaDescription: 'All academic departments at SGSITS Indore — Computer Engineering, Mechanical, Civil, Electrical, Pharmacy, and more.',
  },
  placement: {
    pageKey: 'placement',
    pageTitle: `Training & Placements — ${BASE}`,
    metaDescription: 'SGSITS Indore placement records, top recruiters, and Training & Placement Cell information.',
  },
  'placement/tnp-cell': {
    pageKey: 'placement/tnp-cell',
    pageTitle: `T&P Cell — ${BASE}`,
    metaDescription: 'Training & Placement Cell at SGSITS Indore — team, process, and achievements.',
  },
  'placement/companies': {
    pageKey: 'placement/companies',
    pageTitle: `Leading Recruiters — ${BASE}`,
    metaDescription: 'Companies that recruit from SGSITS Indore — top IT, core engineering, PSU, and startup recruiters.',
  },
  'placement/record': {
    pageKey: 'placement/record',
    pageTitle: `Placement Record — ${BASE}`,
    metaDescription: 'Year-wise placement statistics of SGSITS Indore — packages, companies visited, and placement percentage.',
  },
  notices: {
    pageKey: 'notices',
    pageTitle: `Notices — ${BASE}`,
    metaDescription: 'Latest official notices from SGSITS Indore — academic, exam, administrative, and hostel announcements.',
  },
  news: {
    pageKey: 'news',
    pageTitle: `Campus News — ${BASE}`,
    metaDescription: 'Latest news and achievements from SGSITS Indore — research, placements, events, and campus stories.',
  },
  events: {
    pageKey: 'events',
    pageTitle: `Events — ${BASE}`,
    metaDescription: 'Upcoming events at SGSITS Indore — technical festivals, cultural programs, workshops, and sports events.',
  },
  tenders: {
    pageKey: 'tenders',
    pageTitle: `Tenders — ${BASE}`,
    metaDescription: 'Active procurement tenders from SGSITS Indore — open bids and contract opportunities.',
  },
  contact: {
    pageKey: 'contact',
    pageTitle: `Contact Us — ${BASE}`,
    metaDescription: 'Contact SGSITS Indore — address, phone, email, and map location for the institute.',
  },
  facilities: {
    pageKey: 'facilities',
    pageTitle: `Facilities — ${BASE}`,
    metaDescription: 'Campus facilities at SGSITS Indore — library, computer center, hostels, sports complex, and more.',
  },
  'admission/ug': {
    pageKey: 'admission/ug',
    pageTitle: `UG Admissions — ${BASE}`,
    metaDescription: 'B.Tech admission process at SGSITS Indore — eligibility, JEE Main cutoffs, MPDTE counseling, and documents.',
  },
  'admission/pg': {
    pageKey: 'admission/pg',
    pageTitle: `PG Admissions — ${BASE}`,
    metaDescription: 'M.Tech and MBA admission process at SGSITS Indore — GATE score, eligibility, and application details.',
  },
  'admission/phd': {
    pageKey: 'admission/phd',
    pageTitle: `Ph.D. Admissions — ${BASE}`,
    metaDescription: 'Doctoral program admission at SGSITS Indore — research areas, eligibility, and entrance process.',
  },
  login: {
    pageKey: 'login',
    pageTitle: `Login — ${BASE} Portal`,
    metaDescription: 'Secure login for students, faculty, HODs, admin, exam department, and placement office.',
  },
  'explore/gallery': {
    pageKey: 'explore/gallery',
    pageTitle: `Photo Gallery — ${BASE}`,
    metaDescription: 'Photo gallery of SGSITS Indore — campus life, events, convocations, and achievements.',
  },
  'explore/video-tour': {
    pageKey: 'explore/video-tour',
    pageTitle: `Video Tour — ${BASE}`,
    metaDescription: 'Virtual video tour of SGSITS Indore campus — see our infrastructure and campus life.',
  },
  'academics/courses/ptdc': {
    pageKey: 'academics/courses/ptdc',
    pageTitle: `PTDC Courses — ${BASE}`,
    metaDescription: 'Part-Time Degree Courses at SGSITS Indore — programs for working professionals.',
  },
  'academics/online-courses': {
    pageKey: 'academics/online-courses',
    pageTitle: `Online Courses — ${BASE}`,
    metaDescription: 'Online learning programs available to SGSITS Indore students via NPTEL and SWAYAM portals.',
  },
  'academics/code-of-conduct': {
    pageKey: 'academics/code-of-conduct',
    pageTitle: `Code of Conduct — ${BASE}`,
    metaDescription: 'Academic code of conduct for students and faculty at SGSITS Indore.',
  },
  'academics/ordinances': {
    pageKey: 'academics/ordinances',
    pageTitle: `Ordinances — ${BASE}`,
    metaDescription: 'Academic ordinances and regulations governing examinations and courses at SGSITS Indore.',
  },
  'academics/plagiarism-policy': {
    pageKey: 'academics/plagiarism-policy',
    pageTitle: `Plagiarism Policy — ${BASE}`,
    metaDescription: 'SGSITS Indore plagiarism policy for research scholars and students.',
  },
  'academics/obe-nep-2020': {
    pageKey: 'academics/obe-nep-2020',
    pageTitle: `OBE & NEP 2020 — ${BASE}`,
    metaDescription: 'Outcome-Based Education and National Education Policy 2020 implementation at SGSITS Indore.',
  },
  'academics/exam-results': {
    pageKey: 'academics/exam-results',
    pageTitle: `Exam Results — ${BASE}`,
    metaDescription: 'Semester examination results for SGSITS Indore students.',
  },
  'academics/first-year': {
    pageKey: 'academics/first-year',
    pageTitle: `First Year Information — ${BASE}`,
    metaDescription: 'Information for first year students at SGSITS Indore — orientation, schedule, and resources.',
  },
  'admission/prospectus': {
    pageKey: 'admission/prospectus',
    pageTitle: `Prospectus — ${BASE}`,
    metaDescription: 'Download the SGSITS Indore prospectus for complete admission and course information.',
  },
  'placement/leading-companies': {
    pageKey: 'placement/leading-companies',
    pageTitle: `Leading Recruiters — ${BASE}`,
    metaDescription: 'Top companies recruiting from SGSITS Indore campus — IT, core, PSU, and startup sectors.',
  },
  'placement/contact': {
    pageKey: 'placement/contact',
    pageTitle: `Placement Contact — ${BASE}`,
    metaDescription: 'Contact the Training & Placement Cell of SGSITS Indore for recruitment and internship queries.',
  },
  'placement/records': {
    pageKey: 'placement/records',
    pageTitle: `Placement Records — ${BASE}`,
    metaDescription: 'Detailed placement statistics and year-wise records for SGSITS Indore graduates.',
  },
  'facilities/library': {
    pageKey: 'facilities/library',
    pageTitle: `Central Library — ${BASE}`,
    metaDescription: 'SGSITS Indore Central Library — books, journals, digital resources, and reading rooms.',
  },
  'facilities/boys-hostel': {
    pageKey: 'facilities/boys-hostel',
    pageTitle: `Boys Hostel — ${BASE}`,
    metaDescription: 'Boys hostel facilities at SGSITS Indore — accommodation, mess, and amenities.',
  },
  'facilities/girls-hostel': {
    pageKey: 'facilities/girls-hostel',
    pageTitle: `Girls Hostel — ${BASE}`,
    metaDescription: 'Girls hostel facilities at SGSITS Indore — accommodation, security, and amenities.',
  },
  'facilities/computer-center': {
    pageKey: 'facilities/computer-center',
    pageTitle: `Computer Center — ${BASE}`,
    metaDescription: 'Central Computer Center at SGSITS Indore — high-speed internet, computing labs, and resources.',
  },
  'facilities/games-sports': {
    pageKey: 'facilities/games-sports',
    pageTitle: `Games & Sports — ${BASE}`,
    metaDescription: 'Sports facilities at SGSITS Indore — cricket, football, tennis, badminton, and athletics.',
  },
  'facilities/dispensary': {
    pageKey: 'facilities/dispensary',
    pageTitle: `Medical Dispensary — ${BASE}`,
    metaDescription: 'SGSITS Indore campus medical dispensary — health care services for students and staff.',
  },
  'facilities/idea-lab': {
    pageKey: 'facilities/idea-lab',
    pageTitle: `IDEA Lab — ${BASE}`,
    metaDescription: 'IDEA Lab at SGSITS Indore — innovation, design, entrepreneurship, and advanced prototyping.',
  },
  'facilities/gymnasium': {
    pageKey: 'facilities/gymnasium',
    pageTitle: `Gymnasium — ${BASE}`,
    metaDescription: 'Modern gymnasium at SGSITS Indore — fitness equipment and wellness center.',
  },
  'facilities/workshop': {
    pageKey: 'facilities/workshop',
    pageTitle: `Central Workshop — ${BASE}`,
    metaDescription: 'Central Workshop at SGSITS Indore — machining, fabrication, and practical training facilities.',
  },
  'facilities/cidi': {
    pageKey: 'facilities/cidi',
    pageTitle: `CIDI — ${BASE}`,
    metaDescription: 'Centre for Innovation, Design, and Incubation at SGSITS Indore — startup support.',
  },
  'facilities/transit-hostel': {
    pageKey: 'facilities/transit-hostel',
    pageTitle: `Transit Hostel — ${BASE}`,
    metaDescription: 'Transit hostel at SGSITS Indore for guests and visiting faculty.',
  },
  'facilities/staff-quarters': {
    pageKey: 'facilities/staff-quarters',
    pageTitle: `Staff Quarters — ${BASE}`,
    metaDescription: 'SGSITS Indore campus staff residential quarters.',
  },
  'students/activities': {
    pageKey: 'students/activities',
    pageTitle: `Student Activities — ${BASE}`,
    metaDescription: 'Student clubs, technical societies, and extra-curricular activities at SGSITS Indore.',
  },
  'students/ncc': {
    pageKey: 'students/ncc',
    pageTitle: `NCC — ${BASE}`,
    metaDescription: 'National Cadet Corps unit at SGSITS Indore — training, camps, and achievements.',
  },
  'students/nss': {
    pageKey: 'students/nss',
    pageTitle: `NSS — ${BASE}`,
    metaDescription: 'National Service Scheme unit at SGSITS Indore — social service programs and volunteers.',
  },
  'students/scholarship-govt': {
    pageKey: 'students/scholarship-govt',
    pageTitle: `Government Scholarships — ${BASE}`,
    metaDescription: 'Government scholarship schemes available to SGSITS Indore students — SC/ST/OBC and merit awards.',
  },
  'students/scholarship-institute': {
    pageKey: 'students/scholarship-institute',
    pageTitle: `Institute Scholarships — ${BASE}`,
    metaDescription: 'Institute scholarships and financial aid for meritorious students at SGSITS Indore.',
  },
  'students/sss': {
    pageKey: 'students/sss',
    pageTitle: `Student Support Services — ${BASE}`,
    metaDescription: 'Student Support Services at SGSITS Indore — counseling, mentoring, and welfare programs.',
  },
  'explore/campus-map': {
    pageKey: 'explore/campus-map',
    pageTitle: `Campus Map — ${BASE}`,
    metaDescription: 'Interactive campus map of SGSITS Indore — buildings, labs, and facilities layout.',
  },
  'explore/anthem': {
    pageKey: 'explore/anthem',
    pageTitle: `Institute Anthem — ${BASE}`,
    metaDescription: 'SGSITS Indore institute anthem and song.',
  },
  'gallery/album': {
    pageKey: 'gallery/album',
    pageTitle: `Gallery Album — ${BASE}`,
    metaDescription: 'Photo album from SGSITS Indore events, campus life, and achievements.',
  },
  teqip: {
    pageKey: 'teqip',
    pageTitle: `TEQIP — ${BASE}`,
    metaDescription: 'Technical Education Quality Improvement Program at SGSITS Indore — projects and outcomes.',
  },
  'startup-cell': {
    pageKey: 'startup-cell',
    pageTitle: `Startup Cell — ${BASE}`,
    metaDescription: 'SGSITS Indore Startup Cell — incubation, entrepreneurship development, and funding support.',
  },
  'policy/privacy': {
    pageKey: 'policy/privacy',
    pageTitle: `Privacy Policy — ${BASE}`,
    metaDescription: 'Privacy policy for the SGSITS Indore official website.',
  },
  'policy/disclaimer': {
    pageKey: 'policy/disclaimer',
    pageTitle: `Disclaimer — ${BASE}`,
    metaDescription: 'Website disclaimer for SGSITS Indore.',
  },
  'policy/terms': {
    pageKey: 'policy/terms',
    pageTitle: `Terms of Use — ${BASE}`,
    metaDescription: 'Terms of use for the SGSITS Indore official website.',
  },
  'policy/accessibility': {
    pageKey: 'policy/accessibility',
    pageTitle: `Accessibility Statement — ${BASE}`,
    metaDescription: 'Web accessibility statement for SGSITS Indore website.',
  },
  'policy/copyright': {
    pageKey: 'policy/copyright',
    pageTitle: `Copyright Policy — ${BASE}`,
    metaDescription: 'Copyright policy for content published on the SGSITS Indore website.',
  },
  'policy/hyperlink': {
    pageKey: 'policy/hyperlink',
    pageTitle: `Hyperlink Policy — ${BASE}`,
    metaDescription: 'Hyperlink policy for SGSITS Indore website.',
  },
  'policy/security': {
    pageKey: 'policy/security',
    pageTitle: `Security Policy — ${BASE}`,
    metaDescription: 'Security policy for the SGSITS Indore website.',
  },
  'policy/sitemap': {
    pageKey: 'policy/sitemap',
    pageTitle: `Site Map — ${BASE}`,
    metaDescription: 'Complete site map of the SGSITS Indore official website.',
  },
  'policy/feedback': {
    pageKey: 'policy/feedback',
    pageTitle: `Feedback — ${BASE}`,
    metaDescription: 'Submit your feedback about SGSITS Indore.',
  },
  'policy/help': {
    pageKey: 'policy/help',
    pageTitle: `Help — ${BASE}`,
    metaDescription: 'Help and FAQs for navigating the SGSITS Indore website.',
  },
  'policy/web-info-manager': {
    pageKey: 'policy/web-info-manager',
    pageTitle: `Web Information Manager — ${BASE}`,
    metaDescription: 'Web information manager details for SGSITS Indore website.',
  },
  'portal-coming-soon': {
    pageKey: 'portal-coming-soon',
    pageTitle: `Portal Coming Soon — ${BASE}`,
    metaDescription: 'The SGSITS Indore ERP portal is under development. Check back soon.',
  },
  '404': {
    pageKey: '404',
    pageTitle: `Page Not Found — ${BASE}`,
    metaDescription: 'The page you are looking for could not be found on the SGSITS Indore website.',
  },
}

/** Default/fallback SEO used when a specific page key has no config */
export const mockDefaultSeoMeta: SeoMeta = {
  pageKey: 'default',
  pageTitle: `${BASE} — Official Website`,
  metaDescription: 'Shri Govindram Seksaria Institute of Technology & Science, Indore — Official Website.',
  ogTitle: BASE,
  ogDescription: 'Premier engineering institute in Madhya Pradesh since 1952.',
  ogImage: '/assets/image.png',
  twitterCard: 'summary',
}

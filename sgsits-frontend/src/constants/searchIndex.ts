export interface SearchItem {
  title: string
  path: string
  category: string
  keywords: string
}

const searchIndex: SearchItem[] = [
  // ── Home ──────────────────────────────────────────────────────────────────
  { title: 'Home', path: '/', category: 'Home', keywords: 'home main sgsits institute college' },

  // ── About ─────────────────────────────────────────────────────────────────
  { title: 'About SGSITS', path: '/about', category: 'About', keywords: 'about institute college history overview introduction' },
  { title: 'About the Institute', path: '/about/about-institute', category: 'About', keywords: 'about institute overview history established engineering technology science' },
  { title: 'Vision & Mission', path: '/about/vision-mission', category: 'About', keywords: 'vision mission goals objectives values purpose' },
  { title: "Director's Message", path: '/about/directors-message', category: 'About', keywords: 'director message principal head speech welcome' },
  { title: 'Governing Body', path: '/about/governing-body', category: 'About', keywords: 'governing body board members management committee' },
  { title: 'Administration', path: '/about/administration', category: 'About', keywords: 'administration management staff officers registrar dean' },
  { title: 'Committees', path: '/about/committees', category: 'About', keywords: 'committees academic anti ragging grievance cell board' },
  { title: 'Telephone Directory', path: '/about/telephone-directory', category: 'About', keywords: 'telephone directory contact numbers phone extension staff faculty' },
  { title: 'Infrastructure', path: '/about/infrastructure', category: 'About', keywords: 'infrastructure building campus facilities classrooms labs' },
  { title: 'IQAC Cell', path: '/about/iqac', category: 'About', keywords: 'iqac quality assurance cell activities accreditation naac' },
  { title: 'Academic Council', path: '/about/academic-council', category: 'About', keywords: 'academic council board senate members meeting minutes' },
  { title: 'Accreditation', path: '/about/accreditation', category: 'About', keywords: 'accreditation naac nba nba grade rating ranking approval' },

  // ── Academics ─────────────────────────────────────────────────────────────
  { title: 'Academics', path: '/academics', category: 'Academics', keywords: 'academics courses programs curriculum study' },
  { title: 'Academic Calendar', path: '/academics/academic-calendar', category: 'Academics', keywords: 'academic calendar schedule semester dates holidays exams timetable' },
  { title: 'UG Courses', path: '/academics/ug-courses', category: 'Academics', keywords: 'ug undergraduate courses btech be engineering programs' },
  { title: 'PG Courses', path: '/academics/pg-courses', category: 'Academics', keywords: 'pg postgraduate courses mtech mba mca masters programs' },
  { title: 'PhD Programs', path: '/academics/phd-courses', category: 'Academics', keywords: 'phd doctorate research programs admission' },
  { title: 'PTDC Courses', path: '/academics/ptdc-courses', category: 'Academics', keywords: 'ptdc part time degree certificate courses diploma' },
  { title: 'Online Courses', path: '/academics/online-courses', category: 'Academics', keywords: 'online courses nptel swayam e-learning distance' },
  { title: 'First Year Information', path: '/academics/first-year', category: 'Academics', keywords: 'first year freshers information joining details hostel fee' },
  { title: 'Exam & Results', path: '/academics/exam-results', category: 'Academics', keywords: 'exam results marksheet grade semester examination result revaluation' },
  { title: 'Ordinances', path: '/academics/ordinances', category: 'Academics', keywords: 'ordinances rules regulations academic statutes bye laws' },
  { title: 'Plagiarism Policy', path: '/academics/plagiarism-policy', category: 'Academics', keywords: 'plagiarism policy research integrity urkund turnitin' },
  { title: 'Code of Conduct', path: '/academics/code-of-conduct', category: 'Academics', keywords: 'code of conduct ethics discipline behavior rules students' },
  { title: 'OBE & NEP 2020', path: '/academics/obe-nep', category: 'Academics', keywords: 'obe outcome based education nep 2020 national education policy cbcs' },

  // ── Departments ───────────────────────────────────────────────────────────
  { title: 'All Departments', path: '/departments', category: 'Departments', keywords: 'departments all list engineering science' },
  { title: 'Applied Chemistry', path: '/departments/applied-chemistry', category: 'Departments', keywords: 'applied chemistry department faculty research labs' },
  { title: 'Applied Mathematics', path: '/departments/applied-mathematics', category: 'Departments', keywords: 'applied mathematics department maths stats' },
  { title: 'Applied Physics', path: '/departments/applied-physics', category: 'Departments', keywords: 'applied physics department laser optics' },
  { title: 'Computer Science & Engineering', path: '/departments/computer-science-engineering', category: 'Departments', keywords: 'computer science engineering cse it software programming coding' },
  { title: 'Civil Engineering', path: '/departments/civil-engineering', category: 'Departments', keywords: 'civil engineering department construction structures' },
  { title: 'Electrical Engineering', path: '/departments/electrical-engineering', category: 'Departments', keywords: 'electrical engineering ee power electronics circuits' },
  { title: 'Electronics & Communication', path: '/departments/electronics-communication', category: 'Departments', keywords: 'electronics communication engineering ec vlsi signal' },
  { title: 'Information Technology', path: '/departments/information-technology', category: 'Departments', keywords: 'information technology it software networking web' },
  { title: 'Mechanical Engineering', path: '/departments/mechanical-engineering', category: 'Departments', keywords: 'mechanical engineering me machines manufacturing thermal' },
  { title: 'Automobile Engineering', path: '/departments/automobile-engineering', category: 'Departments', keywords: 'automobile automotive engineering vehicles engines' },
  { title: 'Instrumentation & Control', path: '/departments/instrumentation-control', category: 'Departments', keywords: 'instrumentation control engineering sensors automation ics' },
  { title: 'Fire Technology & Safety', path: '/departments/fire-technology-safety', category: 'Departments', keywords: 'fire technology safety engineering firefighting protection' },
  { title: 'Industrial Safety', path: '/departments/industrial-safety', category: 'Departments', keywords: 'industrial safety engineering occupational health hazard' },
  { title: 'Master of Business Administration', path: '/departments/mba', category: 'Departments', keywords: 'mba business administration management finance marketing' },
  { title: 'MCA - Computer Applications', path: '/departments/mca', category: 'Departments', keywords: 'mca master computer applications software' },
  { title: 'Humanities & Social Sciences', path: '/departments/humanities-social-science', category: 'Departments', keywords: 'humanities social sciences economics english communication' },

  // ── Admissions ────────────────────────────────────────────────────────────
  { title: 'Admissions', path: '/admission', category: 'Admissions', keywords: 'admission apply join entrance fee eligibility' },
  { title: 'UG Admissions', path: '/admission/ug', category: 'Admissions', keywords: 'ug undergraduate admission btech counselling jee dte mp' },
  { title: 'PG Admissions', path: '/admission/pg', category: 'Admissions', keywords: 'pg postgraduate admission mtech mba mca gate mat cat' },
  { title: 'PhD Admissions', path: '/admission/phd', category: 'Admissions', keywords: 'phd doctorate admission research fellowship scholarship' },
  { title: 'Prospectus', path: '/admission/prospectus', category: 'Admissions', keywords: 'prospectus brochure college information fee structure seats' },

  // ── Placements ────────────────────────────────────────────────────────────
  { title: 'Placements', path: '/placement', category: 'Placements', keywords: 'placement training job campus recruiter hiring' },
  { title: 'Training & Placement Cell', path: '/placement/tnp-cell', category: 'Placements', keywords: 'training placement cell tnp officer career internship' },
  { title: 'Leading Companies', path: '/placement/leading-companies', category: 'Placements', keywords: 'companies recruiters hiring tcs infosys wipro campus drives' },
  { title: 'Placement Records', path: '/placement/record', category: 'Placements', keywords: 'placement records statistics salary package highest average ctc' },
  { title: 'Placement Contact', path: '/placement/contact', category: 'Placements', keywords: 'placement contact email phone tpo officer reach' },

  // ── Campus Life ───────────────────────────────────────────────────────────
  { title: 'Campus Life', path: '/campus-life', category: 'Campus Life', keywords: 'campus life student activities events culture' },
  { title: 'Student Activities', path: '/campus-life/activities', category: 'Campus Life', keywords: 'student activities clubs fests cultural technical events' },
  { title: 'Government Scholarships', path: '/campus-life/scholarship-govt', category: 'Campus Life', keywords: 'government scholarships merit means obc sc st scholarship' },
  { title: 'Institute Scholarships', path: '/campus-life/scholarship-institute', category: 'Campus Life', keywords: 'institute scholarships awards merit rank topper financial aid' },
  { title: 'Student Support Services', path: '/campus-life/sss', category: 'Campus Life', keywords: 'student support services counseling welfare grievance help' },
  { title: 'NCC', path: '/campus-life/ncc', category: 'Campus Life', keywords: 'ncc national cadet corps army navy air force cadets parade' },
  { title: 'NSS', path: '/campus-life/nss', category: 'Campus Life', keywords: 'nss national service scheme social service volunteers community' },

  // ── Facilities ────────────────────────────────────────────────────────────
  { title: 'Facilities', path: '/facilities', category: 'Facilities', keywords: 'facilities infrastructure amenities campus' },
  { title: 'Computer Center', path: '/facilities/computer-center', category: 'Facilities', keywords: 'computer center lab internet wifi systems software' },
  { title: 'Library', path: '/facilities/library', category: 'Facilities', keywords: 'library books journals digital resources reading room' },
  { title: 'Workshop', path: '/facilities/workshop', category: 'Facilities', keywords: 'workshop machine tools lathe milling fabrication' },
  { title: 'Gymnasium', path: '/facilities/gymnasium', category: 'Facilities', keywords: 'gymnasium gym fitness health exercise sports' },
  { title: 'Dispensary', path: '/facilities/dispensary', category: 'Facilities', keywords: 'dispensary medical health doctor nurse medicine clinic' },
  { title: 'CIDI', path: '/facilities/cidi', category: 'Facilities', keywords: 'cidi consultancy industry development innovation' },
  { title: 'Games & Sports', path: '/facilities/games-sports', category: 'Facilities', keywords: 'games sports ground cricket football basketball badminton' },
  { title: "Boys' Hostel", path: '/facilities/boys-hostel', category: 'Facilities', keywords: 'boys hostel accommodation rooms mess facilities warden' },
  { title: "Girls' Hostel", path: '/facilities/girls-hostel', category: 'Facilities', keywords: 'girls hostel accommodation rooms mess facilities warden' },
  { title: 'Transit Hostel', path: '/facilities/transit-hostel', category: 'Facilities', keywords: 'transit hostel guest house temporary accommodation' },
  { title: 'Staff Quarters', path: '/facilities/staff-quarters', category: 'Facilities', keywords: 'staff quarters faculty residence accommodation housing' },
  { title: 'IDEA Lab', path: '/facilities/idea-lab', category: 'Facilities', keywords: 'idea lab innovation design entrepreneurship 3d printing iot robotics maker space' },

  // ── More / Live Feed ──────────────────────────────────────────────────────
  { title: 'Notices & Circulars', path: '/notices', category: 'More', keywords: 'notices circulars announcements important official orders' },
  { title: 'News', path: '/news', category: 'More', keywords: 'news latest updates events achievements press releases' },
  { title: 'Events', path: '/events', category: 'More', keywords: 'events calendar fest seminar workshop conference technical cultural' },
  { title: 'Tenders', path: '/tenders', category: 'More', keywords: 'tenders procurement purchase bids vendors contractors' },
  { title: 'Startup Cell', path: '/more/startup-cell', category: 'More', keywords: 'startup cell incubation entrepreneurship innovation venture business' },
  { title: 'TEQIP', path: '/more/teqip', category: 'More', keywords: 'teqip technical education quality improvement programme world bank' },
  { title: 'Contact Us', path: '/contact', category: 'More', keywords: 'contact us address phone email location map directions reach' },

  // ── Explore ───────────────────────────────────────────────────────────────
  { title: 'Campus Map', path: '/explore/campus-map', category: 'Explore', keywords: 'campus map location buildings layout plan navigate' },
  { title: 'Photo Gallery', path: '/explore/gallery', category: 'Explore', keywords: 'photo gallery pictures images campus events' },
  { title: 'Video Tour', path: '/explore/video-tour', category: 'Explore', keywords: 'video tour virtual 360 campus walkthrough' },
  { title: 'Institute Anthem', path: '/explore/anthem', category: 'Explore', keywords: 'anthem song institute college kulgeet' },

  // ── Policies ─────────────────────────────────────────────────────────────
  { title: 'Privacy Policy', path: '/policy/privacy', category: 'Policy', keywords: 'privacy policy data personal information gdpr' },
  { title: 'Terms of Use', path: '/policy/terms', category: 'Policy', keywords: 'terms of use conditions service agreement disclaimer' },
  { title: 'Disclaimer', path: '/policy/disclaimer', category: 'Policy', keywords: 'disclaimer liability accuracy information website' },
  { title: 'Accessibility Statement', path: '/policy/accessibility', category: 'Policy', keywords: 'accessibility wcag disability screen reader keyboard' },
  { title: 'Copyright Policy', path: '/policy/copyright', category: 'Policy', keywords: 'copyright intellectual property content ownership rights' },
  { title: 'Hyperlink Policy', path: '/policy/hyperlink', category: 'Policy', keywords: 'hyperlink policy external links third party websites' },
  { title: 'Security Policy', path: '/policy/security', category: 'Policy', keywords: 'security policy cyber data breach safe browsing' },
  { title: 'Site Map', path: '/policy/sitemap', category: 'Policy', keywords: 'site map all pages structure navigation index' },
  { title: 'Web Information Manager', path: '/policy/web-info-manager', category: 'Policy', keywords: 'web information manager nodal officer contact' },
  { title: 'Help', path: '/policy/help', category: 'Policy', keywords: 'help faq support how to use website guide' },
  { title: 'Feedback', path: '/policy/feedback', category: 'Policy', keywords: 'feedback suggestion complaint opinion form rating' },
]

export default searchIndex

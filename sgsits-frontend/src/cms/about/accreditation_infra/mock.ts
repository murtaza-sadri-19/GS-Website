import type { AccreditationData, InfrastructureData } from './types'

export const defaultAccreditation: AccreditationData = {
  about:
    'SGSITS Indore is accredited by the National Assessment and Accreditation Council (NAAC) and several individual B.Tech programs are accredited by the National Board of Accreditation (NBA). The institute is also ranked annually by NIRF (National Institutional Ranking Framework), Ministry of Education, Government of India.',
  records: [
    { body: 'NAAC',  grade: 'A+',                           validUpto: '2030',    cycle: '4th Cycle', naacScore: '3.42/4.00' },
    { body: 'AICTE', grade: 'Approved',                     validUpto: '2025-26', cycle: 'Annual' },
    { body: 'RGPV',  grade: 'Affiliated',                   validUpto: 'Ongoing' },
    { body: 'NBA',   grade: 'Accredited (Multiple Programs)', validUpto: '2026' },
  ],
  nbaPrograms: [
    'B.E. Computer Engineering',
    'B.E. Information Technology',
    'B.E. Electrical Engineering',
    'B.E. Mechanical Engineering',
    'B.E. Civil Engineering',
    'B.E. Electronics & Telecommunication Engineering',
  ],
  nirf: [
    { year: '2025', rank: '#1 in M.P.', category: 'Engineering' },
    { year: '2024', rank: 'Top 100',    category: 'Engineering' },
    { year: '2023', rank: 'Top 150',    category: 'Engineering' },
  ],
}

export const defaultInfrastructure: InfrastructureData = {
  summary:
    'SGSITS spans a sprawling campus of over 51 acres in the heart of Indore, equipped with state-of-the-art infrastructure to support academic, research, and student welfare activities.',
  campusArea: '51+ Acres',
  builtUpArea: '2,20,000+ sq. ft.',
  additionalFacilities: [
    'Dispensary / Health Center',
    'Auditorium (2000 capacity)',
    'Seminar Halls',
    'Canteen & Cafeteria',
    'ATM on Campus',
    'Solar Power Plant',
    'Rainwater Harvesting',
    'CCTV Surveillance',
    'Parking Facilities',
  ],
  items: [
    { title: 'Academic Blocks',  description: '12 well-equipped academic buildings housing 200+ classrooms, lecture theatres, and departmental offices.', stats: [{ label: 'Blocks', value: '12' }, { label: 'Classrooms', value: '200+' }] },
    { title: 'Laboratories',     description: 'Over 120 modern laboratories across all engineering, science, pharmacy and management disciplines.',       stats: [{ label: 'Labs', value: '120+' }, { label: 'Computers', value: '1500+' }] },
    { title: 'Central Library',  description: 'A fully digitized central library with 1.5 lakh books, 150+ journals, NPTEL, and remote access.',         stats: [{ label: 'Books', value: '1.5 Lakh+' }, { label: 'Journals', value: '150+' }] },
    { title: 'Hostels',          description: 'Separate boys and girls hostels with 1800+ beds, 24×7 security, mess, gym, and recreational facilities.', stats: [{ label: 'Beds', value: '1800+' }, { label: 'Hostels', value: '4 Blocks' }] },
    { title: 'Sports Complex',   description: 'A world-class sports complex with cricket ground, football field, tennis, basketball, gymnasium, and pool.', stats: [{ label: 'Sports Facilities', value: '15+' }] },
    { title: 'Auditorium',       description: 'A 2000-seat main auditorium and multiple seminar halls for academic and cultural events.',                  stats: [{ label: 'Seating Capacity', value: '2000' }] },
    { title: 'Health Centre',    description: 'A 24×7 dispensary with doctors, nurses, and first-aid facilities for students and staff.',                  stats: [{ label: 'Open', value: '24×7' }] },
    { title: 'Computer Centre',  description: 'A centralized computer centre with 300+ high-performance systems with high-speed internet.',               stats: [{ label: 'Systems', value: '300+' }, { label: 'Speed', value: '1 Gbps' }] },
  ],
}

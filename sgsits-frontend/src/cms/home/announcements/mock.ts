import type { AnnouncementItem } from './types'

export const defaultAnnouncements: AnnouncementItem[] = [
  { id: 'ann1', title: 'Information Bulletin regarding B.Tech Admissions 2025-26',              date: 'New',          isNew: true,  to: '/notices' },
  { id: 'ann2', title: 'Result of MBA (Financial Administration) II Sem Examination',          date: 'May 10, 2025', isNew: false, to: '/notices' },
  { id: 'ann3', title: 'Revised Academic Calendar for UG & PG classes 2024-25',               date: 'May 08, 2025', isNew: false, to: '/notices' },
  { id: 'ann4', title: 'Schedule of Internal Assessment Tests (Even Semester)',                date: 'May 02, 2025', isNew: false, to: '/notices' },
  { id: 'ann5', title: 'Instruction for students regarding uniform and general discipline',    date: 'Apr 28, 2025', isNew: false, to: '/notices' },
  { id: 'ann6', title: 'Tender notice for laboratory equipment procurement',                   date: 'Apr 20, 2025', isNew: false, to: '/notices' },
  { id: 'ann7', title: 'Notice regarding hostel fee payment deadlines for current students',   date: 'Apr 15, 2025', isNew: false, to: '/notices' },
]

export default defaultAnnouncements

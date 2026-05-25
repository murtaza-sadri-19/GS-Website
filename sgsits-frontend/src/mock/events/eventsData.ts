/**
 * MOCK: Events
 * Replace with: GET /api/events
 *
 * Consumed ONLY through src/services/eventsService.ts.
 */

import type { Event } from '../../types'

export interface EventsApiResponse {
  success: boolean
  data: Event[]
  total: number
}

export const mockEvents: Event[] = [
  {
    id: 'ev1',
    title: 'Annual Convocation 2025-26',
    description: 'Degree distribution ceremony at SGSITS auditorium. All eligible graduates to report by 9:00 AM.',
    venue: 'Main Auditorium',
    startDate: '2026-06-15',
    category: 'Academic',
    organizer: 'Registrar Office',
    imageUrl: 'https://picsum.photos/seed/sgsevd1/600/400',
    isActive: true,
  },
  {
    id: 'ev2',
    title: 'TechFest: Invictus 2026',
    description: 'National-level technical competition with 5000+ participants from 120+ colleges.',
    venue: 'SGSITS Campus',
    startDate: '2026-06-22',
    category: 'Technical',
    organizer: 'TechFest Committee',
    imageUrl: 'https://picsum.photos/seed/sgsevd2/600/400',
    registrationUrl: '/events',
    isActive: true,
  },
  {
    id: 'ev3',
    title: 'Campus Placement Drive — TCS & Infosys',
    description: 'Placement drive for final year B.Tech, MCA & MBA students. Aptitude test followed by technical rounds.',
    venue: 'Placement Cell, Admin Block',
    startDate: '2026-07-05',
    category: 'Academic',
    organizer: 'T&P Cell',
    imageUrl: 'https://picsum.photos/seed/sgsevd3/600/400',
    isActive: true,
  },
  {
    id: 'ev4',
    title: 'Annual Research Symposium 2026',
    description: 'PhD scholars present research works; industry leaders invited for collaboration and feedback.',
    venue: 'Seminar Hall, Academic Block',
    startDate: '2026-07-12',
    category: 'Seminar',
    organizer: 'Research Cell',
    imageUrl: 'https://picsum.photos/seed/sgsevd4/600/400',
    isActive: true,
  },
  {
    id: 'ev5',
    title: 'Rhythm 2026 — Cultural Festival',
    description: '3-day cultural extravaganza with music, dance, drama, and celebrity performances.',
    venue: 'SGSITS Amphitheatre',
    startDate: '2026-08-20',
    endDate: '2026-08-22',
    category: 'Cultural',
    organizer: 'Student Council',
    imageUrl: 'https://picsum.photos/seed/sgsevd5/600/400',
    isActive: true,
  },
  {
    id: 'ev6',
    title: 'National Sports Day — Athletics Meet',
    description: 'Inter-department athletics meet with track events, field events and combat sports.',
    venue: 'SGSITS Sports Ground',
    startDate: '2026-08-29',
    category: 'Sports',
    organizer: 'Sports Committee',
    imageUrl: 'https://picsum.photos/seed/sgsevd6/600/400',
    isActive: true,
  },
]

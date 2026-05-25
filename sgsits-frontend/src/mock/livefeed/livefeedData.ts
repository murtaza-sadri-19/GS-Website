/**
 * MOCK: Live Feed Data (Tenders, Public Events)
 * Replace with: GET /api/livefeed/*
 *
 * Consumed ONLY through src/services/livefeedService.ts
 */

// ─── Tenders ──────────────────────────────────────────────────────────────────

export type TenderStatus = 'Open' | 'Closed' | 'Extended'

export interface Tender {
  ref: string
  title: string
  status: TenderStatus
  publishDate: string
  lastDate: string
  dept: string
  fileUrl?: string
  amount?: string
}

export const mockTenders: Tender[] = [
  { ref: 'SGSITS/Tender/2026/045', title: 'Supply of Laboratory Equipment for ECE Department',             status: 'Open',   publishDate: 'May 10, 2026', lastDate: 'May 30, 2026', dept: 'Electronics & Telecomm',   amount: '₹12,00,000' },
  { ref: 'SGSITS/Tender/2026/039', title: 'Annual Maintenance Contract for Computer Center (2026–27)',     status: 'Open',   publishDate: 'Apr 25, 2026', lastDate: 'May 20, 2026', dept: 'Computer Center',           amount: '₹4,50,000'  },
  { ref: 'SGSITS/Tender/2026/036', title: 'Supply of Scientific Equipment for Chemistry Lab',               status: 'Open',   publishDate: 'Apr 18, 2026', lastDate: 'May 10, 2026', dept: 'Applied Chemistry',         amount: '₹6,80,000'  },
  { ref: 'SGSITS/Tender/2026/032', title: 'Mess Catering Services for Boys & Girls Hostels',                status: 'Closed', publishDate: 'Apr 10, 2026', lastDate: 'Apr 30, 2026', dept: 'Hostel Administration',     amount: '₹38,00,000' },
  { ref: 'SGSITS/Tender/2026/028', title: 'Civil Works — Renovation of Administrative Block, Phase II',    status: 'Closed', publishDate: 'Mar 20, 2026', lastDate: 'Apr 10, 2026', dept: 'Estate Office',             amount: '₹75,00,000' },
  { ref: 'SGSITS/Tender/2026/022', title: 'Purchase of Books, Journals & Reference Materials for Library', status: 'Closed', publishDate: 'Mar 5, 2026',  lastDate: 'Mar 25, 2026', dept: 'Central Library',           amount: '₹9,50,000'  },
  { ref: 'SGSITS/Tender/2026/018', title: 'Provision of Security Services for SGSITS Campus (2026–27)',    status: 'Closed', publishDate: 'Feb 22, 2026', lastDate: 'Mar 15, 2026', dept: 'Estate Office',             amount: '₹22,00,000' },
  { ref: 'SGSITS/Tender/2026/012', title: 'Purchase of Furniture for New Faculty Rooms',                   status: 'Closed', publishDate: 'Feb 10, 2026', lastDate: 'Mar 01, 2026', dept: 'Estate Office',             amount: '₹8,50,000'  },
]

export const mockTenderMeta = {
  contactEmail: 'purchase@sgsits.ac.in',
  contactPhone: '0731-2582115',
  note: 'All tender documents are available for download. Interested vendors must submit bids before the last date.',
}

// ─── Public Events ────────────────────────────────────────────────────────────

export interface PublicEvent {
  id: string
  title: string
  description: string
  date: string
  venue?: string
  category: string
}

export const mockPublicEvents: PublicEvent[] = [
  { id: 'pe1', title: 'Annual Convocation 2025-26',                     description: 'Degree distribution ceremony at SGSITS auditorium',           date: 'Mar 15, 2026',    venue: 'SGSITS Main Auditorium',       category: 'Academic'  },
  { id: 'pe2', title: 'Rhythm 2026 — Annual Cultural Festival',         description: '3-day cultural extravaganza with celebrity performances',      date: 'Feb 20-22, 2026', venue: 'SGSITS Amphitheatre',          category: 'Cultural'  },
  { id: 'pe3', title: 'Technosearch 2026 — Technical Festival',         description: 'Inter-college technical competition with 50+ events',          date: 'Feb 5-7, 2026',   venue: 'SGSITS Campus',                category: 'Technical' },
  { id: 'pe4', title: 'National Conference on Sustainable Engineering', description: 'Two-day conference by Mechanical Engineering department',        date: 'Jan 28, 2026',    venue: 'Seminar Hall, Academic Block', category: 'Academic'  },
  { id: 'pe5', title: 'Campus Placement Drive — TCS & Infosys',        description: 'Placement drive for final year B.Tech, MCA & MBA students',    date: 'Jan 15, 2026',    venue: 'Placement Cell, Admin Block',  category: 'Placement' },
  { id: 'pe6', title: 'Annual Research Symposium 2025',                 description: 'PhD scholars present research works; industry leaders invited', date: 'Dec 10, 2025',    venue: 'Seminar Hall, Academic Block', category: 'Academic'  },
  { id: 'pe7', title: 'National Sports Day — Athletics Meet',           description: 'Inter-department athletics meet and sports championship',       date: 'Aug 29, 2025',    venue: 'SGSITS Sports Ground',         category: 'Sports'    },
]

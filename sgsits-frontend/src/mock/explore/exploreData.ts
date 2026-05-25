/**
 * MOCK: Explore section data
 * Covers: AnthemPage, CampusMapPage, VideoTourPage, PhotoGalleryPage, AlbumPage
 */

// ── Anthem ────────────────────────────────────────────────────────────────
export interface AnthemStanza {
  hindi: string
  english: string
}

export const anthemStanzas: AnthemStanza[] = [
  {
    hindi: 'ज्ञान की ज्योत जलाएं हम,\nहर पल आगे बढ़ते जाएं हम।\nSGSITS का नाम रोशन करें,\nदेश की सेवा का संकल्प लें।',
    english: 'We shall light the lamp of knowledge,\nForward we march every moment.\nWe shall illuminate the name of SGSITS,\nWe pledge to serve our nation.',
  },
  {
    hindi: 'पार्क रोड की शान हैं हम,\nइंदौर की मान हैं हम।\nसात दशक की विरासत लेकर,\nउत्कृष्टता की राह पे चलते हैं।',
    english: 'We are the pride of Park Road,\nWe are the honor of Indore.\nCarrying seven decades of legacy,\nWe walk the path of excellence.',
  },
  {
    hindi: 'विज्ञान, तकनीक, अनुसंधान से,\nहम जग को नई दिशा देंगे।\nएकता, अनुशासन, समर्पण से,\nनई ऊंचाइयाँ हम पाएंगे।',
    english: 'Through science, technology, and research,\nWe shall show the world a new path.\nThrough unity, discipline, and dedication,\nWe shall reach new heights.',
  },
  {
    hindi: 'गोविंदराम जी के सपनों का संस्थान,\nहम हैं इसकी अमर पहचान।\nआओ मिलकर संकल्प करें,\nSGSITS को गौरवशाली बनाएं।',
    english: "The institution of Govindram Ji's dreams,\nWe are its eternal identity.\nCome, let us resolve together,\nTo make SGSITS glorious.",
  },
]

export interface InstrumentalNote {
  note: string
  freq: string
  desc: string
}

export const instrumentalNotes: InstrumentalNote[] = [
  { note: 'Sa', freq: 'C4', desc: 'Root note — represents foundation' },
  { note: 'Re', freq: 'D4', desc: 'Rising hope and aspiration' },
  { note: 'Ga', freq: 'E4', desc: 'Knowledge and wisdom' },
  { note: 'Ma', freq: 'F4', desc: 'Stability of character' },
  { note: 'Pa', freq: 'G4', desc: 'Progress and achievement' },
  { note: 'Dha', freq: 'A4', desc: 'Glory and recognition' },
  { note: 'Ni', freq: 'B4', desc: 'Eternal excellence' },
]

// ── Campus Map ────────────────────────────────────────────────────────────
export interface CampusLocation {
  name: string
  desc: string
}

export const campusLocations: CampusLocation[] = [
  {
    name: 'Main Academic Building',
    desc: "The iconic heritage building housing the Director's office, administrative block, and key departments. Built in 1952, it stands as a symbol of SGSITS legacy.",
  },
  {
    name: 'Central Library',
    desc: 'Fully air-conditioned library with 80,000+ volumes, 200+ journals, DELNET access, e-library terminals, and dedicated reading zones for 500+ students.',
  },
  {
    name: 'Computer Center',
    desc: 'Central computing facility with 300+ workstations, high-speed fiber internet, server cluster, software licensing for MATLAB, AutoCAD, ANSYS, and more.',
  },
  {
    name: 'Boys Hostels',
    desc: '5 hostel blocks accommodating 1,200+ students with furnished rooms, 24×7 water & power supply, Wi-Fi, study rooms, and a well-equipped mess.',
  },
  {
    name: 'Girls Hostel',
    desc: 'Secure residential facility for 400+ girl students with modern amenities, in-house mess, common rooms, and dedicated 24×7 security personnel.',
  },
  {
    name: 'Sports Complex',
    desc: 'Multi-sport complex featuring cricket ground, basketball & volleyball courts, badminton hall, table tennis, athletics track, and an indoor gymnasium.',
  },
]

export const campusMapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.9!2d75.8577!3d22.7196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fc9ce8e6a80f%3A0xd34e427dbec15f24!2sSGSITS%20Indore!5e0!3m2!1sen!2sin!4v1716000000000'

export const campusContactInfo = {
  securityGate: '+91-731-2431000',
  reception: '+91-731-2431234',
  email: 'info@sgsits.ac.in',
  address: '23, Park Road, Indore — 452003, M.P.',
}

// ── Video Tour ────────────────────────────────────────────────────────────
export const mainVideoId = 'dQw4w9WgXcQ'

export interface VideoTourHighlight {
  title: string
  desc: string
}

export const videoTourHighlights: VideoTourHighlight[] = [
  {
    title: 'Modern Laboratories',
    desc: 'State-of-the-art labs across all departments — CAD/CAM center, high-performance computing cluster, IoT lab, and material testing facilities.',
  },
  {
    title: 'Beautiful Campus',
    desc: 'Spread across 52 acres in the heart of Indore, SGSITS features lush green gardens, heritage architecture, and modern academic blocks.',
  },
  {
    title: 'Sports Facilities',
    desc: 'Dedicated sports complex with cricket ground, basketball court, volleyball, badminton, athletics track, and an indoor gymnasium.',
  },
]

export interface TourStop {
  title: string
  desc: string
  img: string
  videoId: string
}

export const tourStops: TourStop[] = [
  {
    title: 'Main Academic Building',
    desc: 'The iconic heritage structure housing the administrative and key academic departments.',
    img: 'https://picsum.photos/seed/mainbldg/400/250',
    videoId: mainVideoId,
  },
  {
    title: 'Central Library',
    desc: 'Fully digitized library with 80,000+ books, e-journals, and silent study zones.',
    img: 'https://picsum.photos/seed/library2024/400/250',
    videoId: mainVideoId,
  },
  {
    title: 'Computer Center',
    desc: 'High-speed networking, server infrastructure, and 24×7 computing resources.',
    img: 'https://picsum.photos/seed/ccenter/400/250',
    videoId: mainVideoId,
  },
  {
    title: 'Hostel & Campus Life',
    desc: 'Comfortable residences and vibrant student community life within 52 acres.',
    img: 'https://picsum.photos/seed/hostellife/400/250',
    videoId: mainVideoId,
  },
]

// ── Photo Gallery ─────────────────────────────────────────────────────────
export const galleryCategories = ['All', 'Technical Fest', 'Cultural', 'Sports', 'Convocation', 'Campus', 'Social']

export const galleryPageStats = {
  yearsOfLegacy: '70+',
}

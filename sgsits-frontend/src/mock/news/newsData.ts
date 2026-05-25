/**
 * MOCK: Campus News / Articles
 * Replace with: GET /api/news
 *
 * Consumed ONLY through src/services/newsService.ts.
 */

import type { NewsItem } from '../../types'

export interface HomeNewsCard {
  id: string
  seed: string       // used as picsum seed
  imageUrl: string
  category: string
  title: string
  description: string
  to: string
}

export interface FeaturedNewsCard {
  id: string
  imageUrl: string
  label: string
  title: string
  description: string
  to: string
}

// ─── Full News Articles ────────────────────────────────────────────────────────

export const mockNewsItems: NewsItem[] = [
  {
    id: 'nw1',
    title: 'SGSITS secures ₹2.4 Cr DST-SERB grant for renewable energy grid research',
    summary: 'Prof. R.K. Nema and team receive prestigious DST-SERB funding to develop intelligent power distribution grids.',
    content: `Shri Govindram Seksaria Institute of Technology and Science (SGSITS), Indore has achieved a significant milestone in academic research. The Department of Electrical Engineering has been awarded a prestigious research grant of ₹2.4 Crores by SERB, Government of India.`,
    category: 'Research',
    imageUrl: 'https://picsum.photos/seed/sgsfeature/800/500',
    publishedAt: '2026-05-15',
    publishedBy: 'SGSITS PR Cell',
    isActive: true,
    tags: ['Research', 'DST-SERB', 'Electrical Engineering', 'Renewable Energy'],
  },
  {
    id: 'nw2',
    title: 'AI Lab launches NVIDIA Jetson-based autonomous robot research program',
    summary: 'Students can now build and deploy edge-computing robots for real-world applications.',
    content: `The Department of Computer Engineering at SGSITS has officially inaugurated its advanced Robotics and Edge Computing initiative.`,
    category: 'Achievement',
    imageUrl: 'https://picsum.photos/seed/sgsai25/800/500',
    publishedAt: '2026-05-18',
    publishedBy: 'Dept. of CE',
    isActive: true,
    tags: ['Robotics', 'AI', 'NVIDIA', 'Computer Engineering'],
  },
  {
    id: 'nw3',
    title: 'Record ₹45 LPA package at Microsoft — highest in state for batch 2025',
    summary: 'A final-year CE student secured the highest campus placement in MP.',
    content: `In a historic moment, a final-year Computer Engineering student has secured an extraordinary placement package of ₹45 LPA at Microsoft.`,
    category: 'Achievement',
    imageUrl: 'https://picsum.photos/seed/sgspl25/800/500',
    publishedAt: '2026-05-12',
    publishedBy: 'T&P Cell',
    isActive: true,
    tags: ['Placement', 'Microsoft', 'Achievement'],
  },
  {
    id: 'nw4',
    title: 'SGSITS cricket team wins inter-university championship 2nd consecutive year',
    summary: 'The team defeated rival institutes in a hard-fought final at DAVV ground, Indore.',
    content: `The SGSITS Indore Cricket Team has etched its name in history by clinching the Inter-University Cricket Championship for the second consecutive year.`,
    category: 'Event',
    imageUrl: 'https://picsum.photos/seed/sgssp25/800/500',
    publishedAt: '2026-05-05',
    publishedBy: 'Sports Committee',
    isActive: true,
    tags: ['Sports', 'Cricket', 'Inter-University'],
  },
  {
    id: 'nw5',
    title: 'Pharmacy breakthrough: Novel drug carrier approved for oncology trials',
    summary: 'Bio-compatibility study paves new avenues for highly target-specific cancer treatments.',
    content: `The Department of Pharmacy at SGSITS Indore has announced a major scientific breakthrough with the development of a novel lipid-based nanocarrier.`,
    category: 'Research',
    imageUrl: 'https://picsum.photos/seed/sgsbio25/800/500',
    publishedAt: '2026-04-28',
    publishedBy: 'Dept. of Pharmacy',
    isActive: true,
    tags: ['Research', 'Pharmacy', 'Nanocarrier', 'Oncology'],
  },
  {
    id: 'nw6',
    title: 'New ₹8 Cr central instrumentation lab inaugurated by Hon. Governor',
    summary: 'Facility will support advanced research in materials science and nano-technology.',
    content: `A new chapter in advanced research has begun at SGSITS Indore with the formal inauguration of the state-of-the-art Central Instrumentation Laboratory (CIL).`,
    category: 'Achievement',
    imageUrl: 'https://picsum.photos/seed/sgsinf25/800/500',
    publishedAt: '2026-04-15',
    publishedBy: 'SGSITS PR Cell',
    isActive: true,
    tags: ['Infrastructure', 'Lab', 'Research'],
  },
  {
    id: 'nw7',
    title: 'SGSITS ranked #1 in M.P. in NIRF 2025 engineering rankings',
    summary: 'SGSITS ranked first among all engineering institutions in Madhya Pradesh.',
    content: `SGSITS, Indore has once again proven its academic supremacy by securing the #1 position in Madhya Pradesh in the prestigious NIRF 2025 engineering rankings.`,
    category: 'Achievement',
    imageUrl: 'https://picsum.photos/seed/sgsawd25/800/500',
    publishedAt: '2026-04-05',
    publishedBy: 'Academic Section',
    isActive: true,
    tags: ['NIRF', 'Ranking', 'Achievement'],
  },
  {
    id: 'nw8',
    title: 'MoU signed with Tata Technologies for student training programs',
    summary: '3-year partnership to provide 500+ students with hands-on automotive and manufacturing training.',
    content: `SGSITS Indore has signed a historic Memorandum of Understanding (MoU) with Tata Technologies for a three-year strategic partnership.`,
    category: 'Industry',
    imageUrl: 'https://picsum.photos/seed/sgsmou25/800/500',
    publishedAt: '2026-03-20',
    publishedBy: 'Industry Liaison Cell',
    isActive: true,
    tags: ['MoU', 'Tata Technologies', 'Training', 'Industry'],
  },
]

// ─── Home Page News Cards ─────────────────────────────────────────────────────
// These 4 cards are shown in the "Campus News" grid on the homepage.

export const mockHomeNewsCards: HomeNewsCard[] = [
  {
    id: 'hnc1',
    seed: 'sgsitsai',
    imageUrl: 'https://picsum.photos/seed/sgsitsai/400/300',
    category: 'Artificial Intelligence',
    title: "AI's Big Productivity Boost: Transforming Classroom Operations",
    description: 'Adaptive machine learning models simplify administrative tasks and personalise study paths.',
    to: '/news',
  },
  {
    id: 'hnc2',
    seed: 'sgsitshealth',
    imageUrl: 'https://picsum.photos/seed/sgsitshealth/400/300',
    category: 'Biomedical & Pharmacy',
    title: 'Pharmacy develops novel drug carrier mechanisms',
    description: 'A bio-compatibility breakthrough paves new avenues for target-specific oncology treatments.',
    to: '/news',
  },
  {
    id: 'hnc3',
    seed: 'sgsitsbiz',
    imageUrl: 'https://picsum.photos/seed/sgsitsbiz/400/300',
    category: 'Industry Outreach',
    title: 'Annual Industry-Academia Conclave sets record collaborations',
    description: 'Leading tech giants and PSUs sign MOUs for strategic student training partnerships.',
    to: '/news',
  },
  {
    id: 'hnc4',
    seed: 'sgsitsacad',
    imageUrl: 'https://picsum.photos/seed/sgsitsacad/400/300',
    category: 'Applied Sciences',
    title: 'Interdisciplinary courses blend technical coding with music theory',
    description: 'Students build synthesisers and algorithmic audio programs to understand Fourier series practically.',
    to: '/news',
  },
]

// ─── Home Page Featured News ──────────────────────────────────────────────────
// Two large featured cards in the campus news grid.

export const mockFeaturedNewsCards: FeaturedNewsCard[] = [
  {
    id: 'fn1',
    imageUrl: 'https://picsum.photos/seed/sgsitsmain/800/800',
    label: 'In The Spotlight',
    title: 'Pioneering Research in Renewable Energy: A Clean Future',
    description: 'SGSITS faculty and research scholars secure major grants to build intelligent power distribution grids for rural communities.',
    to: '/news',
  },
  {
    id: 'fn2',
    imageUrl: 'https://picsum.photos/seed/sgsitsengg/800/400',
    label: 'Societal Impact',
    title: 'Design for Accessibility: Engineering Robotics for Welfare',
    description: 'SGSITS students design low-cost assistive robotic limbs for local rehabilitation centres.',
    to: '/news',
  },
]

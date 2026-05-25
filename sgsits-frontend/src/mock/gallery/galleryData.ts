/**
 * MOCK: Gallery Albums & Photos
 * Replace with: GET /api/gallery/albums, GET /api/gallery/albums/:id/photos
 *
 * Consumed ONLY through src/services/mediaService.ts.
 */

import type { GalleryAlbum, GalleryPhoto } from '../../types'

// ─── Albums ──────────────────────────────────────────────────────────────────

export const mockGalleryAlbums: GalleryAlbum[] = [
  {
    id: 'alb1',
    title: 'Campus & Architecture',
    slug: 'campus-architecture',
    description: 'Main building, academic blocks and sprawling 52-acre campus grounds',
    coverImageUrl: 'https://picsum.photos/seed/sgsalb1/800/600',
    photoCount: 48,
    createdAt: '2026-01-10',
    isActive: true,
  },
  {
    id: 'alb2',
    title: 'Cultural Events — Rhythm',
    slug: 'cultural-events',
    description: 'Annual cultural festival with music, dance, drama and literary events',
    coverImageUrl: 'https://picsum.photos/seed/sgsalb2/800/600',
    photoCount: 62,
    createdAt: '2026-02-22',
    isActive: true,
  },
  {
    id: 'alb3',
    title: 'Technosearch 2026',
    slug: 'technical-festivals',
    description: 'Inter-college technical competition, robotics, paper presentations',
    coverImageUrl: 'https://picsum.photos/seed/sgsalb3/800/600',
    photoCount: 37,
    createdAt: '2026-02-08',
    isActive: true,
  },
  {
    id: 'alb4',
    title: 'Convocation Ceremony 2025',
    slug: 'convocation',
    description: 'Graduation ceremonies and degree distribution',
    coverImageUrl: 'https://picsum.photos/seed/sgsalb4/800/600',
    photoCount: 54,
    createdAt: '2025-12-20',
    isActive: true,
  },
]

// ─── Photos (per-album sample) ───────────────────────────────────────────────

const buildPhotos = (albumId: string, seedPrefix: string, count: number): GalleryPhoto[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${albumId}-p${i}`,
    albumId,
    caption: `Photo ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/${seedPrefix}${i}/600/400`,
    uploadedAt: '2026-01-01',
    uploadedBy: 'Admin',
  }))

export const mockGalleryPhotos: Record<string, GalleryPhoto[]> = {
  alb1: buildPhotos('alb1', 'sgsalb1p', 12),
  alb2: buildPhotos('alb2', 'sgsalb2p', 10),
  alb3: buildPhotos('alb3', 'sgsalb3p', 8),
  alb4: buildPhotos('alb4', 'sgsalb4p', 15),
}

// ─── Home page gallery thumbnails ────────────────────────────────────────────
// 12 thumbnail seeds shown in the Photo Gallery widget on the homepage.

export interface GalleryThumbnail {
  seed: string
  imageUrl: string
  alt: string
  to: string
}

export const mockHomeThumbnails: GalleryThumbnail[] = [
  'sgscamp1', 'sgscamp2', 'sgscamp3', 'sgscamp4',
  'sgscamp5', 'sgscamp6', 'sgscamp7', 'sgscamp8',
  'sgscamp9', 'sgscamp10', 'sgscamp11', 'sgscamp12',
].map((seed, idx) => ({
  seed,
  imageUrl: `https://picsum.photos/seed/${seed}/200/200`,
  alt: `Campus ${idx + 1}`,
  to: '/explore/gallery',
}))

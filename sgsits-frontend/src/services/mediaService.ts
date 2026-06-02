/**
 * Media / Gallery Service — wired to GS-Website backend
 * Backend: GET /api/v1/gallery
 */

import apiClient from '../api/client'
import type { GalleryAlbum, GalleryPhoto } from '../types'

// Fields match exactly what Home.tsx gallery JSX reads: to, imageUrl, alt
export interface GalleryThumbnail {
  id: string
  to: string
  imageUrl: string
  alt: string
}

function mapGalleryItem(g: Record<string, unknown>): GalleryAlbum {
  return {
    id:          String(g.id),
    title:       String(g.title || ''),
    description: String(g.description || ''),
    imageUrl:    String(g.file_url || g.imageUrl || ''),
    isActive:    g.status === 'ACTIVE',
    date:        String(g.created_at || ''),
    photos:      [],
  }
}

export const getGalleryAlbums = async (): Promise<GalleryAlbum[]> => {
  try {
    const res = await apiClient.get('/v1/gallery', { params: { status: 'ACTIVE', pageSize: 50 } })
    const data = res.data?.data?.images ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map(mapGalleryItem) : []
  } catch {
    return []
  }
}

export const getAlbumPhotos = async (albumId: string): Promise<GalleryPhoto[]> => {
  try {
    const res = await apiClient.get(`/v1/gallery/${albumId}`)
    const d = res.data?.data
    return d ? [{ id: String(d.id), url: String(d.file_url || ''), title: String(d.title || '') }] : []
  } catch {
    return []
  }
}

export const getHomeGalleryThumbnails = async (): Promise<GalleryThumbnail[]> => {
  try {
    const res = await apiClient.get('/v1/gallery', { params: { status: 'ACTIVE', pageSize: 12 } })
    const data: Record<string, unknown>[] = res.data?.data?.images ?? res.data?.data ?? []
    return data.slice(0, 12).map(g => ({
      id:       String(g.id),
      to:       '/explore/gallery',
      imageUrl: String(g.file_url || ''),
      alt:      String(g.title || 'SGSITS Campus'),
    }))
  } catch {
    return []
  }
}

// Admin CRUD
export const uploadGalleryImage = async (formData: FormData): Promise<GalleryAlbum> => {
  const res = await apiClient.post('/v1/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return mapGalleryItem(res.data.data)
}

export const deleteGalleryImage = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/v1/gallery/${id}`)
}

export const mediaService = {
  getGalleryAlbums, getAlbumPhotos, getHomeGalleryThumbnails,
  uploadGalleryImage, deleteGalleryImage,
}

export default mediaService

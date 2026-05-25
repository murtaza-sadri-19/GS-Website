/**
 * News Service — wired to GS-Website backend
 * Backend: GET /api/v1/news
 */

import apiClient from '../api/client'
import {
  mockNewsItems,
  mockHomeNewsCards,
  mockFeaturedNewsCards,
  type HomeNewsCard,
  type FeaturedNewsCard,
} from '../mock/news/newsData'
import type { NewsItem } from '../types'

function mapNews(n: Record<string, unknown>): NewsItem {
  return {
    id:          String(n.id),
    title:       String(n.title || ''),
    excerpt:     String(n.excerpt || ''),
    content:     String(n.content || ''),
    imageUrl:    n.cover_img_url ? String(n.cover_img_url) : undefined,
    category:    String(n.category || 'GENERAL'),
    author:      String(n.author_name || ''),
    date:        String(n.published_at || n.created_at || ''),
    isActive:    n.status === 'PUBLISHED',
    slug:        String(n.slug || n.id),
  }
}

export const getAllNews = async (): Promise<NewsItem[]> => {
  try {
    const res = await apiClient.get('/v1/news', { params: { pageSize: 50 } })
    const data = res.data?.data?.articles ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map(mapNews) : []
  } catch {
    return mockNewsItems.filter(n => n.isActive)
  }
}

export const getHomeNewsCards = async (): Promise<HomeNewsCard[]> => {
  try {
    const res = await apiClient.get('/v1/news', { params: { pageSize: 4 } })
    const data: Record<string, unknown>[] = res.data?.data?.articles ?? res.data?.data ?? []
    return data.slice(0, 4).map(n => ({
      id:      String(n.id),
      title:   String(n.title),
      excerpt: String(n.excerpt || ''),
      date:    String(n.published_at || n.created_at || ''),
      image:   n.cover_img_url ? String(n.cover_img_url) : '',
      slug:    String(n.slug || n.id),
    }))
  } catch {
    return [...mockHomeNewsCards]
  }
}

export const getFeaturedNewsCards = async (): Promise<FeaturedNewsCard[]> => {
  try {
    const res = await apiClient.get('/v1/news', { params: { pageSize: 2 } })
    const data: Record<string, unknown>[] = res.data?.data?.articles ?? res.data?.data ?? []
    return data.slice(0, 2).map(n => ({
      id:      String(n.id),
      title:   String(n.title),
      excerpt: String(n.excerpt || ''),
      date:    String(n.published_at || n.created_at || ''),
      image:   n.cover_img_url ? String(n.cover_img_url) : '',
      slug:    String(n.slug || n.id),
    }))
  } catch {
    return [...mockFeaturedNewsCards]
  }
}

export const getNewsById = async (id: string): Promise<NewsItem | null> => {
  try {
    const res = await apiClient.get(`/v1/news/${id}`)
    const n = res.data?.data
    return n ? mapNews(n) : null
  } catch {
    return mockNewsItems.find(n => n.id === id) ?? null
  }
}

export const getNewsBySlug = async (slug: string): Promise<NewsItem | null> => {
  try {
    const res = await apiClient.get(`/v1/news/slug/${slug}`)
    const n = res.data?.data
    return n ? mapNews(n) : null
  } catch {
    return mockNewsItems.find(n => (n as unknown as Record<string, unknown>).slug === slug) ?? null
  }
}

// Admin CRUD
export const createNews = async (dto: Record<string, unknown>): Promise<NewsItem> => {
  const res = await apiClient.post('/v1/news', dto)
  return mapNews(res.data.data)
}

export const updateNews = async (id: string | number, dto: Record<string, unknown>): Promise<NewsItem> => {
  const res = await apiClient.put(`/v1/news/${id}`, dto)
  return mapNews(res.data.data)
}

export const setNewsStatus = async (id: string | number, status: string): Promise<NewsItem> => {
  const res = await apiClient.patch(`/v1/news/${id}/status`, { status })
  return mapNews(res.data.data)
}

export const deleteNews = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/v1/news/${id}`)
}

export const newsService = {
  getAllNews, getHomeNewsCards, getFeaturedNewsCards, getNewsById, getNewsBySlug,
  createNews, updateNews, setNewsStatus, deleteNews,
}

export default newsService

export type { HomeNewsCard, FeaturedNewsCard }

/**
 * News Service — wired to GS-Website backend
 * Backend: GET /api/v1/news
 */

import apiClient from '../api/client'
import type { NewsItem } from '../types'

// Fields match exactly what Home.tsx JSX reads: to, category, title, description, imageUrl
export interface HomeNewsCard {
  id: string
  to: string
  title: string
  category: string
  description: string
  imageUrl: string
}

// Fields match exactly what Home.tsx featured card JSX reads: to, label, title, description, imageUrl
export interface FeaturedNewsCard {
  id: string
  to: string
  label: string
  title: string
  description: string
  imageUrl: string
}

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
    return []
  }
}

export const getHomeNewsCards = async (): Promise<HomeNewsCard[]> => {
  try {
    const res = await apiClient.get('/v1/news', { params: { status: 'PUBLISHED', pageSize: 4 } })
    const data: Record<string, unknown>[] = res.data?.data?.articles ?? res.data?.data ?? []
    return data.slice(0, 4).map(n => ({
      id:          String(n.id),
      to:          `/news/${String(n.slug || n.id)}`,
      title:       String(n.title),
      category:    String(n.category || 'GENERAL'),
      description: String(n.excerpt || ''),
      imageUrl:    n.cover_img_url ? String(n.cover_img_url) : '',
    }))
  } catch {
    return []
  }
}

export const getFeaturedNewsCards = async (): Promise<FeaturedNewsCard[]> => {
  try {
    const res = await apiClient.get('/v1/news', { params: { status: 'PUBLISHED', pageSize: 2 } })
    const data: Record<string, unknown>[] = res.data?.data?.articles ?? res.data?.data ?? []
    return data.slice(0, 2).map(n => ({
      id:          String(n.id),
      to:          `/news/${String(n.slug || n.id)}`,
      label:       String(n.category || 'LATEST'),
      title:       String(n.title),
      description: String(n.excerpt || ''),
      imageUrl:    n.cover_img_url ? String(n.cover_img_url) : '',
    }))
  } catch {
    return []
  }
}

export const getNewsById = async (id: string): Promise<NewsItem | null> => {
  try {
    const res = await apiClient.get(`/v1/news/${id}`)
    const n = res.data?.data
    return n ? mapNews(n) : null
  } catch {
    return null
  }
}

export const getNewsBySlug = async (slug: string): Promise<NewsItem | null> => {
  try {
    const res = await apiClient.get(`/v1/news/slug/${slug}`)
    const n = res.data?.data
    return n ? mapNews(n) : null
  } catch {
    return null
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

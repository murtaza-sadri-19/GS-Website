/**
 * Events Service — wired to GS-Website backend
 * Backend: GET/POST/PUT/PATCH/DELETE /api/v1/events
 */

import apiClient from '../api/client'
import { mockEvents } from '../mock/events/eventsData'
import type { Event } from '../types'

function mapEvent(e: Record<string, unknown>): Event {
  return {
    id:          String(e.id),
    title:       String(e.title || ''),
    description: String(e.description || ''),
    date:        String(e.event_date || ''),
    imageUrl:    e.cover_image_url ? String(e.cover_image_url) : undefined,
    isActive:    e.status === 'PUBLISHED',
    slug:        String(e.slug || e.id),
  }
}

export const getEvents = async (): Promise<Event[]> => {
  try {
    const res = await apiClient.get('/v1/events', { params: { status: 'PUBLISHED', pageSize: 50 } })
    const data = res.data?.data?.events ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map(mapEvent) : []
  } catch {
    return mockEvents.filter(e => e.isActive)
  }
}

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const res = await apiClient.get(`/v1/events/${id}`)
    const e = res.data?.data
    return e ? mapEvent(e) : null
  } catch {
    return mockEvents.find(e => e.id === id) ?? null
  }
}

// Admin CRUD
export const createEvent = async (dto: Record<string, unknown>): Promise<Event> => {
  const res = await apiClient.post('/v1/events', dto)
  return mapEvent(res.data.data)
}

export const updateEvent = async (id: string | number, dto: Record<string, unknown>): Promise<Event> => {
  const res = await apiClient.put(`/v1/events/${id}`, dto)
  return mapEvent(res.data.data)
}

export const setEventStatus = async (id: string | number, status: string): Promise<Event> => {
  const res = await apiClient.patch(`/v1/events/${id}/status`, { status })
  return mapEvent(res.data.data)
}

export const deleteEvent = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/v1/events/${id}`)
}

export const eventsService = {
  getEvents, getEventById,
  createEvent, updateEvent, setEventStatus, deleteEvent,
}

export default eventsService

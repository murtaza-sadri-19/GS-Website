import apiClient from '../api/client'
import type { Tender, TenderStatus } from '../types'

export type { Tender, TenderStatus }

export interface PublicEvent {
  id: string
  title: string
  description: string
  date: string
  venue: string
  category: string
  imageUrl?: string
  registrationUrl?: string
}

export const getTenders = async (): Promise<Tender[]> => {
  try {
    const res = await apiClient.get('/v1/tenders', { params: { pageSize: 50 } })
    return res.data?.data?.tenders ?? res.data?.data ?? []
  } catch { return [] }
}

export const getOpenTenders = async (): Promise<Tender[]> => {
  try {
    const res = await apiClient.get('/v1/tenders', { params: { status: 'PUBLISHED', pageSize: 50 } })
    return res.data?.data?.tenders ?? res.data?.data ?? []
  } catch { return [] }
}

export const getTenderMeta = async () => {
  try {
    const { getCmsSection } = await import('./settingsService')
    const info = await getCmsSection<Record<string, unknown>>('contact.info')
    const offices: Record<string, unknown>[] = Array.isArray(info?.offices) ? info.offices as Record<string, unknown>[] : []
    const purchaseOffice = offices.find(o => String(o.name ?? '').toLowerCase().includes('purchase') || String(o.name ?? '').toLowerCase().includes('tender'))
    return {
      contactEmail: purchaseOffice?.email ?? 'purchase@sgsits.ac.in',
      contactPhone: purchaseOffice?.phone ?? '0731-2582115',
      note: 'All tender documents are available for download. Interested vendors must submit bids before the last date.',
    }
  } catch {
    return {}
  }
}

export const getPublicEvents = async (): Promise<PublicEvent[]> => {
  try {
    const res = await apiClient.get('/v1/events', { params: { status: 'PUBLISHED', pageSize: 20 } })
    return res.data?.data?.events ?? res.data?.data ?? []
  } catch { return [] }
}

export const tendersDefault: Tender[] = []
export const publicEventsDefault: PublicEvent[] = []

export const livefeedService = { getTenders, getOpenTenders, getTenderMeta, getPublicEvents }
export default livefeedService

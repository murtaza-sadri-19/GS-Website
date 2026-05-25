/**
 * Livefeed Service — Public tenders and events
 *
 * MOCK MODE — Returns mock data instantly.
 * Components MUST call this service — never import mock data directly.
 */

import {
  mockTenders,      type Tender,      type TenderStatus,
  mockTenderMeta,
  mockPublicEvents, type PublicEvent,
} from '../mock/livefeed/livefeedData'

export type { Tender, TenderStatus, PublicEvent }

export const getTenders = async (): Promise<Tender[]> => {
  return [...mockTenders]
  // REAL: return apiClient.get('/livefeed/tenders').then(r => r.data.data)
}

export const getOpenTenders = async (): Promise<Tender[]> => {
  return mockTenders.filter(t => t.status === 'Open')
  // REAL: return apiClient.get('/livefeed/tenders?status=Open').then(r => r.data.data)
}

export const getTenderMeta = async () => {
  return { ...mockTenderMeta }
  // REAL: return apiClient.get('/livefeed/tender-meta').then(r => r.data.data)
}

export const getPublicEvents = async (): Promise<PublicEvent[]> => {
  return [...mockPublicEvents]
  // REAL: return apiClient.get('/livefeed/events').then(r => r.data.data)
}

// ─── Defaults ────────────────────────────────────────────────────────────────
export const tendersDefault: Tender[]           = mockTenders
export const publicEventsDefault: PublicEvent[] = mockPublicEvents

export const livefeedService = {
  getTenders, getOpenTenders, getTenderMeta, getPublicEvents,
}

export default livefeedService

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

export type CacheKey = 'notices' | 'events' | 'tenders' | 'tenderMeta' | 'news' | 'home'

interface CacheEntry {
  data: unknown
  loadedAt: number
}

interface NoticesUIState { search: string; category: string; page: number }
interface NewsUIState { search: string; category: string }

interface PageCacheState {
  cache: Partial<Record<CacheKey, CacheEntry>>
  noticesUI: NoticesUIState
  newsUI: NewsUIState

  setCache: (key: CacheKey, data: unknown) => void
  invalidate: (...keys: CacheKey[]) => void
  invalidateAll: () => void
  isValid: (key: CacheKey, ttl?: number) => boolean
  setNoticesUI: (ui: Partial<NoticesUIState>) => void
  setNewsUI: (ui: Partial<NewsUIState>) => void
}

export const usePageCacheStore = create<PageCacheState>()(
  persist(
    (set, get) => ({
      cache: {},
      noticesUI: { search: '', category: 'all', page: 1 },
      newsUI: { search: '', category: 'All' },

      setCache: (key, data) =>
        set(s => ({
          cache: { ...s.cache, [key]: { data, loadedAt: Date.now() } },
        })),

      invalidate: (...keys) =>
        set(s => {
          const next = { ...s.cache }
          keys.forEach(k => delete next[k])
          return { cache: next }
        }),

      invalidateAll: () => set({ cache: {} }),

      isValid: (key, ttl = CACHE_TTL_MS) => {
        const entry = get().cache[key]
        return !!entry && Date.now() - entry.loadedAt < ttl
      },

      setNoticesUI: ui => set(s => ({ noticesUI: { ...s.noticesUI, ...ui } })),
      setNewsUI: ui => set(s => ({ newsUI: { ...s.newsUI, ...ui } })),
    }),
    { name: 'sgsits-page-cache' }
  )
)

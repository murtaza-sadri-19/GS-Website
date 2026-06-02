import { useState, useEffect, useCallback, useRef } from 'react'
import { usePageCacheStore, type CacheKey } from '../store/pageCacheStore'
import { useAppStore } from '../store/appStore'

const DEFAULT_TTL = 10 * 60 * 1000 // 10 minutes

/**
 * Fetch-once page data hook backed by persistent Zustand cache.
 *
 * Returns
 * -------
 * data        — cached value (null if not yet fetched)
 * loading     — true only when a skeleton should be shown:
 *               app is ready AND actively fetching AND no existing data.
 *               Use this to toggle skeleton vs content.
 * isFetching  — raw in-flight indicator for spinners / disabled states.
 *               True whenever a fetch is running, even during background
 *               refetches where data already exists.
 * refresh     — force-refetch ignoring cache age.
 *
 * Rules implemented
 * -----------------
 * Rule 1 – loading is false while global preloader is active (!isAppReady)
 *           → no skeleton bleeds through the loading shield.
 * Rule 4 – loading is false when cached data already exists, even during a
 *           background refetch → existing content stays visible.
 * Rule 5 – if cached data exists at mount time, loading starts as false
 *           → content renders immediately, no skeleton flash.
 */
export function usePageData<T>(
  cacheKey: CacheKey,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL
) {
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const entry    = usePageCacheStore(s => s.cache[cacheKey])
  const setCache = usePageCacheStore(s => s.setCache)
  const isAppReady = useAppStore(s => s.isAppReady)

  const isValid = !!entry && Date.now() - entry.loadedAt < ttl
  const [isFetching, setIsFetching] = useState(!isValid)

  const doFetch = useCallback(async () => {
    setIsFetching(true)
    try {
      const result = await fetcherRef.current()
      setCache(cacheKey, result)
    } catch (err) {
      console.error(`[pageCache] "${cacheKey}" fetch failed:`, err)
    } finally {
      setIsFetching(false)
    }
  }, [cacheKey, setCache])

  useEffect(() => {
    if (!isValid) {
      doFetch()
    }
    // Intentionally run only on mount — cache validity is checked once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Skeleton guard: only show skeleton when ALL of:
  //   1. App initial load is complete (no skeleton during preloader phase)
  //   2. A fetch is actually in flight
  //   3. No existing data to display (don't replace content with skeleton)
  const loading = isAppReady && isFetching && !entry?.data

  return {
    data: (entry?.data ?? null) as T | null,
    loading,
    isFetching,
    refresh: doFetch,
  }
}

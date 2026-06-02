import { useState } from 'react'
import { useAppStore } from '../store/appStore'

/**
 * Drop-in replacement for `useState(true)` on loading flags.
 *
 * Gates the loading state behind `isAppReady` so that:
 *  - Skeletons never appear during the global preloader phase (Rule 1)
 *  - Background refetches after data exists never re-show skeletons (Rule 4)
 *  - Page refresh shows only the global preloader, not page skeletons (Rule 1)
 *
 * Usage — replace:
 *   const [loading, setLoading] = useState(true)
 * with:
 *   const [loading, setLoading] = useGatedLoading()
 */
export function useGatedLoading(initial = true): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const isAppReady = useAppStore(s => s.isAppReady)
  const [_loading, setLoading] = useState(initial)
  return [isAppReady && _loading, setLoading]
}

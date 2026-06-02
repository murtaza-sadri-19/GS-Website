/**
 * Formerly added artificial latency so skeleton loaders were visible during
 * local development. Now a no-op — skeletons are driven purely by real API
 * response times. The export is kept so existing call-sites compile without
 * changes; tree-shaking removes it in production builds.
 */
export const devDelay = (): Promise<void> => Promise.resolve()

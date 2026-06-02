import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import router from './routes/routes'
import Preloader from './components/global/Preloader'
import { useAppStore } from './store/appStore'
import { themeService } from './services/themeService'

import './index.css'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

/**
 * Loading shield sits between the preloader (z-99999) and page content.
 * It keeps the screen opaque while the preloader fades out, so no skeleton
 * content bleeds through during the fade animation. Removed the instant
 * markAppReady() fires (same React render batch as preloader unmount).
 */
const LoadingShield: React.FC = () => {
  const isAppReady = useAppStore(s => s.isAppReady)
  if (isAppReady) return null
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        backgroundColor: '#ffffff',
        pointerEvents: 'none',
      }}
    />
  )
}

const ThemeLoader: React.FC = () => {
  useEffect(() => {
    themeService.getThemeColors().then(themeService.applyTheme)
  }, [])
  return null
}

const AppContent: React.FC = () => (
  <>
    <ThemeLoader />
    <Preloader />
    <LoadingShield />
    <RouterProvider router={router} />
  </>
)

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
)

export default App

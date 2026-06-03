import React, { Suspense } from 'react'
import { SkeletonPage } from '../components/ui/Skeleton'
import { useAppStore } from '../store/appStore'

// Suspense wrapper — shows SkeletonPage after app boot, null during preloader
export const S: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAppReady = useAppStore(s => s.isAppReady)
  return (
    <Suspense fallback={isAppReady ? <SkeletonPage /> : null}>
      {children}
    </Suspense>
  )
}

// Breadcrumb metadata helper
export const bc = (label: string) => ({ breadcrumb: label })

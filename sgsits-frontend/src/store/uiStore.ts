import { create } from 'zustand'

export interface UIState {
  alertsModalOpen: boolean
  openAlertsModal: () => void
  closeAlertsModal: () => void
  mobileMenuOpen: boolean
  toggleMobileMenu: () => void
  fontSize: 'sm' | 'base' | 'lg'
  highContrast: boolean
  setFontSize: (sz: 'sm' | 'base' | 'lg') => void
  toggleContrast: () => void
  pageLoading: boolean
  setPageLoading: (v: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  alertsModalOpen: false,
  openAlertsModal: () => set({ alertsModalOpen: true }),
  closeAlertsModal: () => set({ alertsModalOpen: false }),
  
  mobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  
  fontSize: 'base',
  highContrast: false,
  setFontSize: (sz) => set({ fontSize: sz }),
  toggleContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  
  pageLoading: false,
  setPageLoading: (v) => set({ pageLoading: v }),
}))

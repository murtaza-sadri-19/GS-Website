import { create } from 'zustand'

interface AppState {
  /** False until the initial page-load preloader has finished. Never persisted — resets on every hard refresh. */
  isAppReady: boolean
  markAppReady: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isAppReady: false,
  markAppReady: () => set({ isAppReady: true }),
}))

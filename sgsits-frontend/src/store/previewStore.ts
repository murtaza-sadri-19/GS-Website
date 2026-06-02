import { create } from 'zustand'

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile'

interface PreviewState {
  data: any | null
  device: PreviewDevice
  isOpen: boolean
  setData: (data: any) => void
  setDevice: (d: PreviewDevice) => void
  setOpen: (open: boolean) => void
}

export const usePreviewStore = create<PreviewState>((set) => ({
  data: null,
  device: 'desktop',
  isOpen: false,
  setData: (data) => set({ data }),
  setDevice: (device) => set({ device }),
  setOpen: (isOpen) => set({ isOpen }),
}))

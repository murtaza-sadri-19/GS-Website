import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '../types'

export interface AdminState {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  isFaculty: () => boolean
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token,
      isAdmin: () => ['super_admin', 'central_admin', 'editor'].includes(get().user?.role?.toLowerCase() ?? ''),
      isFaculty: () => ['faculty', 'teacher', 'hod'].includes(get().user?.role?.toLowerCase() ?? ''),
    }),
    {
      name: 'sgsits-admin-auth',
    }
  )
)

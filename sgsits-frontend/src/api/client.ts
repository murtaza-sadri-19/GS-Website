/**
 * SGSITS Frontend — Axios API Client
 *
 * Base URL is read from VITE_API_BASE_URL environment variable.
 * Set this in .env.local:  VITE_API_BASE_URL=http://localhost:8000/api
 *
 * All authenticated requests automatically include the Bearer token
 * from localStorage (saved by Zustand adminStore).
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
})

// ── Request interceptor — attach auth token ────────────────────────────────
apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('sgsits-admin-auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      const token = parsed?.state?.token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
  } catch {
    // ignore parse errors
  }
  return config
})

// ── Response interceptor — handle 401 ─────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Clear auth and redirect to login
      localStorage.removeItem('sgsits-admin-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

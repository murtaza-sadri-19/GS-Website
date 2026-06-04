import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND = 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward /api/* to the Express backend (catches any relative API calls)
      '/api': { target: BACKEND, changeOrigin: true },
      // Forward /uploads/* so img src="/uploads/..." works from the Vite dev server
      '/uploads': { target: BACKEND, changeOrigin: true },
    },
  },
})

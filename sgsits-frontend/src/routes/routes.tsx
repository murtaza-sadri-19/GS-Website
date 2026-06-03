import React, { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ErrorBoundary from '../components/global/ErrorBoundary'
import { S } from './routeHelpers'
import { publicRoutes } from './publicRoutes'
import { adminRoutes } from './adminRoutes'
import { hodRoutes, teacherRoutes, examRoutes, placementOfficerRoutes } from './portalRoutes'

const Login         = lazy(() => import('../pages/Login'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    children: [
      // ── Public routes (MainLayout) ────────────────────────────────────────
      publicRoutes,

      // ── Auth ──────────────────────────────────────────────────────────────
      { path: '/login', element: <S><Login /></S> },
      { path: '/reset-password', element: <S><ResetPassword /></S> },
      { path: '/admin/login', element: <Navigate to="/login" replace /> },

      // ── Dashboard portals ─────────────────────────────────────────────────
      {
        path: '/dashboard',
        children: [
          adminRoutes,
          hodRoutes,
          teacherRoutes,
          examRoutes,
          placementOfficerRoutes,
        ],
      },

      // ── Back-compat redirects ─────────────────────────────────────────────
      { path: '/admin',   element: <Navigate to="/dashboard/central-admin/dashboard" replace /> },
      { path: '/admin/*', element: <Navigate to="/dashboard/central-admin/dashboard" replace /> },
      { path: '/hod',     element: <Navigate to="/dashboard/hod/dashboard" replace /> },
      { path: '/hod/*',   element: <Navigate to="/dashboard/hod/dashboard" replace /> },
      { path: '/faculty', element: <Navigate to="/dashboard/teacher/dashboard" replace /> },
      { path: '/exam',    element: <Navigate to="/dashboard/exam/dashboard" replace /> },
      { path: '/exam/*',  element: <Navigate to="/dashboard/exam/dashboard" replace /> },
    ],
  },
])

export default router

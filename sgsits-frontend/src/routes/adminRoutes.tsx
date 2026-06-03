import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute'
import { S } from './routeHelpers'

const AdminDashboard    = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminNotices      = lazy(() => import('../pages/admin/AdminNotices'))
const AdminNews         = lazy(() => import('../pages/admin/AdminNews'))
const AdminEvents       = lazy(() => import('../pages/admin/AdminEvents'))
const AdminTenders      = lazy(() => import('../pages/admin/AdminTenders'))
const AdminAlerts       = lazy(() => import('../pages/admin/AdminAlerts'))
const AdminDepartments  = lazy(() => import('../pages/admin/AdminDepartments'))
const AdminFaculty      = lazy(() => import('../pages/admin/AdminFaculty'))
const AdminGallery      = lazy(() => import('../pages/admin/AdminGallery'))
const AdminPlacement    = lazy(() => import('../pages/admin/AdminPlacement'))
const AdminSettings     = lazy(() => import('../pages/admin/AdminSettings'))
const AdminTheme        = lazy(() => import('../pages/admin/AdminTheme'))
const AdminUsers        = lazy(() => import('../pages/admin/AdminUsers'))
const AdminDownloads    = lazy(() => import('../pages/admin/AdminDownloads'))
const AdminStaticPages  = lazy(() => import('../pages/admin/AdminStaticPages'))
const AdminFooter       = lazy(() => import('../pages/admin/AdminFooter'))
const AdminCmsHealth    = lazy(() => import('../pages/admin/AdminCmsHealth'))
const AdminPortalStaff  = lazy(() => import('../pages/admin/AdminPortalStaff'))
const AdminPolicies     = lazy(() => import('../pages/admin/AdminPolicies'))
const AdminCmsContent   = lazy(() => import('../pages/admin/AdminCmsContent'))
const AdminMediaManager = lazy(() => import('../pages/admin/AdminMediaManager'))
const AdminHomePage     = lazy(() => import('../pages/admin/AdminHomePage'))
const AdminAuditLogs    = lazy(() => import('../pages/admin/AdminAuditLogs'))

export const adminRoutes = {
  path: 'central-admin',
  children: [{
    element: <AdminProtectedRoute />,
    children: [{
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard',          element: <S><AdminDashboard /></S> },
        { path: 'portal-staff',       element: <S><AdminPortalStaff /></S> },
        { path: 'users',              element: <S><AdminUsers /></S> },
        { path: 'departments',        element: <S><AdminDepartments /></S> },
        { path: 'notices',            element: <S><AdminNotices /></S> },
        { path: 'downloads',          element: <S><AdminDownloads /></S> },
        { path: 'events',             element: <S><AdminEvents /></S> },
        { path: 'gallery',            element: <S><AdminGallery /></S> },
        { path: 'pages',              element: <S><AdminStaticPages /></S> },
        { path: 'news',               element: <S><AdminNews /></S> },
        { path: 'tenders',            element: <S><AdminTenders /></S> },
        { path: 'alerts',             element: <S><AdminAlerts /></S> },
        { path: 'faculty',            element: <S><AdminFaculty /></S> },
        { path: 'placement',          element: <S><AdminPlacement /></S> },
        { path: 'settings',           element: <S><AdminSettings /></S> },
        { path: 'theme',              element: <S><AdminTheme /></S> },
        { path: 'footer',             element: <S><AdminFooter /></S> },
        { path: 'system/cms-health',  element: <S><AdminCmsHealth /></S> },
        { path: 'policies',           element: <S><AdminPolicies /></S> },
        { path: 'cms-content',        element: <S><AdminCmsContent /></S> },
        { path: 'media',              element: <S><AdminMediaManager /></S> },
        { path: 'home',               element: <S><AdminHomePage /></S> },
        { path: 'audit-logs',         element: <S><AdminAuditLogs /></S> },
      ],
    }],
  }],
}

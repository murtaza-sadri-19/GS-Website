import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

const AdminProtectedRoute: React.FC = () => {
  const token = useAdminStore((state) => state.token)

  // Redirect to admin login if authentication token is not present
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Render dashboard nested pages if authenticated
  return <Outlet />
}

export default AdminProtectedRoute

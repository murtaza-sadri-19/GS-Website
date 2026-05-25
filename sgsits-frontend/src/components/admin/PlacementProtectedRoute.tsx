import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

const PlacementProtectedRoute: React.FC = () => {
  const token = useAdminStore((state) => state.token)
  const user = useAdminStore((state) => state.user)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const roleLower = user?.role?.toLowerCase()
  if (
    roleLower !== 'placement_officer' &&
    roleLower !== 'super_admin' &&
    roleLower !== 'central_admin'
  ) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default PlacementProtectedRoute

import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

const FacultyProtectedRoute: React.FC = () => {
  const token = useAdminStore((state) => state.token)
  const user = useAdminStore((state) => state.user)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Faculty + HOD (HOD is a faculty member who can also use faculty tooling)
  // + super_admin for inspection
  const roleLower = user?.role?.toLowerCase()
  if (
    roleLower !== 'teacher' &&
    roleLower !== 'faculty' &&
    roleLower !== 'hod' &&
    roleLower !== 'super_admin'
  ) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default FacultyProtectedRoute

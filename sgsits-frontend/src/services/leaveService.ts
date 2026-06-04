/**
 * Leave Management Service
 *
 * Endpoints:
 *   GET  /leaves/types           — list active leave types (public)
 *   GET  /leaves/balance         — own leave balance (TEACHER/HOD)
 *   GET  /leaves/me              — own leave applications
 *   POST /leaves                 — apply for leave
 *   GET  /leaves                 — HOD review queue
 *   PUT  /leaves/:id/approve     — approve
 *   PUT  /leaves/:id/reject      — reject
 *   GET  /leaves/policies        — list policies (HOD/Admin)
 *   POST /leaves/policies        — create policy
 *   PUT  /leaves/policies/:id    — update policy
 *   DELETE /leaves/policies/:id  — delete policy
 */

import apiClient from '../api/client'

// ── Types ────────────────────────────────────────────────────────────────────

export interface LeaveType {
  id:          number
  name:        string
  code:        string
  description: string | null
  color:       string
  is_active:   1 | 0
}

export interface LeaveBalance {
  leave_type_id:       number
  leave_type:          string
  code:                string
  color:               string
  requires_attachment: boolean
  allocated:           number
  consumed:            number
  remaining:           number
  academic_year:       string
}

export interface LeavePolicy {
  id:                          number
  leave_type_id:               number
  leave_type_name:             string
  leave_type_code:             string
  leave_type_color:            string
  role:                        string
  department_id:               number | null
  department_name:             string | null
  academic_year:               string
  max_days:                    number
  carry_forward:               0 | 1
  requires_attachment:         0 | 1
  requires_hod_approval:       0 | 1
  requires_principal_approval: 0 | 1
}

export interface LeaveApplication {
  id:              number
  leave_type:      string
  leave_type_id:   number | null
  from_date:       string
  to_date:         string
  days_count:      number
  reason:          string
  status:          'pending' | 'approved' | 'rejected'
  applied_at:      string
  review_remarks:  string | null
  applicant_name:  string
  applicant_email: string
  reviewer_name:   string | null
  department_id:   number | null
  academic_year:   string | null
}

// ── Leave Types ───────────────────────────────────────────────────────────────

export const getLeaveTypes = async (): Promise<LeaveType[]> => {
  try {
    const res = await apiClient.get('/v1/leaves/types')
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

export const createLeaveType = async (data: Partial<LeaveType>): Promise<LeaveType> => {
  const res = await apiClient.post('/v1/leaves/types', data)
  return res.data.data
}

export const updateLeaveType = async (id: number, data: Partial<LeaveType>): Promise<LeaveType> => {
  const res = await apiClient.put(`/v1/leaves/types/${id}`, data)
  return res.data.data
}

export const deleteLeaveType = async (id: number): Promise<void> => {
  await apiClient.delete(`/v1/leaves/types/${id}`)
}

// ── Leave Balance ─────────────────────────────────────────────────────────────

export const getMyLeaveBalance = async (academicYear?: string): Promise<LeaveBalance[]> => {
  try {
    const res = await apiClient.get('/v1/leaves/balance', { params: academicYear ? { academic_year: academicYear } : {} })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

export const getUserLeaveBalance = async (userId: number, academicYear?: string): Promise<LeaveBalance[]> => {
  try {
    const res = await apiClient.get(`/v1/leaves/balance/${userId}`, { params: academicYear ? { academic_year: academicYear } : {} })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

// ── Leave Applications ────────────────────────────────────────────────────────

export const getMyLeaves = async (params?: { status?: string }): Promise<LeaveApplication[]> => {
  try {
    const res = await apiClient.get('/v1/leaves/me', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

export const applyLeave = async (data: {
  leave_type_id: number
  from_date: string
  to_date: string
  reason: string
  attachment_file_id?: number | null
}): Promise<LeaveApplication> => {
  const res = await apiClient.post('/v1/leaves', data)
  return res.data.data
}

export const getLeaveQueue = async (params?: { status?: string; department_id?: number }): Promise<LeaveApplication[]> => {
  try {
    const res = await apiClient.get('/v1/leaves', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

export const approveLeaveRequest = async (id: number, remarks?: string): Promise<LeaveApplication> => {
  const res = await apiClient.put(`/v1/leaves/${id}/approve`, { remarks })
  return res.data.data
}

export const rejectLeaveRequest = async (id: number, remarks?: string): Promise<LeaveApplication> => {
  const res = await apiClient.put(`/v1/leaves/${id}/reject`, { remarks })
  return res.data.data
}

// ── Leave Policies ────────────────────────────────────────────────────────────

export const getLeavePolicies = async (params?: {
  academic_year?: string; role?: string; department_id?: number
}): Promise<LeavePolicy[]> => {
  try {
    const res = await apiClient.get('/v1/leaves/policies', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data : []
  } catch { return [] }
}

export const createLeavePolicy = async (data: Partial<LeavePolicy> & { leave_type_id: number }): Promise<LeavePolicy> => {
  const res = await apiClient.post('/v1/leaves/policies', data)
  return res.data.data
}

export const updateLeavePolicy = async (id: number, data: Partial<LeavePolicy>): Promise<LeavePolicy> => {
  const res = await apiClient.put(`/v1/leaves/policies/${id}`, data)
  return res.data.data
}

export const deleteLeavePolicy = async (id: number): Promise<void> => {
  await apiClient.delete(`/v1/leaves/policies/${id}`)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function currentAcademicYear(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const startYear = m >= 7 ? y : y - 1
  return `${startYear}-${String(startYear + 1).slice(-2)}`
}

export function daysBetween(from: string, to: string): number {
  if (!from || !to) return 0
  const d = Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1
  return d > 0 ? d : 0
}

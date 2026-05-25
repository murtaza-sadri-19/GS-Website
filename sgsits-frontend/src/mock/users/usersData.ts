/**
 * MOCK: Users / Auth Credentials
 * Replace with: POST /api/auth/login
 *
 * Consumed ONLY through src/services (auth logic in api/index.ts or a future authService).
 */

import type { UserRole } from '../../types'

export interface MockUser {
  id: string
  name: string
  email: string
  password: string   // plaintext only for mock — never store real passwords here
  role: UserRole
  department?: string
  employeeId?: string
}

export const mockUsers: MockUser[] = [
  {
    id: 'u-admin-001',
    name: 'Super Admin',
    email: 'admin@sgsits.ac.in',
    password: 'admin@123',
    role: 'super_admin',
  },
  {
    id: 'u-admin-002',
    name: 'Director',
    email: 'director@sgsits.ac.in',
    password: 'director@123',
    role: 'super_admin',
  },
  {
    id: 'u-editor-001',
    name: 'Content Editor',
    email: 'editor@sgsits.ac.in',
    password: 'editor@123',
    role: 'editor',
  },
  {
    id: 'u-hod-ce-001',
    name: 'Dr. Urjita Thakar',
    email: 'thakarurjita@sgsits.ac.in',
    password: 'hod@123',
    role: 'hod',
    department: 'Computer Engineering',
    employeeId: 'SGS-CE-001',
  },
  {
    id: 'u-fac-001',
    name: 'Faculty Member',
    email: 'faculty@sgsits.ac.in',
    password: 'faculty@123',
    role: 'faculty',
    department: 'Computer Engineering',
    employeeId: 'SGS-CE-010',
  },
  {
    id: 'u-exam-001',
    name: 'Exam Controller',
    email: 'examcontroller@sgsits.ac.in',
    password: 'exam@123',
    role: 'exam_controller',
    department: 'Examination Cell',
    employeeId: 'SGS-EXAM-001',
  },
  {
    id: 'u-plc-001',
    name: 'Placement Officer',
    email: 'placement@sgsits.ac.in',
    password: 'placement@123',
    role: 'placement_officer',
    department: 'Training & Placement Cell',
    employeeId: 'SGS-TP-001',
  },
]

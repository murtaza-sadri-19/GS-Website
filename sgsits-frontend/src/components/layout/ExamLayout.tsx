import React from 'react'
import PortalLayout, { type PortalNavItem } from './PortalLayout'
import {
  LayoutDashboard,
  Megaphone,
  CalendarRange,
  FileCheck2,
  CalendarCheck,
  Download,
  Calendar,
  Building2,
  BookOpen,
  FileText,
  Users,
  AlertOctagon,
  ClipboardList,
  FileEdit,
} from 'lucide-react'

/**
 * Exam Controller sidebar. The Role-wise Actions doc lists six canonical
 * pages (notices, timetables, results, academic calendar, downloads); the
 * rest are inherited from the exam-office session/branch/subject workflow.
 */
const navItems: PortalNavItem[] = [
  // ── Per Role-wise Actions doc ──
  { label: 'Dashboard',           path: '/dashboard/exam/dashboard',            icon: LayoutDashboard },
  { label: 'Exam Notices',        path: '/dashboard/exam/notices',              icon: Megaphone },
  { label: 'Timetables',          path: '/dashboard/exam/timetables',           icon: CalendarRange },
  { label: 'Results',             path: '/dashboard/exam/results',              icon: FileCheck2 },
  { label: 'Academic Calendar',   path: '/dashboard/exam/academic-calendar',    icon: CalendarCheck },
  { label: 'Downloads',           path: '/dashboard/exam/downloads',            icon: Download },
  // ── Inherited from exam-office workflow ──
  { label: 'Session Management',  path: '/dashboard/exam/session-management',   icon: Calendar },
  { label: 'Branch Management',   path: '/dashboard/exam/branch-management',    icon: Building2 },
  { label: 'Course Management',   path: '/dashboard/exam/course-management',    icon: BookOpen },
  { label: 'Upload Subjects',     path: '/dashboard/exam/subject-upload',       icon: FileText },
  { label: 'Upload Students',     path: '/dashboard/exam/student-upload',       icon: Users },
  { label: 'Upload ATKT',         path: '/dashboard/exam/atkt-upload',          icon: AlertOctagon },
  { label: 'Correction Requests', path: '/dashboard/exam/requests',             icon: FileEdit },
  { label: 'Marks Fill Requests', path: '/dashboard/exam/marks-request',        icon: ClipboardList },
]

const ExamLayout: React.FC = () => (
  <PortalLayout
    title="Exam Department"
    subtitle="Exam Controller Portal"
    navItems={navItems}
  />
)

export default ExamLayout

import React from 'react'
import PortalLayout, { type PortalNavItem } from './PortalLayout'
import {
  LayoutDashboard,
  User,
  FileText,
  FlaskConical,
  BookOpen,
  GraduationCap,
  ClipboardList,
  FileEdit,
  CalendarDays,
  FileCheck2,
  Megaphone,
  ClipboardCheck,
} from 'lucide-react'

/**
 * Teacher (a.k.a. Faculty) sidebar. The Role-wise Actions doc lists six
 * canonical pages; the rest are inherited from the exam-office marks workflow.
 */
const navItems: PortalNavItem[] = [
  // ── Per Role-wise Actions doc ──
  { label: 'Dashboard',            path: '/dashboard/teacher/dashboard',           icon: LayoutDashboard },
  { label: 'My Profile',           path: '/dashboard/teacher/profile',             icon: User },
  { label: 'Publications',         path: '/dashboard/teacher/publications',        icon: FileText },
  { label: 'Research Work',        path: '/dashboard/teacher/research',            icon: FlaskConical },
  { label: 'My Subjects',          path: '/dashboard/teacher/subjects',            icon: BookOpen },
  { label: 'Qualifications',       path: '/dashboard/teacher/qualifications',      icon: GraduationCap },
  // ── Inherited from exam-office workflow ──
  { label: 'Marks Feed',           path: '/dashboard/teacher/marks-feed',          icon: ClipboardList },
  { label: 'ATKT Marks Feed',      path: '/dashboard/teacher/atkt-marks-feed',     icon: GraduationCap },
  { label: 'Correction Requests',  path: '/dashboard/teacher/correction-request',  icon: FileEdit },
  { label: 'Timetable',            path: '/dashboard/teacher/timetable',           icon: CalendarDays },
  { label: 'Leave Application',    path: '/dashboard/teacher/leave',               icon: FileCheck2 },
  { label: 'Notices',              path: '/dashboard/teacher/notices',             icon: Megaphone },
  { label: 'Exam Timetable',       path: '/dashboard/teacher/exam-timetable',      icon: ClipboardCheck },
]

const FacultyLayout: React.FC = () => (
  <PortalLayout
    title="Teacher Panel"
    subtitle="Teacher / Faculty Portal"
    navItems={navItems}
  />
)

export default FacultyLayout

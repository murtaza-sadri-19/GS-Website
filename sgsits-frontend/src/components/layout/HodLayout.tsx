import React from 'react'
import PortalLayout, { type PortalNavItem } from './PortalLayout'
import {
  LayoutDashboard,
  Building,
  Users,
  Megaphone,
  Download,
  Calendar,
  Image as ImageIcon,
  FlaskConical,
  Award,
  BookOpen,
  GraduationCap,
  CalendarDays,
  FileCheck2,
  ClipboardList,
  FileEdit,
  UserPlus,
  BarChart3,
  ClipboardCheck,
} from 'lucide-react'

/**
 * HOD sidebar — combines the doc's required pages with the existing
 * marks/exam workflow inherited from `exam-office-website`.
 */
const navItems: PortalNavItem[] = [
  // ── Per Role-wise Actions doc ──
  { label: 'Dashboard',              path: '/dashboard/hod/dashboard',           icon: LayoutDashboard },
  { label: 'Department Profile',     path: '/dashboard/hod/department-profile',  icon: Building },
  { label: 'Teachers',               path: '/dashboard/hod/teachers',            icon: Users },
  { label: 'Notices',                path: '/dashboard/hod/notices',             icon: Megaphone },
  { label: 'Downloads',              path: '/dashboard/hod/downloads',           icon: Download },
  { label: 'Events',                 path: '/dashboard/hod/events',              icon: Calendar },
  { label: 'Gallery',                path: '/dashboard/hod/gallery',             icon: ImageIcon },
  { label: 'Labs',                   path: '/dashboard/hod/labs',                icon: FlaskConical },
  { label: 'Achievements',           path: '/dashboard/hod/achievements',        icon: Award },
  // ── Inherited from exam-office workflow ──
  { label: 'Subjects',               path: '/dashboard/hod/subjects',            icon: BookOpen },
  { label: 'Students',               path: '/dashboard/hod/students',            icon: GraduationCap },
  { label: 'Timetable',              path: '/dashboard/hod/timetable',           icon: CalendarDays },
  { label: 'Leave Approvals',        path: '/dashboard/hod/leaves',              icon: FileCheck2 },
  { label: 'Marks Approval',         path: '/dashboard/hod/marks',               icon: ClipboardList },
  { label: 'Correction Requests',    path: '/dashboard/hod/corrections',         icon: FileEdit },
  { label: 'Registration Requests',  path: '/dashboard/hod/registration',        icon: UserPlus },
  { label: 'Faculty Allocation',     path: '/dashboard/hod/faculty-allocation',  icon: Users },
  { label: 'Elective Data Upload',   path: '/dashboard/hod/elective-data',       icon: BookOpen },
  { label: 'Result Summary',         path: '/dashboard/hod/results',             icon: BarChart3 },
  { label: 'Exam Timetable',         path: '/dashboard/hod/exam-timetable',      icon: ClipboardCheck },
]

const HodLayout: React.FC = () => (
  <PortalLayout
    title="HOD Panel"
    subtitle="Head of Department Portal"
    navItems={navItems}
  />
)

export default HodLayout

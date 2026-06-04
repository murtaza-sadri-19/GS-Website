import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import HodLayout from '../components/layout/HodLayout'
import FacultyLayout from '../components/layout/FacultyLayout'
import ExamLayout from '../components/layout/ExamLayout'
import PlacementLayout from '../components/layout/PlacementLayout'
import HodProtectedRoute from '../components/admin/HodProtectedRoute'
import FacultyProtectedRoute from '../components/admin/FacultyProtectedRoute'
import ExamProtectedRoute from '../components/admin/ExamProtectedRoute'
import PlacementProtectedRoute from '../components/admin/PlacementProtectedRoute'
import { S } from './routeHelpers'

// ── Shared ────────────────────────────────────────────────────────────────────
const ChangePassword           = lazy(() => import('../pages/shared/ChangePassword'))

// ── Faculty / Teacher ─────────────────────────────────────────────────────────
const FacultyDashboard         = lazy(() => import('../pages/faculty/FacultyDashboard'))
const TeacherProfile           = lazy(() => import('../pages/faculty/TeacherProfile'))
const TeacherPublications      = lazy(() => import('../pages/faculty/TeacherPublications'))
const TeacherResearch          = lazy(() => import('../pages/faculty/TeacherResearch'))
const TeacherSubjects          = lazy(() => import('../pages/faculty/TeacherSubjects'))
const TeacherQualifications    = lazy(() => import('../pages/faculty/TeacherQualifications'))
const TeacherMarksFeed         = lazy(() => import('../pages/faculty/TeacherMarksFeed'))
const TeacherAtktFeed          = lazy(() => import('../pages/faculty/TeacherAtktFeed'))
const TeacherCorrections       = lazy(() => import('../pages/faculty/TeacherCorrections'))
const TeacherTimetable         = lazy(() => import('../pages/faculty/TeacherTimetable'))
const TeacherLeaves            = lazy(() => import('../pages/faculty/TeacherLeaves'))
const TeacherNotices           = lazy(() => import('../pages/faculty/TeacherNotices'))
const TeacherExamTimetable     = lazy(() => import('../pages/faculty/TeacherExamTimetable'))

// ── HOD ───────────────────────────────────────────────────────────────────────
const HodDashboard             = lazy(() => import('../pages/hod/HodDashboard'))
const HodProfile               = lazy(() => import('../pages/hod/HodProfile'))
const HodSubjects              = lazy(() => import('../pages/hod/HodSubjects'))
const HodFaculty               = lazy(() => import('../pages/hod/HodFaculty'))
const HodStudents              = lazy(() => import('../pages/hod/HodStudents'))
const HodTimetable             = lazy(() => import('../pages/hod/HodTimetable'))
const HodLeaves                = lazy(() => import('../pages/hod/HodLeaves'))
const HodDepartmentProfile     = lazy(() => import('../pages/hod/HodDepartmentProfile'))
const HodNotices               = lazy(() => import('../pages/hod/HodNotices'))
const HodDownloads             = lazy(() => import('../pages/hod/HodDownloads'))
const HodEvents                = lazy(() => import('../pages/hod/HodEvents'))
const HodGallery               = lazy(() => import('../pages/hod/HodGallery'))
const HodLabs                  = lazy(() => import('../pages/hod/HodLabs'))
const HodAchievements          = lazy(() => import('../pages/hod/HodAchievements'))
const HodMarks                 = lazy(() => import('../pages/hod/HodMarks'))
const HodCorrections           = lazy(() => import('../pages/hod/HodCorrections'))
const HodRegistration          = lazy(() => import('../pages/hod/HodRegistration'))
const HodFacultyAllocation     = lazy(() => import('../pages/hod/HodFacultyAllocation'))
const HodElectiveData          = lazy(() => import('../pages/hod/HodElectiveData'))
const HodResults               = lazy(() => import('../pages/hod/HodResults'))
const HodExamTimetable         = lazy(() => import('../pages/hod/HodExamTimetable'))
const HodProfileReviews        = lazy(() => import('../pages/hod/HodProfileReviews'))
const HodLeavePolicies         = lazy(() => import('../pages/hod/HodLeavePolicies'))

// ── Exam Controller ───────────────────────────────────────────────────────────
const ExamDashboard            = lazy(() => import('../pages/exam/ExamDashboard'))
const ExamSessions             = lazy(() => import('../pages/exam/ExamSessions'))
const ExamBranches             = lazy(() => import('../pages/exam/ExamBranches'))
const ExamCourses              = lazy(() => import('../pages/exam/ExamCourses'))
const ExamSubjectUpload        = lazy(() => import('../pages/exam/ExamSubjectUpload'))
const ExamStudentUpload        = lazy(() => import('../pages/exam/ExamStudentUpload'))
const ExamAtktUpload           = lazy(() => import('../pages/exam/ExamAtktUpload'))
const ExamRequests             = lazy(() => import('../pages/exam/ExamRequests'))
const ExamMarksRequest         = lazy(() => import('../pages/exam/ExamMarksRequest'))
const ExamNotices              = lazy(() => import('../pages/exam/ExamNotices'))
const ExamTimetables           = lazy(() => import('../pages/exam/ExamTimetables'))
const ExamControllerResults    = lazy(() => import('../pages/exam/ExamResults'))
const ExamAcademicCalendar     = lazy(() => import('../pages/exam/ExamAcademicCalendar'))
const ExamDownloads            = lazy(() => import('../pages/exam/ExamDownloads'))

// ── Placement Officer ─────────────────────────────────────────────────────────
const PlacementDashboard       = lazy(() => import('../pages/placementOfficer/PlacementDashboard'))
const PlacementNotices         = lazy(() => import('../pages/placementOfficer/PlacementNotices'))
const PlacementCompanyVisits   = lazy(() => import('../pages/placementOfficer/PlacementCompanyVisits'))
const PlacementRecords         = lazy(() => import('../pages/placementOfficer/PlacementRecords'))
const PlacementTrainingPrograms = lazy(() => import('../pages/placementOfficer/PlacementTrainingPrograms'))
const PlacementInternships     = lazy(() => import('../pages/placementOfficer/PlacementInternships'))
const PlacementCms             = lazy(() => import('../pages/placementOfficer/PlacementCms'))

// ── HOD route group ───────────────────────────────────────────────────────────
export const hodRoutes = {
  path: 'hod',
  children: [{
    element: <HodProtectedRoute />,
    children: [{
      element: <HodLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard',           element: <S><HodDashboard /></S> },
        { path: 'my-profile',          element: <S><HodProfile /></S> },
        { path: 'publications',        element: <S><TeacherPublications /></S> },
        { path: 'research',            element: <S><TeacherResearch /></S> },
        { path: 'qualifications',      element: <S><TeacherQualifications /></S> },
        { path: 'change-password',     element: <S><ChangePassword /></S> },
        { path: 'department-profile',  element: <S><HodDepartmentProfile /></S> },
        { path: 'teachers',            element: <S><HodFaculty /></S> },
        { path: 'notices',             element: <S><HodNotices /></S> },
        { path: 'downloads',           element: <S><HodDownloads /></S> },
        { path: 'events',              element: <S><HodEvents /></S> },
        { path: 'gallery',             element: <S><HodGallery /></S> },
        { path: 'labs',                element: <S><HodLabs /></S> },
        { path: 'achievements',        element: <S><HodAchievements /></S> },
        { path: 'subjects',            element: <S><HodSubjects /></S> },
        { path: 'students',            element: <S><HodStudents /></S> },
        { path: 'timetable',           element: <S><HodTimetable /></S> },
        { path: 'leaves',              element: <S><HodLeaves /></S> },
        { path: 'marks',               element: <S><HodMarks /></S> },
        { path: 'corrections',         element: <S><HodCorrections /></S> },
        { path: 'registration',        element: <S><HodRegistration /></S> },
        { path: 'faculty-allocation',  element: <S><HodFacultyAllocation /></S> },
        { path: 'elective-data',       element: <S><HodElectiveData /></S> },
        { path: 'results',             element: <S><HodResults /></S> },
        { path: 'exam-timetable',      element: <S><HodExamTimetable /></S> },
        { path: 'profile-reviews',     element: <S><HodProfileReviews /></S> },
        { path: 'leave-policies',      element: <S><HodLeavePolicies /></S> },
      ],
    }],
  }],
}

// ── Teacher route group ───────────────────────────────────────────────────────
export const teacherRoutes = {
  path: 'teacher',
  children: [{
    element: <FacultyProtectedRoute />,
    children: [{
      element: <FacultyLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard',           element: <S><FacultyDashboard /></S> },
        { path: 'profile',             element: <S><TeacherProfile /></S> },
        { path: 'publications',        element: <S><TeacherPublications /></S> },
        { path: 'research',            element: <S><TeacherResearch /></S> },
        { path: 'subjects',            element: <S><TeacherSubjects /></S> },
        { path: 'qualifications',      element: <S><TeacherQualifications /></S> },
        { path: 'change-password',     element: <S><ChangePassword /></S> },
        { path: 'marks-feed',          element: <S><TeacherMarksFeed /></S> },
        { path: 'atkt-marks-feed',     element: <S><TeacherAtktFeed /></S> },
        { path: 'correction-request',  element: <S><TeacherCorrections /></S> },
        { path: 'timetable',           element: <S><TeacherTimetable /></S> },
        { path: 'leave',               element: <S><TeacherLeaves /></S> },
        { path: 'notices',             element: <S><TeacherNotices /></S> },
        { path: 'exam-timetable',      element: <S><TeacherExamTimetable /></S> },
      ],
    }],
  }],
}

// ── Exam Controller route group ───────────────────────────────────────────────
export const examRoutes = {
  path: 'exam',
  children: [{
    element: <ExamProtectedRoute />,
    children: [{
      element: <ExamLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard',          element: <S><ExamDashboard /></S> },
        { path: 'notices',            element: <S><ExamNotices /></S> },
        { path: 'timetables',         element: <S><ExamTimetables /></S> },
        { path: 'results',            element: <S><ExamControllerResults /></S> },
        { path: 'academic-calendar',  element: <S><ExamAcademicCalendar /></S> },
        { path: 'downloads',          element: <S><ExamDownloads /></S> },
        { path: 'session-management', element: <S><ExamSessions /></S> },
        { path: 'branch-management',  element: <S><ExamBranches /></S> },
        { path: 'course-management',  element: <S><ExamCourses /></S> },
        { path: 'subject-upload',     element: <S><ExamSubjectUpload /></S> },
        { path: 'student-upload',     element: <S><ExamStudentUpload /></S> },
        { path: 'atkt-upload',        element: <S><ExamAtktUpload /></S> },
        { path: 'requests',           element: <S><ExamRequests /></S> },
        { path: 'marks-request',      element: <S><ExamMarksRequest /></S> },
      ],
    }],
  }],
}

// ── Placement Officer route group ─────────────────────────────────────────────
export const placementOfficerRoutes = {
  path: 'placement',
  children: [{
    element: <PlacementProtectedRoute />,
    children: [{
      element: <PlacementLayout />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard',         element: <S><PlacementDashboard /></S> },
        { path: 'notices',           element: <S><PlacementNotices /></S> },
        { path: 'company-visits',    element: <S><PlacementCompanyVisits /></S> },
        { path: 'records',           element: <S><PlacementRecords /></S> },
        { path: 'training-programs', element: <S><PlacementTrainingPrograms /></S> },
        { path: 'internships',       element: <S><PlacementInternships /></S> },
        { path: 'cms',               element: <S><PlacementCms /></S> },
      ],
    }],
  }],
}

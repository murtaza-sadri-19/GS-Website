import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layout components
import MainLayout from '../components/layout/MainLayout'
import SidebarLayout from '../components/layout/SidebarLayout'
import AdminLayout from '../components/layout/AdminLayout'
import HodLayout from '../components/layout/HodLayout'
import FacultyLayout from '../components/layout/FacultyLayout'
import ExamLayout from '../components/layout/ExamLayout'
import PlacementLayout from '../components/layout/PlacementLayout'
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute'
import HodProtectedRoute from '../components/admin/HodProtectedRoute'
import FacultyProtectedRoute from '../components/admin/FacultyProtectedRoute'
import ExamProtectedRoute from '../components/admin/ExamProtectedRoute'
import PlacementProtectedRoute from '../components/admin/PlacementProtectedRoute'
import ErrorBoundary from '../components/global/ErrorBoundary'

// Loading placeholder component (Suspense wrapper)
const S: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    }
  >
    {children}
  </Suspense>
)

// Helper to write breadcrumb meta
const bc = (label: string) => ({ breadcrumb: label })

// Lazy Pages
// ── Public Pages ──────────────────────────────────────────────────────────
const Home = lazy(() => import('../pages/Home'))
const ContactUs = lazy(() => import('../pages/ContactUs'))
const NotFound = lazy(() => import('../pages/NotFound'))
const Login = lazy(() => import('../pages/Login'))
const ResetPassword = lazy(() => import('../pages/ResetPassword'))

// About Section Pages
const AboutInstitute = lazy(() => import('../pages/about/AboutInstitute'))
const VisionMission = lazy(() => import('../pages/about/VisionMission'))
const DirectorMessage = lazy(() => import('../pages/about/DirectorMessage'))
const GoverningBody = lazy(() => import('../pages/about/GoverningBody'))
const Administration = lazy(() => import('../pages/about/Administration'))
const Committees = lazy(() => import('../pages/about/Committees'))
const TelephoneDir = lazy(() => import('../pages/about/TelephoneDirectory'))
const Infrastructure = lazy(() => import('../pages/about/Infrastructure'))
const IQAC = lazy(() => import('../pages/about/IQAC'))
const AcademicCouncil = lazy(() => import('../pages/about/AcademicCouncil'))
const Accreditation = lazy(() => import('../pages/about/Accreditation'))
const CustomAboutPage = lazy(() => import('../pages/about/CustomAboutPage'))
const CustomAdmissionPage = lazy(() => import('../pages/admission/CustomAdmissionPage'))
const CustomPlacementPage = lazy(() => import('../pages/placement/CustomPlacementPage'))
const CustomCampusLifePage = lazy(() => import('../pages/students/CustomCampusLifePage'))

// Academics Section Pages
const AcademicCalendar = lazy(() => import('../pages/academics/AcademicCalendar'))
const UGCourses = lazy(() => import('../pages/academics/UGCourses'))
const PGCourses = lazy(() => import('../pages/academics/PGCourses'))
const PhDCourses = lazy(() => import('../pages/academics/PhDCourses'))
const PTDCCourses = lazy(() => import('../pages/academics/PTDCCourses'))
const OnlineCourses = lazy(() => import('../pages/academics/OnlineCourses'))
const FirstYearInfo = lazy(() => import('../pages/academics/FirstYearInfo'))
const ExamResults = lazy(() => import('../pages/academics/ExamResults'))
const Ordinances = lazy(() => import('../pages/academics/Ordinances'))
const PlagiarismPolicy = lazy(() => import('../pages/academics/PlagiarismPolicy'))
const CodeOfConduct = lazy(() => import('../pages/academics/CodeOfConduct'))
const OBENep2020 = lazy(() => import('../pages/academics/OBENep2020'))

// Departments Section Pages
const DepartmentLanding = lazy(() => import('../pages/departments/DepartmentLanding'))
const DepartmentDetail = lazy(() => import('../pages/departments/DepartmentDetail'))

// Faculty Page
const FacultyProfile = lazy(() => import('../pages/faculty/FacultyProfile'))

// Students Section Pages
const Activities = lazy(() => import('../pages/students/Activities'))
const ScholarshipGovt = lazy(() => import('../pages/students/ScholarshipGovt'))
const ScholarshipInstitute = lazy(() => import('../pages/students/ScholarshipInstitute'))
const SSS = lazy(() => import('../pages/students/SSS'))
const NCC = lazy(() => import('../pages/students/NCC'))
const NSS = lazy(() => import('../pages/students/NSS'))

// Facilities Section Pages
const ComputerCenter = lazy(() => import('../pages/facilities/ComputerCenter'))
const Library = lazy(() => import('../pages/facilities/Library'))
const Workshop = lazy(() => import('../pages/facilities/Workshop'))
const Gymnasium = lazy(() => import('../pages/facilities/Gymnasium'))
const Dispensary = lazy(() => import('../pages/facilities/Dispensary'))
const CIDI = lazy(() => import('../pages/facilities/CIDI'))
const GamesSports = lazy(() => import('../pages/facilities/GamesSports'))
const BoysHostel = lazy(() => import('../pages/facilities/BoysHostel'))
const GirlsHostel = lazy(() => import('../pages/facilities/GirlsHostel'))
const TransitHostel = lazy(() => import('../pages/facilities/TransitHostel'))
const StaffQuarters = lazy(() => import('../pages/facilities/StaffQuarters'))
const IDEALab = lazy(() => import('../pages/facilities/IDEALab'))

// Placement Section Pages
const TNPCell = lazy(() => import('../pages/placement/TNPCell'))
const LeadingCompanies = lazy(() => import('../pages/placement/LeadingCompanies'))
const PlacementRecord = lazy(() => import('../pages/placement/PlacementRecord'))
const PlacementContact = lazy(() => import('../pages/placement/PlacementContact'))

// Admission Section Pages
const UGAdmission = lazy(() => import('../pages/admission/UGAdmission'))
const PGAdmission = lazy(() => import('../pages/admission/PGAdmission'))
const PhDAdmission = lazy(() => import('../pages/admission/PhDAdmission'))
const Prospectus = lazy(() => import('../pages/admission/Prospectus'))

// Explore Section Pages
const CampusMapPage = lazy(() => import('../pages/explore/CampusMapPage'))
const PhotoGalleryPage = lazy(() => import('../pages/explore/PhotoGalleryPage'))
const AlbumPage = lazy(() => import('../pages/explore/AlbumPage'))
const VideoTourPage = lazy(() => import('../pages/explore/VideoTourPage'))
const AnthemPage = lazy(() => import('../pages/explore/AnthemPage'))

// Startup Cell & TEQIP Section Pages
const StartupCellPage = lazy(() => import('../pages/startupCell/StartupCellPage'))
const TeqipPage = lazy(() => import('../pages/teqip/TeqipPage'))

// Live Feed Category Pages
const NoticesPage = lazy(() => import('../pages/livefeed/NoticesPage'))
const NewsPage = lazy(() => import('../pages/livefeed/NewsPage'))
const NewsDetailPage = lazy(() => import('../pages/livefeed/NewsDetailPage'))
const EventsPage = lazy(() => import('../pages/livefeed/EventsPage'))
const TendersPage = lazy(() => import('../pages/livefeed/TendersPage'))

// Policy Pages
const PrivacyPolicy = lazy(() => import('../pages/policy/PrivacyPolicy'))
const TermsOfUse = lazy(() => import('../pages/policy/TermsOfUse'))
const Disclaimer = lazy(() => import('../pages/policy/Disclaimer'))
const AccessibilityStatement = lazy(() => import('../pages/policy/AccessibilityStatement'))
const CopyrightPolicy = lazy(() => import('../pages/policy/CopyrightPolicy'))
const HyperlinkPolicy = lazy(() => import('../pages/policy/HyperlinkPolicy'))
const SecurityPolicy = lazy(() => import('../pages/policy/SecurityPolicy'))
const SiteMapPage = lazy(() => import('../pages/policy/SiteMapPage'))
const WebInfoManager = lazy(() => import('../pages/policy/WebInfoManager'))
const HelpPage = lazy(() => import('../pages/policy/HelpPage'))
const FeedbackPage = lazy(() => import('../pages/policy/FeedbackPage'))

// Faculty Portal Pages
const FacultyDashboard = lazy(() => import('../pages/faculty/FacultyDashboard'))
const TeacherProfile = lazy(() => import('../pages/faculty/TeacherProfile'))
const TeacherPublications = lazy(() => import('../pages/faculty/TeacherPublications'))
const TeacherResearch = lazy(() => import('../pages/faculty/TeacherResearch'))
const TeacherSubjects = lazy(() => import('../pages/faculty/TeacherSubjects'))
const TeacherQualifications = lazy(() => import('../pages/faculty/TeacherQualifications'))
const TeacherMarksFeed = lazy(() => import('../pages/faculty/TeacherMarksFeed'))
const TeacherAtktFeed = lazy(() => import('../pages/faculty/TeacherAtktFeed'))
const TeacherCorrections = lazy(() => import('../pages/faculty/TeacherCorrections'))
const TeacherTimetable = lazy(() => import('../pages/faculty/TeacherTimetable'))
const TeacherLeaves = lazy(() => import('../pages/faculty/TeacherLeaves'))
const TeacherNotices = lazy(() => import('../pages/faculty/TeacherNotices'))
const TeacherExamTimetable = lazy(() => import('../pages/faculty/TeacherExamTimetable'))

// HOD Portal Pages
const HodDashboard = lazy(() => import('../pages/hod/HodDashboard'))
const HodSubjects = lazy(() => import('../pages/hod/HodSubjects'))
const HodFaculty = lazy(() => import('../pages/hod/HodFaculty'))
const HodStudents = lazy(() => import('../pages/hod/HodStudents'))
const HodTimetable = lazy(() => import('../pages/hod/HodTimetable'))
const HodLeaves = lazy(() => import('../pages/hod/HodLeaves'))
const HodDepartmentProfile = lazy(() => import('../pages/hod/HodDepartmentProfile'))
const HodNotices = lazy(() => import('../pages/hod/HodNotices'))
const HodDownloads = lazy(() => import('../pages/hod/HodDownloads'))
const HodEvents = lazy(() => import('../pages/hod/HodEvents'))
const HodGallery = lazy(() => import('../pages/hod/HodGallery'))
const HodLabs = lazy(() => import('../pages/hod/HodLabs'))
const HodAchievements = lazy(() => import('../pages/hod/HodAchievements'))
const HodMarks = lazy(() => import('../pages/hod/HodMarks'))
const HodCorrections = lazy(() => import('../pages/hod/HodCorrections'))
const HodRegistration = lazy(() => import('../pages/hod/HodRegistration'))
const HodFacultyAllocation = lazy(() => import('../pages/hod/HodFacultyAllocation'))
const HodElectiveData = lazy(() => import('../pages/hod/HodElectiveData'))
const HodResults = lazy(() => import('../pages/hod/HodResults'))
const HodExamTimetable = lazy(() => import('../pages/hod/HodExamTimetable'))

// Exam Department Pages
const ExamDashboard = lazy(() => import('../pages/exam/ExamDashboard'))
const ExamSessions = lazy(() => import('../pages/exam/ExamSessions'))
const ExamBranches = lazy(() => import('../pages/exam/ExamBranches'))
const ExamCourses = lazy(() => import('../pages/exam/ExamCourses'))
const ExamSubjectUpload = lazy(() => import('../pages/exam/ExamSubjectUpload'))
const ExamStudentUpload = lazy(() => import('../pages/exam/ExamStudentUpload'))
const ExamAtktUpload = lazy(() => import('../pages/exam/ExamAtktUpload'))
const ExamRequests = lazy(() => import('../pages/exam/ExamRequests'))
const ExamMarksRequest = lazy(() => import('../pages/exam/ExamMarksRequest'))
const ExamNotices = lazy(() => import('../pages/exam/ExamNotices'))
const ExamTimetables = lazy(() => import('../pages/exam/ExamTimetables'))
const ExamControllerResults = lazy(() => import('../pages/exam/ExamResults'))
const ExamAcademicCalendar = lazy(() => import('../pages/exam/ExamAcademicCalendar'))
const ExamDownloads = lazy(() => import('../pages/exam/ExamDownloads'))

const PlacementDashboard = lazy(() => import('../pages/placementOfficer/PlacementDashboard'))
const PlacementNotices = lazy(() => import('../pages/placementOfficer/PlacementNotices'))
const PlacementCompanyVisits = lazy(() => import('../pages/placementOfficer/PlacementCompanyVisits'))
const PlacementRecords = lazy(() => import('../pages/placementOfficer/PlacementRecords'))
const PlacementTrainingPrograms = lazy(() => import('../pages/placementOfficer/PlacementTrainingPrograms'))
const PlacementInternships = lazy(() => import('../pages/placementOfficer/PlacementInternships'))
const PlacementCms = lazy(() => import('../pages/placementOfficer/PlacementCms'))


const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))
const AdminNotices = lazy(() => import('../pages/admin/AdminNotices'))
const AdminNews = lazy(() => import('../pages/admin/AdminNews'))
const AdminEvents = lazy(() => import('../pages/admin/AdminEvents'))
const AdminTenders = lazy(() => import('../pages/admin/AdminTenders'))
const AdminAlerts = lazy(() => import('../pages/admin/AdminAlerts'))
const AdminDepartments = lazy(() => import('../pages/admin/AdminDepartments'))
const AdminFaculty = lazy(() => import('../pages/admin/AdminFaculty'))
const AdminGallery = lazy(() => import('../pages/admin/AdminGallery'))
const AdminPlacement = lazy(() => import('../pages/admin/AdminPlacement'))
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'))
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'))
const AdminDownloads = lazy(() => import('../pages/admin/AdminDownloads'))
const AdminStaticPages = lazy(() => import('../pages/admin/AdminStaticPages'))
const AdminFooter = lazy(() => import('../pages/admin/AdminFooter'))

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    children: [
      // ── PUBLIC ROUTES ──────────────────────────────────────────
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <S><Home /></S>,
            handle: bc('Home'),
          },
          // About (with sidebar)
          {
            path: 'about',
            element: <SidebarLayout section="about" />,
            handle: bc('About'),
            children: [
              { index: true, element: <Navigate to="institute" replace /> },
              { path: 'institute',            element: <S><AboutInstitute /></S>,   handle: bc('About Institute') },
              { path: 'vision-mission',       element: <S><VisionMission /></S>,    handle: bc('Vision & Mission') },
              { path: 'director-message',     element: <S><DirectorMessage /></S>,  handle: bc("Director's Message") },
              { path: 'governing-body',       element: <S><GoverningBody /></S>,    handle: bc('Governing Body') },
              { path: 'administration',       element: <S><Administration /></S>,   handle: bc('Administration') },
              { path: 'committees',           element: <S><Committees /></S>,       handle: bc('Committees') },
              { path: 'telephone-directory',  element: <S><TelephoneDir /></S>,     handle: bc('Telephone Directory') },
              { path: 'infrastructure',       element: <S><Infrastructure /></S>,   handle: bc('Infrastructure') },
              { path: 'iqac',                 element: <S><IQAC /></S>,             handle: bc('IQAC') },
              { path: 'academic-council',     element: <S><AcademicCouncil /></S>,  handle: bc('Academic Council') },
              { path: 'accreditation',        element: <S><Accreditation /></S>,    handle: bc('Accreditation') },
              { path: ':customPath',          element: <S><CustomAboutPage /></S> },
            ],
          },

          // Academics (with sidebar)
          {
            path: 'academics',
            element: <SidebarLayout section="academics" />,
            handle: bc('Academics'),
            children: [
              { index: true, element: <Navigate to="calendar" replace /> },
              { path: 'calendar',           element: <S><AcademicCalendar /></S>, handle: bc('Academic Calendar') },
              { path: 'courses/ug',         element: <S><UGCourses /></S>,        handle: bc('UG Courses') },
              { path: 'courses/pg',         element: <S><PGCourses /></S>,        handle: bc('PG Courses') },
              { path: 'courses/phd',        element: <S><PhDCourses /></S>,       handle: bc('PhD Courses') },
              { path: 'courses/ptdc',       element: <S><PTDCCourses /></S>,      handle: bc('PTDC Courses') },
              { path: 'courses/online',     element: <S><OnlineCourses /></S>,    handle: bc('Online Courses') },
              { path: 'first-year',         element: <S><FirstYearInfo /></S>,    handle: bc('First Year Info') },
              { path: 'exam-results',       element: <S><ExamResults /></S>,      handle: bc('Exam & Results') },
              { path: 'ordinances',         element: <S><Ordinances /></S>,       handle: bc('Ordinances') },
              { path: 'plagiarism-policy',  element: <S><PlagiarismPolicy /></S>, handle: bc('Plagiarism Policy') },
              { path: 'code-of-conduct',    element: <S><CodeOfConduct /></S>,    handle: bc('Code of Conduct') },
              { path: 'obe-nep-2020',       element: <S><OBENep2020 /></S>,       handle: bc('OBE & NEP 2020') },
            ],
          },

          // Departments
          {
            path: 'departments',
            handle: bc('Departments'),
            children: [
              { index: true, element: <S><DepartmentLanding /></S> },
              {
                path: ':slug',
                element: <SidebarLayout section="departments" />,
                children: [
                  { index: true, element: <S><DepartmentDetail /></S> },
                ],
              },
            ],
          },

          // Faculty Profile
          {
            path: 'faculty/:facultyId',
            element: <S><FacultyProfile /></S>,
            handle: bc('Faculty Profile'),
          },

          // Students (with sidebar)
          {
            path: 'students',
            element: <SidebarLayout section="students" />,
            handle: bc('Students'),
            children: [
              { index: true, element: <Navigate to="activities" replace /> },
              { path: 'activities',               element: <S><Activities /></S>,           handle: bc('Activities') },
              { path: 'scholarship/govt',         element: <S><ScholarshipGovt /></S>,      handle: bc('Govt. Scholarship') },
              { path: 'scholarship/institute',    element: <S><ScholarshipInstitute /></S>, handle: bc('Institute Scholarship') },
              { path: 'sss',                      element: <S><SSS /></S>,                  handle: bc('SSS') },
              { path: 'ncc',                      element: <S><NCC /></S>,                  handle: bc('NCC') },
              { path: 'nss',                      element: <S><NSS /></S>,                  handle: bc('NSS') },
              { path: ':customPath',              element: <S><CustomCampusLifePage /></S> },
            ],
          },

          // Facilities (with sidebar)
          {
            path: 'facilities',
            element: <SidebarLayout section="facilities" />,
            handle: bc('Facilities'),
            children: [
              { index: true, element: <Navigate to="computer-center" replace /> },
              { path: 'computer-center',  element: <S><ComputerCenter /></S>, handle: bc('Computer Center') },
              { path: 'library',          element: <S><Library /></S>,         handle: bc('Library') },
              { path: 'workshop',         element: <S><Workshop /></S>,        handle: bc('Workshop') },
              { path: 'gymnasium',        element: <S><Gymnasium /></S>,       handle: bc('Gymnasium') },
              { path: 'dispensary',       element: <S><Dispensary /></S>,      handle: bc('Dispensary') },
              { path: 'cidi',             element: <S><CIDI /></S>,            handle: bc('CIDI') },
              { path: 'sports',           element: <S><GamesSports /></S>,     handle: bc('Games & Sports') },
              { path: 'hostel/boys',      element: <S><BoysHostel /></S>,      handle: bc('Boys Hostel') },
              { path: 'hostel/girls',     element: <S><GirlsHostel /></S>,     handle: bc('Girls Hostel') },
              { path: 'hostel/transit',   element: <S><TransitHostel /></S>,   handle: bc('Transit Hostel') },
              { path: 'hostel/staff',     element: <S><StaffQuarters /></S>,   handle: bc('Staff Quarters') },
              { path: 'idea-lab',         element: <S><IDEALab /></S>,         handle: bc('IDEA Lab') },
            ],
          },

          // Placement (with sidebar)
          {
            path: 'placement',
            element: <SidebarLayout section="placement" />,
            handle: bc('Placement'),
            children: [
              { index: true, element: <Navigate to="tnp-cell" replace /> },
              { path: 'tnp-cell',         element: <S><TNPCell /></S>,           handle: bc('T&P Cell') },
              { path: 'companies',        element: <S><LeadingCompanies /></S>,  handle: bc('Leading Companies') },
              { path: 'record',           element: <S><PlacementRecord /></S>,   handle: bc('Placement Record') },
              { path: 'contact',          element: <S><PlacementContact /></S>,  handle: bc('Contact Person') },
              { path: ':customPath',      element: <S><CustomPlacementPage /></S> },
            ],
          },

          // Admission (with sidebar)
          {
            path: 'admission',
            element: <SidebarLayout section="admission" />,
            handle: bc('Admission'),
            children: [
              { index: true, element: <Navigate to="ug" replace /> },
              { path: 'ug',         element: <S><UGAdmission /></S>,  handle: bc('UG Admission') },
              { path: 'pg',         element: <S><PGAdmission /></S>,  handle: bc('PG Admission') },
              { path: 'phd',        element: <S><PhDAdmission /></S>, handle: bc('PhD Admission') },
              { path: 'prospectus', element: <S><Prospectus /></S>,   handle: bc('Prospectus') },
              { path: ':customPath', element: <S><CustomAdmissionPage /></S> },
            ],
          },

          // Explore
          {
            path: 'explore',
            element: <SidebarLayout section="explore" />,
            handle: bc('Explore SGSITS'),
            children: [
              { index: true, element: <Navigate to="gallery" replace /> },
              { path: 'campus-map',         element: <S><CampusMapPage /></S>,    handle: bc('Campus Map') },
              { path: 'gallery',            element: <S><PhotoGalleryPage /></S>, handle: bc('Photo Gallery') },
              { path: 'gallery/:albumSlug', element: <S><AlbumPage /></S>,        handle: bc('Album') },
              { path: 'video-tour',         element: <S><VideoTourPage /></S>,    handle: bc('Video Tour') },
              { path: 'anthem',             element: <S><AnthemPage /></S>,       handle: bc('SGSITS Anthem') },
            ],
          },

          // Startup Cell (with sidebar)
          {
            path: 'startup-cell',
            element: <SidebarLayout section="startup" />,
            handle: bc('Startup Cell'),
            children: [
              { index: true, element: <S><StartupCellPage /></S> },
            ],
          },

          // TEQIP (with sidebar)
          {
            path: 'teqip',
            element: <SidebarLayout section="teqip" />,
            handle: bc('TEQIP'),
            children: [
              { index: true, element: <Navigate to="about" replace /> },
              { path: ':subpage', element: <S><TeqipPage /></S>, handle: bc('TEQIP') },
            ],
          },

          // Live Feed category pages
          {
            path: 'news',
            element: <SidebarLayout section="news" />,
            handle: bc('News'),
            children: [
              { index: true, element: <S><NewsPage /></S> },
              { path: ':id', element: <S><NewsDetailPage /></S>, handle: bc('News Details') },
            ],
          },
          {
            path: 'notices',
            element: <SidebarLayout section="notices" />,
            handle: bc('Notices'),
            children: [
              { index: true, element: <S><NoticesPage /></S> },
            ],
          },
          {
            path: 'events',
            element: <SidebarLayout section="events" />,
            handle: bc('Events'),
            children: [
              { index: true, element: <S><EventsPage /></S> },
            ],
          },
          {
            path: 'tenders',
            element: <SidebarLayout section="tenders" />,
            handle: bc('Tenders'),
            children: [
              { index: true, element: <S><TendersPage /></S> },
            ],
          },

          // Policy Pages
          {
            path: 'policy',
            handle: bc('Policy'),
            children: [
              { path: 'privacy',        element: <S><PrivacyPolicy /></S>,          handle: bc('Privacy Policy') },
              { path: 'terms',          element: <S><TermsOfUse /></S>,             handle: bc('Terms of Use') },
              { path: 'disclaimer',     element: <S><Disclaimer /></S>,             handle: bc('Disclaimer') },
              { path: 'accessibility',  element: <S><AccessibilityStatement /></S>, handle: bc('Accessibility') },
              { path: 'copyright',      element: <S><CopyrightPolicy /></S>,        handle: bc('Copyright Policy') },
              { path: 'hyperlink',      element: <S><HyperlinkPolicy /></S>,        handle: bc('Hyperlink Policy') },
              { path: 'security',       element: <S><SecurityPolicy /></S>,         handle: bc('Security Policy') },
              { path: 'sitemap',        element: <S><SiteMapPage /></S>,            handle: bc('Site Map') },
              { path: 'web-info-manager', element: <S><WebInfoManager /></S>,       handle: bc('Web Info Manager') },
              { path: 'help',           element: <S><HelpPage /></S>,               handle: bc('Help') },
              { path: 'feedback',       element: <S><FeedbackPage /></S>,           handle: bc('Feedback') },
            ],
          },

          // Contact
          { path: 'contact', element: <S><ContactUs /></S>, handle: bc('Contact Us') },

          // 404
          { path: '*', element: <S><NotFound /></S> },
        ],
      },
      {
        path: '/login',
        element: <S><Login /></S>,
      },
      {
        path: '/reset-password',
        element: <S><ResetPassword /></S>,
      },

      // ── ADMIN LOGIN (back-compat alias for /login) ──────────────
      { path: '/admin/login', element: <Navigate to="/login" replace /> },

      // ── CANONICAL DASHBOARDS — /dashboard/{role}/* per Role-wise Actions doc ──
      {
        path: '/dashboard',
        children: [

          // ── 1. CENTRAL ADMIN ────────────────────────────────────
          {
            path: 'central-admin',
            children: [
              {
                element: <AdminProtectedRoute />,
                children: [
                  {
                    element: <AdminLayout />,
                    children: [
                      { index: true, element: <Navigate to="dashboard" replace /> },
                      // Doc-required pages
                      { path: 'dashboard',   element: <S><AdminDashboard /></S> },
                      { path: 'users',       element: <S><AdminUsers /></S> },
                      { path: 'departments', element: <S><AdminDepartments /></S> },
                      { path: 'notices',     element: <S><AdminNotices /></S> },
                      { path: 'downloads',   element: <S><AdminDownloads /></S> },
                      { path: 'events',      element: <S><AdminEvents /></S> },
                      { path: 'gallery',     element: <S><AdminGallery /></S> },
                      { path: 'pages',       element: <S><AdminStaticPages /></S> },
                      // Existing CMS modules
                      { path: 'news',        element: <S><AdminNews /></S> },
                      { path: 'tenders',     element: <S><AdminTenders /></S> },
                      { path: 'alerts',      element: <S><AdminAlerts /></S> },
                      { path: 'faculty',     element: <S><AdminFaculty /></S> },
                      { path: 'placement',   element: <S><AdminPlacement /></S> },
                      { path: 'settings',    element: <S><AdminSettings /></S> },
                      { path: 'footer',      element: <S><AdminFooter /></S> },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 2. HOD ──────────────────────────────────────────────
          {
            path: 'hod',
            children: [
              {
                element: <HodProtectedRoute />,
                children: [
                  {
                    element: <HodLayout />,
                    children: [
                      { index: true, element: <Navigate to="dashboard" replace /> },
                      // Doc-required pages
                      { path: 'dashboard',           element: <S><HodDashboard /></S> },
                      { path: 'department-profile',  element: <S><HodDepartmentProfile /></S> },
                      { path: 'teachers',            element: <S><HodFaculty /></S> },
                      { path: 'notices',             element: <S><HodNotices /></S> },
                      { path: 'downloads',           element: <S><HodDownloads /></S> },
                      { path: 'events',              element: <S><HodEvents /></S> },
                      { path: 'gallery',             element: <S><HodGallery /></S> },
                      { path: 'labs',                element: <S><HodLabs /></S> },
                      { path: 'achievements',        element: <S><HodAchievements /></S> },
                      // Inherited exam-office workflow pages
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
                    ],
                  },
                ],
              },
            ],
          },

          // ── 3. TEACHER (a.k.a. Faculty) ─────────────────────────
          {
            path: 'teacher',
            children: [
              {
                element: <FacultyProtectedRoute />,
                children: [
                  {
                    element: <FacultyLayout />,
                    children: [
                      { index: true, element: <Navigate to="dashboard" replace /> },
                      // Doc-required pages
                      { path: 'dashboard',          element: <S><FacultyDashboard /></S> },
                      { path: 'profile',            element: <S><TeacherProfile /></S> },
                      { path: 'publications',       element: <S><TeacherPublications /></S> },
                      { path: 'research',           element: <S><TeacherResearch /></S> },
                      { path: 'subjects',           element: <S><TeacherSubjects /></S> },
                      { path: 'qualifications',     element: <S><TeacherQualifications /></S> },
                      // Inherited exam-office workflow pages
                      { path: 'marks-feed',         element: <S><TeacherMarksFeed /></S> },
                      { path: 'atkt-marks-feed',    element: <S><TeacherAtktFeed /></S> },
                      { path: 'correction-request', element: <S><TeacherCorrections /></S> },
                      { path: 'timetable',          element: <S><TeacherTimetable /></S> },
                      { path: 'leave',              element: <S><TeacherLeaves /></S> },
                      { path: 'notices',            element: <S><TeacherNotices /></S> },
                      { path: 'exam-timetable',     element: <S><TeacherExamTimetable /></S> },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 4. EXAM CONTROLLER ──────────────────────────────────
          {
            path: 'exam',
            children: [
              {
                element: <ExamProtectedRoute />,
                children: [
                  {
                    element: <ExamLayout />,
                    children: [
                      { index: true, element: <Navigate to="dashboard" replace /> },
                      // Doc-required pages
                      { path: 'dashboard',           element: <S><ExamDashboard /></S> },
                      { path: 'notices',             element: <S><ExamNotices /></S> },
                      { path: 'timetables',          element: <S><ExamTimetables /></S> },
                      { path: 'results',             element: <S><ExamControllerResults /></S> },
                      { path: 'academic-calendar',   element: <S><ExamAcademicCalendar /></S> },
                      { path: 'downloads',           element: <S><ExamDownloads /></S> },
                      // Inherited exam-office workflow pages
                      { path: 'session-management',  element: <S><ExamSessions /></S> },
                      { path: 'branch-management',   element: <S><ExamBranches /></S> },
                      { path: 'course-management',   element: <S><ExamCourses /></S> },
                      { path: 'subject-upload',      element: <S><ExamSubjectUpload /></S> },
                      { path: 'student-upload',      element: <S><ExamStudentUpload /></S> },
                      { path: 'atkt-upload',         element: <S><ExamAtktUpload /></S> },
                      { path: 'requests',            element: <S><ExamRequests /></S> },
                      { path: 'marks-request',       element: <S><ExamMarksRequest /></S> },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 5. PLACEMENT OFFICER ────────────────────────────────
          {
            path: 'placement',
            children: [
              {
                element: <PlacementProtectedRoute />,
                children: [
                  {
                    element: <PlacementLayout />,
                    children: [
                      { index: true, element: <Navigate to="dashboard" replace /> },
                      { path: 'dashboard',          element: <S><PlacementDashboard /></S> },
                      { path: 'notices',            element: <S><PlacementNotices /></S> },
                      { path: 'company-visits',     element: <S><PlacementCompanyVisits /></S> },
                      { path: 'records',            element: <S><PlacementRecords /></S> },
                      { path: 'training-programs',  element: <S><PlacementTrainingPrograms /></S> },
                      { path: 'internships',        element: <S><PlacementInternships /></S> },
                      { path: 'cms',                element: <S><PlacementCms /></S> },
                    ],
                  },
                ],
              },
            ],
          },

        ],
      },

      // ── BACK-COMPAT REDIRECTS ──────────────────────────────────
      // Old role-root paths redirect to the canonical /dashboard/{role}/dashboard.
      { path: '/admin',    element: <Navigate to="/dashboard/central-admin/dashboard" replace /> },
      { path: '/admin/*',  element: <Navigate to="/dashboard/central-admin/dashboard" replace /> },
      { path: '/hod',      element: <Navigate to="/dashboard/hod/dashboard" replace /> },
      { path: '/hod/*',    element: <Navigate to="/dashboard/hod/dashboard" replace /> },
      { path: '/faculty',  element: <Navigate to="/dashboard/teacher/dashboard" replace /> },
      { path: '/exam',     element: <Navigate to="/dashboard/exam/dashboard" replace /> },
      { path: '/exam/*',   element: <Navigate to="/dashboard/exam/dashboard" replace /> },
    ]
  }
])

export default router

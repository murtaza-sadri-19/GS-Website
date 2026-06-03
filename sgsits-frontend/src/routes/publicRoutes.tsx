import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import SidebarLayout from '../components/layout/SidebarLayout'
import { S, bc } from './routeHelpers'

// Core
const Home                = lazy(() => import('../pages/Home'))
const ContactUs           = lazy(() => import('../pages/ContactUs'))
const NotFound            = lazy(() => import('../pages/NotFound'))

// About
const AboutLanding        = lazy(() => import('../pages/about/AboutLanding'))
const AboutInstitute      = lazy(() => import('../pages/about/AboutInstitute'))
const VisionMission       = lazy(() => import('../pages/about/VisionMission'))
const DirectorMessage     = lazy(() => import('../pages/about/DirectorMessage'))
const GoverningBody       = lazy(() => import('../pages/about/GoverningBody'))
const Administration      = lazy(() => import('../pages/about/Administration'))
const Committees          = lazy(() => import('../pages/about/Committees'))
const TelephoneDir        = lazy(() => import('../pages/about/TelephoneDirectory'))
const Infrastructure      = lazy(() => import('../pages/about/Infrastructure'))
const IQAC                = lazy(() => import('../pages/about/IQAC'))
const AcademicCouncil     = lazy(() => import('../pages/about/AcademicCouncil'))
const Accreditation       = lazy(() => import('../pages/about/Accreditation'))
const CustomAboutPage     = lazy(() => import('../pages/about/CustomAboutPage'))

// Academics
const AcademicsLanding    = lazy(() => import('../pages/academics/AcademicsLanding'))
const AcademicCalendar    = lazy(() => import('../pages/academics/AcademicCalendar'))
const UGCourses           = lazy(() => import('../pages/academics/UGCourses'))
const PGCourses           = lazy(() => import('../pages/academics/PGCourses'))
const PhDCourses          = lazy(() => import('../pages/academics/PhDCourses'))
const PTDCCourses         = lazy(() => import('../pages/academics/PTDCCourses'))
const OnlineCourses       = lazy(() => import('../pages/academics/OnlineCourses'))
const FirstYearInfo       = lazy(() => import('../pages/academics/FirstYearInfo'))
const ExamResults         = lazy(() => import('../pages/academics/ExamResults'))
const Ordinances          = lazy(() => import('../pages/academics/Ordinances'))
const PlagiarismPolicy    = lazy(() => import('../pages/academics/PlagiarismPolicy'))
const CodeOfConduct       = lazy(() => import('../pages/academics/CodeOfConduct'))
const OBENep2020          = lazy(() => import('../pages/academics/OBENep2020'))

// Departments
const DepartmentLanding   = lazy(() => import('../pages/departments/DepartmentLanding'))
const DepartmentDetail    = lazy(() => import('../pages/departments/DepartmentDetail'))

// Faculty
const FacultyProfile      = lazy(() => import('../pages/faculty/FacultyProfile'))

// Students / Campus Life
const CampusLifeLanding   = lazy(() => import('../pages/students/CampusLifeLanding'))
const Activities          = lazy(() => import('../pages/students/Activities'))
const ScholarshipGovt     = lazy(() => import('../pages/students/ScholarshipGovt'))
const ScholarshipInstitute = lazy(() => import('../pages/students/ScholarshipInstitute'))
const SSS                 = lazy(() => import('../pages/students/SSS'))
const NCC                 = lazy(() => import('../pages/students/NCC'))
const NSS                 = lazy(() => import('../pages/students/NSS'))
const CustomCampusLifePage = lazy(() => import('../pages/students/CustomCampusLifePage'))

// Facilities
const FacilitiesLanding   = lazy(() => import('../pages/facilities/FacilitiesLanding'))
const ComputerCenter      = lazy(() => import('../pages/facilities/ComputerCenter'))
const Library             = lazy(() => import('../pages/facilities/Library'))
const Workshop            = lazy(() => import('../pages/facilities/Workshop'))
const Gymnasium           = lazy(() => import('../pages/facilities/Gymnasium'))
const Dispensary          = lazy(() => import('../pages/facilities/Dispensary'))
const CIDI                = lazy(() => import('../pages/facilities/CIDI'))
const GamesSports         = lazy(() => import('../pages/facilities/GamesSports'))
const BoysHostel          = lazy(() => import('../pages/facilities/BoysHostel'))
const GirlsHostel         = lazy(() => import('../pages/facilities/GirlsHostel'))
const TransitHostel       = lazy(() => import('../pages/facilities/TransitHostel'))
const StaffQuarters       = lazy(() => import('../pages/facilities/StaffQuarters'))
const IDEALab             = lazy(() => import('../pages/facilities/IDEALab'))

// Placement (public)
const PlacementsLanding   = lazy(() => import('../pages/placement/PlacementsLanding'))
const TNPCell             = lazy(() => import('../pages/placement/TNPCell'))
const LeadingCompanies    = lazy(() => import('../pages/placement/LeadingCompanies'))
const PlacementRecord     = lazy(() => import('../pages/placement/PlacementRecord'))
const PlacementContact    = lazy(() => import('../pages/placement/PlacementContact'))
const CustomPlacementPage = lazy(() => import('../pages/placement/CustomPlacementPage'))

// Admission
const AdmissionsLanding   = lazy(() => import('../pages/admission/AdmissionsLanding'))
const UGAdmission         = lazy(() => import('../pages/admission/UGAdmission'))
const PGAdmission         = lazy(() => import('../pages/admission/PGAdmission'))
const PhDAdmission        = lazy(() => import('../pages/admission/PhDAdmission'))
const Prospectus          = lazy(() => import('../pages/admission/Prospectus'))
const CustomAdmissionPage = lazy(() => import('../pages/admission/CustomAdmissionPage'))

// Explore
const CampusMapPage       = lazy(() => import('../pages/explore/CampusMapPage'))
const PhotoGalleryPage    = lazy(() => import('../pages/explore/PhotoGalleryPage'))
const AlbumPage           = lazy(() => import('../pages/explore/AlbumPage'))
const VideoTourPage       = lazy(() => import('../pages/explore/VideoTourPage'))
const AnthemPage          = lazy(() => import('../pages/explore/AnthemPage'))

// Startup Cell / TEQIP
const StartupCellPage     = lazy(() => import('../pages/startupCell/StartupCellPage'))
const TeqipPage           = lazy(() => import('../pages/teqip/TeqipPage'))

// Live Feed
const NoticesPage         = lazy(() => import('../pages/livefeed/NoticesPage'))
const NewsPage            = lazy(() => import('../pages/livefeed/NewsPage'))
const NewsDetailPage      = lazy(() => import('../pages/livefeed/NewsDetailPage'))
const EventsPage          = lazy(() => import('../pages/livefeed/EventsPage'))
const TendersPage         = lazy(() => import('../pages/livefeed/TendersPage'))

// Policy
const PrivacyPolicy          = lazy(() => import('../pages/policy/PrivacyPolicy'))
const TermsOfUse             = lazy(() => import('../pages/policy/TermsOfUse'))
const Disclaimer             = lazy(() => import('../pages/policy/Disclaimer'))
const AccessibilityStatement = lazy(() => import('../pages/policy/AccessibilityStatement'))
const CopyrightPolicy        = lazy(() => import('../pages/policy/CopyrightPolicy'))
const HyperlinkPolicy        = lazy(() => import('../pages/policy/HyperlinkPolicy'))
const SecurityPolicy         = lazy(() => import('../pages/policy/SecurityPolicy'))
const SiteMapPage            = lazy(() => import('../pages/policy/SiteMapPage'))
const WebInfoManager         = lazy(() => import('../pages/policy/WebInfoManager'))
const HelpPage               = lazy(() => import('../pages/policy/HelpPage'))
const FeedbackPage           = lazy(() => import('../pages/policy/FeedbackPage'))

// More
const MoreLanding            = lazy(() => import('../pages/more/MoreLanding'))

export const publicRoutes = {
  element: <MainLayout />,
  children: [
    { path: '/', element: <S><Home /></S>, handle: bc('Home') },

    // About
    {
      path: 'about',
      handle: bc('About Us'),
      children: [
        { index: true, element: <S><AboutLanding /></S>, handle: bc('About Us') },
        {
          element: <SidebarLayout section="about" />,
          children: [
            { path: 'institute',           element: <S><AboutInstitute /></S>,   handle: bc('About Institute') },
            { path: 'vision-mission',      element: <S><VisionMission /></S>,    handle: bc('Vision & Mission') },
            { path: 'director-message',    element: <S><DirectorMessage /></S>,  handle: bc("Director's Message") },
            { path: 'governing-body',      element: <S><GoverningBody /></S>,    handle: bc('Governing Body') },
            { path: 'administration',      element: <S><Administration /></S>,   handle: bc('Administration') },
            { path: 'committees',          element: <S><Committees /></S>,       handle: bc('Committees') },
            { path: 'telephone-directory', element: <S><TelephoneDir /></S>,     handle: bc('Telephone Directory') },
            { path: 'infrastructure',      element: <S><Infrastructure /></S>,   handle: bc('Infrastructure') },
            { path: 'iqac',                element: <S><IQAC /></S>,             handle: bc('IQAC') },
            { path: 'academic-council',    element: <S><AcademicCouncil /></S>,  handle: bc('Academic Council') },
            { path: 'accreditation',       element: <S><Accreditation /></S>,    handle: bc('Accreditation') },
            { path: ':customPath',         element: <S><CustomAboutPage /></S> },
          ],
        },
      ],
    },

    // Academics
    {
      path: 'academics',
      handle: bc('Academics'),
      children: [
        { index: true, element: <S><AcademicsLanding /></S>, handle: bc('Academics') },
        {
          element: <SidebarLayout section="academics" />,
          children: [
            { path: 'calendar',          element: <S><AcademicCalendar /></S>, handle: bc('Academic Calendar') },
            { path: 'courses/ug',        element: <S><UGCourses /></S>,        handle: bc('UG Courses') },
            { path: 'courses/pg',        element: <S><PGCourses /></S>,        handle: bc('PG Courses') },
            { path: 'courses/phd',       element: <S><PhDCourses /></S>,       handle: bc('PhD Courses') },
            { path: 'courses/ptdc',      element: <S><PTDCCourses /></S>,      handle: bc('PTDC Courses') },
            { path: 'courses/online',    element: <S><OnlineCourses /></S>,    handle: bc('Online Courses') },
            { path: 'first-year',        element: <S><FirstYearInfo /></S>,    handle: bc('First Year Info') },
            { path: 'exam-results',      element: <S><ExamResults /></S>,      handle: bc('Exam & Results') },
            { path: 'ordinances',        element: <S><Ordinances /></S>,       handle: bc('Ordinances') },
            { path: 'plagiarism-policy', element: <S><PlagiarismPolicy /></S>, handle: bc('Plagiarism Policy') },
            { path: 'code-of-conduct',   element: <S><CodeOfConduct /></S>,    handle: bc('Code of Conduct') },
            { path: 'obe-nep-2020',      element: <S><OBENep2020 /></S>,       handle: bc('OBE & NEP 2020') },
          ],
        },
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
          children: [{ index: true, element: <S><DepartmentDetail /></S> }],
        },
      ],
    },

    // Faculty profile
    { path: 'faculty/:facultyId', element: <S><FacultyProfile /></S>, handle: bc('Faculty Profile') },

    // Students / Campus Life
    {
      path: 'students',
      handle: bc('Campus Life'),
      children: [
        { index: true, element: <S><CampusLifeLanding /></S>, handle: bc('Campus Life') },
        {
          element: <SidebarLayout section="students" />,
          children: [
            { path: 'activities',            element: <S><Activities /></S>,           handle: bc('Activities') },
            { path: 'scholarship/govt',      element: <S><ScholarshipGovt /></S>,      handle: bc('Govt. Scholarship') },
            { path: 'scholarship/institute', element: <S><ScholarshipInstitute /></S>, handle: bc('Institute Scholarship') },
            { path: 'sss',                   element: <S><SSS /></S>,                  handle: bc('SSS') },
            { path: 'ncc',                   element: <S><NCC /></S>,                  handle: bc('NCC') },
            { path: 'nss',                   element: <S><NSS /></S>,                  handle: bc('NSS') },
            { path: ':customPath',           element: <S><CustomCampusLifePage /></S> },
          ],
        },
      ],
    },
    { path: 'campus-life', element: <Navigate to="/students" replace /> },

    // Facilities
    {
      path: 'facilities',
      handle: bc('Facilities'),
      children: [
        { index: true, element: <S><FacilitiesLanding /></S>, handle: bc('Facilities') },
        {
          element: <SidebarLayout section="facilities" />,
          children: [
            { path: 'computer-center', element: <S><ComputerCenter /></S>, handle: bc('Computer Center') },
            { path: 'library',         element: <S><Library /></S>,         handle: bc('Library') },
            { path: 'workshop',        element: <S><Workshop /></S>,        handle: bc('Workshop') },
            { path: 'gymnasium',       element: <S><Gymnasium /></S>,       handle: bc('Gymnasium') },
            { path: 'dispensary',      element: <S><Dispensary /></S>,      handle: bc('Dispensary') },
            { path: 'cidi',            element: <S><CIDI /></S>,            handle: bc('CIDI') },
            { path: 'sports',          element: <S><GamesSports /></S>,     handle: bc('Games & Sports') },
            { path: 'hostel/boys',     element: <S><BoysHostel /></S>,      handle: bc('Boys Hostel') },
            { path: 'hostel/girls',    element: <S><GirlsHostel /></S>,     handle: bc('Girls Hostel') },
            { path: 'hostel/transit',  element: <S><TransitHostel /></S>,   handle: bc('Transit Hostel') },
            { path: 'hostel/staff',    element: <S><StaffQuarters /></S>,   handle: bc('Staff Quarters') },
            { path: 'idea-lab',        element: <S><IDEALab /></S>,         handle: bc('IDEA Lab') },
          ],
        },
      ],
    },

    // Placement (public)
    {
      path: 'placement',
      handle: bc('Placements'),
      children: [
        { index: true, element: <S><PlacementsLanding /></S>, handle: bc('Placements') },
        {
          element: <SidebarLayout section="placement" />,
          children: [
            { path: 'tnp-cell',    element: <S><TNPCell /></S>,           handle: bc('T&P Cell') },
            { path: 'companies',   element: <S><LeadingCompanies /></S>,  handle: bc('Leading Companies') },
            { path: 'record',      element: <S><PlacementRecord /></S>,   handle: bc('Placement Record') },
            { path: 'contact',     element: <S><PlacementContact /></S>,  handle: bc('Contact Person') },
            { path: ':customPath', element: <S><CustomPlacementPage /></S> },
          ],
        },
      ],
    },

    // Admission
    {
      path: 'admission',
      handle: bc('Admissions'),
      children: [
        { index: true, element: <S><AdmissionsLanding /></S>, handle: bc('Admissions') },
        {
          element: <SidebarLayout section="admission" />,
          children: [
            { path: 'ug',          element: <S><UGAdmission /></S>,        handle: bc('UG Admission') },
            { path: 'pg',          element: <S><PGAdmission /></S>,        handle: bc('PG Admission') },
            { path: 'phd',         element: <S><PhDAdmission /></S>,       handle: bc('PhD Admission') },
            { path: 'prospectus',  element: <S><Prospectus /></S>,         handle: bc('Prospectus') },
            { path: ':customPath', element: <S><CustomAdmissionPage /></S> },
          ],
        },
      ],
    },

    // More
    {
      path: 'more',
      handle: bc('More'),
      children: [{ index: true, element: <S><MoreLanding /></S>, handle: bc('More') }],
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

    // Startup Cell
    {
      path: 'startup-cell',
      element: <SidebarLayout section="startup" />,
      handle: bc('Startup Cell'),
      children: [{ index: true, element: <S><StartupCellPage /></S> }],
    },

    // TEQIP
    {
      path: 'teqip',
      element: <SidebarLayout section="teqip" />,
      handle: bc('TEQIP'),
      children: [
        { index: true, element: <Navigate to="about" replace /> },
        { path: ':subpage', element: <S><TeqipPage /></S>, handle: bc('TEQIP') },
      ],
    },

    // Live Feed
    {
      path: 'news',
      element: <SidebarLayout section="news" />,
      handle: bc('News'),
      children: [
        { index: true, element: <S><NewsPage /></S> },
        { path: ':id', element: <S><NewsDetailPage /></S>, handle: bc('News Details') },
      ],
    },
    { path: 'notices', element: <SidebarLayout section="notices" />, handle: bc('Notices'), children: [{ index: true, element: <S><NoticesPage /></S> }] },
    { path: 'events',  element: <SidebarLayout section="events" />,  handle: bc('Events'),  children: [{ index: true, element: <S><EventsPage /></S> }] },
    { path: 'tenders', element: <SidebarLayout section="tenders" />, handle: bc('Tenders'), children: [{ index: true, element: <S><TendersPage /></S> }] },

    // Policy
    {
      path: 'policy',
      handle: bc('Policy'),
      children: [{
        element: <SidebarLayout section="policy" />,
        children: [
          { path: 'privacy',          element: <S><PrivacyPolicy /></S>,          handle: bc('Privacy Policy') },
          { path: 'terms',            element: <S><TermsOfUse /></S>,             handle: bc('Terms of Use') },
          { path: 'disclaimer',       element: <S><Disclaimer /></S>,             handle: bc('Disclaimer') },
          { path: 'accessibility',    element: <S><AccessibilityStatement /></S>, handle: bc('Accessibility') },
          { path: 'copyright',        element: <S><CopyrightPolicy /></S>,        handle: bc('Copyright Policy') },
          { path: 'hyperlink',        element: <S><HyperlinkPolicy /></S>,        handle: bc('Hyperlink Policy') },
          { path: 'security',         element: <S><SecurityPolicy /></S>,         handle: bc('Security Policy') },
          { path: 'sitemap',          element: <S><SiteMapPage /></S>,            handle: bc('Site Map') },
          { path: 'web-info-manager', element: <S><WebInfoManager /></S>,         handle: bc('Web Info Manager') },
          { path: 'help',             element: <S><HelpPage /></S>,               handle: bc('Help') },
          { path: 'feedback',         element: <S><FeedbackPage /></S>,           handle: bc('Feedback') },
        ],
      }],
    },

    { path: 'contact', element: <S><ContactUs /></S>, handle: bc('Contact Us') },
    { path: '*', element: <S><NotFound /></S> },
  ],
}

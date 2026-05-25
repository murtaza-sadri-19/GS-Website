import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, 'src', 'pages');

const pages = [
  'Home.tsx',
  'ContactUs.tsx',
  'NotFound.tsx',
  'about/AboutInstitute.tsx',
  'about/VisionMission.tsx',
  'about/DirectorMessage.tsx',
  'about/GoverningBody.tsx',
  'about/Administration.tsx',
  'about/Committees.tsx',
  'about/TelephoneDirectory.tsx',
  'about/Infrastructure.tsx',
  'about/IQAC.tsx',
  'about/AcademicCouncil.tsx',
  'about/Accreditation.tsx',
  'academics/AcademicCalendar.tsx',
  'academics/UGCourses.tsx',
  'academics/PGCourses.tsx',
  'academics/PhDCourses.tsx',
  'academics/PTDCCourses.tsx',
  'academics/OnlineCourses.tsx',
  'academics/FirstYearInfo.tsx',
  'academics/ExamResults.tsx',
  'academics/Ordinances.tsx',
  'academics/PlagiarismPolicy.tsx',
  'academics/CodeOfConduct.tsx',
  'academics/OBENep2020.tsx',
  'departments/DepartmentLanding.tsx',
  'departments/DepartmentDetail.tsx',
  'faculty/FacultyProfile.tsx',
  'students/Activities.tsx',
  'students/ScholarshipGovt.tsx',
  'students/ScholarshipInstitute.tsx',
  'students/SSS.tsx',
  'students/NCC.tsx',
  'students/NSS.tsx',
  'facilities/ComputerCenter.tsx',
  'facilities/Library.tsx',
  'facilities/Workshop.tsx',
  'facilities/Gymnasium.tsx',
  'facilities/Dispensary.tsx',
  'facilities/CIDI.tsx',
  'facilities/GamesSports.tsx',
  'facilities/BoysHostel.tsx',
  'facilities/GirlsHostel.tsx',
  'facilities/TransitHostel.tsx',
  'facilities/StaffQuarters.tsx',
  'facilities/IDEALab.tsx',
  'placement/TNPCell.tsx',
  'placement/LeadingCompanies.tsx',
  'placement/PlacementRecord.tsx',
  'placement/PlacementContact.tsx',
  'admission/UGAdmission.tsx',
  'admission/PGAdmission.tsx',
  'admission/PhDAdmission.tsx',
  'admission/Prospectus.tsx',
  'explore/CampusMapPage.tsx',
  'explore/PhotoGalleryPage.tsx',
  'explore/AlbumPage.tsx',
  'explore/VideoTourPage.tsx',
  'explore/AnthemPage.tsx',
  'startupCell/StartupCellPage.tsx',
  'teqip/TeqipPage.tsx',
  'livefeed/NoticesPage.tsx',
  'livefeed/NewsPage.tsx',
  'livefeed/EventsPage.tsx',
  'livefeed/TendersPage.tsx',
  'policy/PrivacyPolicy.tsx',
  'policy/TermsOfUse.tsx',
  'policy/Disclaimer.tsx',
  'policy/AccessibilityStatement.tsx',
  'policy/CopyrightPolicy.tsx',
  'policy/HyperlinkPolicy.tsx',
  'policy/SecurityPolicy.tsx',
  'policy/SiteMapPage.tsx',
  'policy/WebInfoManager.tsx',
  'policy/HelpPage.tsx',
  'policy/FeedbackPage.tsx',
  'admin/AdminLogin.tsx',
  'admin/AdminDashboard.tsx',
  'admin/AdminNotices.tsx',
  'admin/AdminNews.tsx',
  'admin/AdminEvents.tsx',
  'admin/AdminTenders.tsx',
  'admin/AdminAlerts.tsx',
  'admin/AdminDepartments.tsx',
  'admin/AdminFaculty.tsx',
  'admin/AdminGallery.tsx',
  'admin/AdminPlacement.tsx',
  'admin/AdminSettings.tsx'
];

function getTemplate(pageName, folder) {
  const cleanName = pageName.replace('.tsx', '');
  return `import React from 'react'

const ${cleanName}: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-display text-2xl font-extrabold text-slate-800 dark:text-white">
          ${cleanName.replace(/([A-Z])/g, ' $1').trim()}
        </h2>
        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
          Official resource gateway for SGSITS Institute portal.
        </p>
      </div>

      <div className="p-6 bg-slate-50/60 dark:bg-slate-900/30 rounded-2xl border border-slate-150 dark:border-slate-800/40 space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
          Welcome to the <strong>${cleanName.replace(/([A-Z])/g, ' $1').trim()}</strong> portal. This content area serves as the direct migration interface for dynamic articles, downloadable schemes, syllabus sheets, and administrative records.
        </p>
        
        <div className="p-4 bg-brand-burgundy/5 dark:bg-brand-gold/5 rounded-xl border border-brand-burgundy/10 dark:border-brand-gold/10">
          <p className="text-xs font-semibold text-brand-burgundy dark:text-brand-gold">
            ℹ️ Notice for Students & Staff
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            All details rendered on this sub-page are pulled dynamically from the central academic databases. Please verify official schedules via notice boards for late updates.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ${cleanName}
`;
}

pages.forEach((p) => {
  const filePath = path.join(baseDir, p);
  const fileDir = path.dirname(filePath);
  
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }

  const baseName = path.basename(filePath);
  const template = getTemplate(baseName, path.basename(fileDir));
  
  fs.writeFileSync(filePath, template, 'utf8');
  console.log(`Created skeleton: ${filePath}`);
});

console.log('All skeletons created successfully.');

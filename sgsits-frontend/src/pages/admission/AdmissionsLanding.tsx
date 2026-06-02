import React from 'react'
import NavCategoryPage from '../../components/global/NavCategoryPage'
import { UserPlus, GraduationCap, FlaskConical, Download } from 'lucide-react'

const S = 18
const cards = [
  { icon: <UserPlus size={S} />,      title: 'UG Admissions',       description: 'Eligibility, selection process, and key dates for B.E. / B.Tech programmes.', path: '/admission/ug',          badge: 'JEE Mains' },
  { icon: <GraduationCap size={S} />, title: 'PG Admissions',       description: 'Admission process and eligibility for M.E. / M.Tech / MBA programmes.',       path: '/admission/pg',          badge: 'GATE / MAT' },
  { icon: <FlaskConical size={S} />,  title: 'Ph.D. Admissions',    description: 'Doctoral research admissions, research areas, supervisors, and requirements.', path: '/admission/phd'          },
  { icon: <Download size={S} />,      title: 'Prospectus Download', description: 'Download the official institute prospectus with complete course and fee info.', path: '/admission/prospectus',  badge: 'PDF' },
]

const AdmissionsLanding: React.FC = () => (
  <NavCategoryPage sectionLabel="Admissions" heroTitle="Admissions at SGSITS"
    heroSubtitle="Find eligibility criteria, admission processes, important dates, and prospectus for all programmes."
    breadcrumbs={[{ label: 'Admissions' }]} cards={cards} />
)
export default AdmissionsLanding

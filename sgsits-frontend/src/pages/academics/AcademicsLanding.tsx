import React from 'react'
import NavCategoryPage from '../../components/global/NavCategoryPage'
import { CalendarDays, BookOpen, GraduationCap, FlaskConical, BookMarked, Monitor, Star, FileText, Scale, ShieldCheck, Scroll, LayoutGrid } from 'lucide-react'

const S = 18
const cards = [
  { icon: <CalendarDays size={S} />,  title: 'Academic Calendar',     description: 'Semester dates, holidays, and important academic events.',                       path: '/academics/calendar'          },
  { icon: <BookOpen size={S} />,      title: 'UG Courses',             description: 'Undergraduate engineering programmes across all departments.',                   path: '/academics/courses/ug'        },
  { icon: <GraduationCap size={S} />, title: 'PG Courses',             description: 'M.E. / M.Tech / MBA postgraduate programmes and eligibility.',                  path: '/academics/courses/pg'        },
  { icon: <FlaskConical size={S} />,  title: 'Ph.D. Programs',         description: 'Doctoral research programmes, supervisors, and admission procedures.',          path: '/academics/courses/phd'       },
  { icon: <BookMarked size={S} />,    title: 'PTDC Courses',           description: 'Part-Time Diploma Courses for working professionals.',                         path: '/academics/courses/ptdc'      },
  { icon: <Monitor size={S} />,       title: 'Online Courses (MOOC)',  description: 'NPTEL and MOOC courses integrated into the academic curriculum.',              path: '/academics/courses/online'    },
  { icon: <Star size={S} />,          title: 'First Year Info',        description: 'Orientation, hostel, timetables and essentials for new students.',             path: '/academics/first-year',  badge: 'New Students' },
  { icon: <FileText size={S} />,      title: 'Exam & Results',         description: 'Examination schedules, result notifications and academic records.',            path: '/academics/exam-results'      },
  { icon: <Scale size={S} />,         title: 'Ordinances',             description: 'Official academic ordinances governing examinations and degrees.',             path: '/academics/ordinances'        },
  { icon: <ShieldCheck size={S} />,   title: 'Plagiarism Policy',      description: 'Anti-plagiarism policy and consequences of academic misconduct.',              path: '/academics/plagiarism-policy' },
  { icon: <Scroll size={S} />,        title: 'Code of Ethics',         description: 'Code of conduct and professional ethics for students and staff.',              path: '/academics/code-of-conduct'   },
  { icon: <LayoutGrid size={S} />,    title: 'OBE & NEP 2020',        description: 'Outcome-Based Education and National Education Policy 2020 implementation.',  path: '/academics/obe-nep-2020'      },
]

const AcademicsLanding: React.FC = () => (
  <NavCategoryPage sectionLabel="Academics" heroTitle="Academics at SGSITS"
    heroSubtitle="Explore academic programmes, calendars, examination policies, ordinances, and educational frameworks."
    breadcrumbs={[{ label: 'Academics' }]} cards={cards} />
)
export default AcademicsLanding

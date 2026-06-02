import React from 'react'
import NavCategoryPage from '../../components/global/NavCategoryPage'
import { Activity, IndianRupee, Award, Trophy, Shield, Heart } from 'lucide-react'

const S = 18
const cards = [
  { icon: <Activity size={S} />,     title: 'Student Activities',     description: 'Clubs, technical fests, cultural events, and co-curricular activities.',      path: '/students/activities'            },
  { icon: <IndianRupee size={S} />,  title: 'Govt. Scholarships',     description: 'Government scholarships, financial aid schemes, and eligibility criteria.',   path: '/students/scholarship/govt'      },
  { icon: <Award size={S} />,        title: 'Institute Scholarships',  description: 'Merit-based and need-based scholarships for enrolled SGSITS students.',       path: '/students/scholarship/institute' },
  { icon: <Trophy size={S} />,       title: 'Sports & Games (SSS)',   description: 'Sports & Student Services facilities, teams, achievements and annual events.', path: '/students/sss'                   },
  { icon: <Shield size={S} />,       title: 'NCC Wing',               description: 'National Cadet Corps — develop leadership, discipline and patriotic values.',  path: '/students/ncc'                   },
  { icon: <Heart size={S} />,        title: 'NSS Wing',               description: 'Community service, health camps, and social initiatives through the NSS.',    path: '/students/nss'                   },
]

const CampusLifeLanding: React.FC = () => (
  <NavCategoryPage sectionLabel="Campus Life" heroTitle="Campus Life at SGSITS"
    heroSubtitle="Experience a vibrant campus with student activities, scholarships, sports, NCC, NSS, and more."
    breadcrumbs={[{ label: 'Campus Life' }]} cards={cards} />
)
export default CampusLifeLanding

import React from 'react'
import NavCategoryPage from '../../components/global/NavCategoryPage'
import { Briefcase, Building, BarChart3, Contact } from 'lucide-react'

const S = 18
const cards = [
  { icon: <Briefcase size={S} />, title: 'T&P Cell Overview',  description: 'Training & Placement Cell activities and how it connects students with top employers.', path: '/placement/tnp-cell'  },
  { icon: <Building size={S} />,  title: 'Leading Recruiters', description: 'Browse leading companies and organisations that actively recruit from SGSITS.',           path: '/placement/companies' },
  { icon: <BarChart3 size={S} />, title: 'Placement Record',   description: 'Year-wise placement statistics, highest packages, average CTC and branch-wise data.',     path: '/placement/record'    },
  { icon: <Contact size={S} />,   title: 'Placement Contacts', description: 'Get in touch with T&P Cell officers for campus recruitment and corporate tie-ups.',        path: '/placement/contact'   },
]

const PlacementsLanding: React.FC = () => (
  <NavCategoryPage sectionLabel="Placements" heroTitle="Placements at SGSITS"
    heroSubtitle="Explore placement records, leading recruiters, training opportunities, and T&P Cell information."
    breadcrumbs={[{ label: 'Placements' }]} cards={cards} />
)
export default PlacementsLanding

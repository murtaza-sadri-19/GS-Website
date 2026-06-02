import React from 'react'
import NavCategoryPage from '../../components/global/NavCategoryPage'
import { Cpu, Library, Wrench, Dumbbell, HeartPulse, Lightbulb, Trophy, Home, Hotel, Building2, FlaskConical } from 'lucide-react'

const S = 18
const cards = [
  { icon: <Cpu size={S} />,          title: 'Computer Center',   description: 'High-speed internet and modern workstations across campus labs.',              path: '/facilities/computer-center' },
  { icon: <Library size={S} />,      title: 'Central Library',   description: 'A vast collection of books, journals, e-resources and reading rooms.',        path: '/facilities/library'         },
  { icon: <Wrench size={S} />,       title: 'Central Workshop',  description: 'Practical training in machining, welding, and fabrication.',                  path: '/facilities/workshop'        },
  { icon: <Dumbbell size={S} />,     title: 'Gymnasium',         description: 'Modern gymnasium with professional equipment for fitness and wellness.',       path: '/facilities/gymnasium'       },
  { icon: <HeartPulse size={S} />,   title: 'Dispensary',        description: 'On-campus health dispensary for first aid and basic medical care.',           path: '/facilities/dispensary'      },
  { icon: <Lightbulb size={S} />,    title: 'CIDI Center',       description: 'Centre for Innovation, Design and Incubation fostering entrepreneurship.',   path: '/facilities/cidi'            },
  { icon: <Trophy size={S} />,       title: 'Sports Complex',    description: 'Outdoor and indoor sports facilities including courts, tracks and grounds.',  path: '/facilities/sports'          },
  { icon: <Home size={S} />,         title: 'Boys Hostel',       description: 'Comfortable and secure hostel with mess facilities for male students.',       path: '/facilities/hostel/boys'     },
  { icon: <Home size={S} />,         title: 'Girls Hostel',      description: 'Safe and well-equipped hostel with mess facilities for female students.',     path: '/facilities/hostel/girls'    },
  { icon: <Hotel size={S} />,        title: 'Transit Hostel',    description: 'Short-stay accommodation for visiting faculty, guests, and candidates.',     path: '/facilities/hostel/transit'  },
  { icon: <Building2 size={S} />,    title: 'Staff Quarters',    description: 'Residential quarters for faculty and non-teaching staff on campus.',          path: '/facilities/hostel/staff'    },
  { icon: <FlaskConical size={S} />, title: 'AICTE IDEA Lab',   description: 'Innovation lab with 3D printers, IoT kits and maker-space resources.',        path: '/facilities/idea-lab', badge: 'AICTE' },
]

const FacilitiesLanding: React.FC = () => (
  <NavCategoryPage sectionLabel="Facilities" heroTitle="Campus Facilities"
    heroSubtitle="Explore world-class facilities including labs, library, hostels, sports complex, and innovation centers."
    breadcrumbs={[{ label: 'Facilities' }]} cards={cards} />
)
export default FacilitiesLanding

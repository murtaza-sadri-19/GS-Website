import React from 'react'
import NavCategoryPage from '../../components/global/NavCategoryPage'
import { Rocket, GanttChart, Bell, Newspaper, CalendarDays, FileText, Phone } from 'lucide-react'

const S = 18
const cards = [
  { icon: <Rocket size={S} />,       title: 'Startup & Incubation Cell', description: 'Startup ecosystem, incubation support and entrepreneurship programmes.',       path: '/startup-cell'           },
  { icon: <GanttChart size={S} />,   title: 'TEQIP Portal',              description: 'Technical Education Quality Improvement Programme initiatives.',                path: '/teqip/about'            },
  { icon: <Bell size={S} />,         title: 'Latest Notices',            description: 'Official notices, circulars, and announcements from the institute.',            path: '/notices',  badge: 'Live' },
  { icon: <Newspaper size={S} />,    title: 'Campus News',               description: 'Latest news, achievements, awards, and events across the SGSITS campus.',      path: '/news'                   },
  { icon: <CalendarDays size={S} />, title: 'Upcoming Events',           description: 'Seminars, workshops, technical fests and cultural programmes on campus.',      path: '/events'                 },
  { icon: <FileText size={S} />,     title: 'Procurement Tenders',       description: 'Active procurement tenders and official vendor notices from the institute.',   path: '/tenders'                },
  { icon: <Phone size={S} />,        title: 'Contact Us',                description: 'Reach out via phone, email, or visit us at our campus in Indore, M.P.',        path: '/contact'                },
]

const MoreLanding: React.FC = () => (
  <NavCategoryPage sectionLabel="More" heroTitle="More from SGSITS"
    heroSubtitle="Access notices, news, events, tenders, the startup cell, TEQIP portal, and contact information."
    breadcrumbs={[{ label: 'More' }]} cards={cards} />
)
export default MoreLanding

import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom'

const sections = [
  { title: 'About Us', links: [
    { label: 'About Institute', path: '/about/institute' },
    { label: 'Vision & Mission', path: '/about/vision-mission' },
    { label: "Director's Message", path: '/about/director-message' },
    { label: 'Governing Body', path: '/about/governing-body' },
    { label: 'Administration', path: '/about/administration' },
    { label: 'Accreditation', path: '/about/accreditation' },
  ]},
  { title: 'Academics', links: [
    { label: 'Academic Calendar', path: '/academics/calendar' },
    { label: 'UG Courses', path: '/academics/courses/ug' },
    { label: 'PG Courses', path: '/academics/courses/pg' },
    { label: 'Ph.D. Programs', path: '/academics/courses/phd' },
  ]},
  { title: 'Placements', links: [
    { label: 'T&P Cell', path: '/placement/tnp-cell' },
    { label: 'Leading Recruiters', path: '/placement/companies' },
    { label: 'Placement Record', path: '/placement/record' },
  ]},
  { title: 'Facilities', links: [
    { label: 'Computer Center', path: '/facilities/computer-center' },
    { label: 'Central Library', path: '/facilities/library' },
    { label: 'Hostels', path: '/facilities/hostel/boys' },
  ]},
]

const SiteMapPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageSeo pageKey="policy/sitemap" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Sitemap</h2>
        <p className="text-sm text-gray-500 mt-1">Complete navigation map of the SGSITS website</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {sections.map(s => (
          <div key={s.title}>
            <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--color-primary)' }}>{s.title}</h3>
            <ul className="space-y-2">
              {s.links.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-gray-600 hover:underline" style={{ '--tw-text-opacity': '1' } as React.CSSProperties}>
                    → {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SiteMapPage

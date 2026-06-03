import React from 'react'
import { Link } from 'react-router-dom'
import { Building } from 'lucide-react'
import { C } from './homeConstants'
import { Sk } from '../ui/Skeleton'

interface DepartmentsSectionProps {
  section: Record<string, any>
  viewAllLabel: string
  loading: boolean
}

const SkeletonDepartments: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-hidden="true">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="p-3 bg-white rounded flex items-center border" style={{ borderColor: C.navy15 }}>
        <Sk className="w-8 h-8 rounded shrink-0 mr-3" />
        <Sk className="h-3 w-36 rounded flex-1" />
      </div>
    ))}
  </div>
)

const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ section, viewAllLabel, loading }) => (
  <section
    className="py-16 bg-white relative z-10"
    style={{ borderBottom: `1px solid ${C.navy10}` }}
  >
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
      <div
        className="flex justify-between items-end mb-10 pb-4 border-b"
        style={{ borderColor: C.navy10 }}
      >
        <div>
          {loading ? (
            <div className="space-y-2" aria-hidden="true">
              <Sk className="h-2.5 w-24 rounded" />
              <Sk className="h-7 w-56 rounded" />
            </div>
          ) : (
            <div className="animate-fade-in">
              <span className="text-[10px] uppercase font-bold tracking-widest block mb-1" style={{ color: C.gold }}>
                {section.label}
              </span>
              <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight uppercase" style={{ color: C.navy }}>
                {section.heading}{' '}
                <span className="font-serif italic font-semibold" style={{ color: C.navy }}>{section.accentText}</span>
              </h2>
            </div>
          )}
        </div>
        <Link
          to={section.showAllLink ?? '#'}
          className="font-semibold hover:underline text-xs tracking-wider uppercase hidden md:block"
          style={{ color: C.navy }}
        >
          {viewAllLabel}
        </Link>
      </div>

      {loading ? (
        <SkeletonDepartments />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
          {(section.items ?? []).map((dept: Record<string, any>, idx: number) => (
            <Link
              key={idx}
              to={`/departments/${dept.slug}`}
              className="p-3 bg-white rounded flex items-center transition-all duration-200 group border hover:shadow-sm"
              style={{ borderColor: C.navy15 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.navy }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.navy15 }}
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center mr-3 shrink-0 transition-all duration-200 border"
                style={{ backgroundColor: C.white, borderColor: C.navy15, color: C.navy55 }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.backgroundColor = C.navy
                  el.style.color = C.white
                  el.style.borderColor = C.navy
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.backgroundColor = C.white
                  el.style.color = C.navy55
                  el.style.borderColor = C.navy15
                }}
              >
                <Building size={14} />
              </div>
              <span className="font-sans font-semibold text-xs group-hover:underline" style={{ color: C.navy }}>
                {dept.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  </section>
)

export default DepartmentsSection

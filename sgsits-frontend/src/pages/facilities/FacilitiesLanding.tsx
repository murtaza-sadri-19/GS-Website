import React from 'react'
import SectionRenderer, { usePageSections } from '../../components/sections/SectionRenderer'
import { SkeletonNavGrid } from '../../components/ui/Skeleton'

const FacilitiesLanding: React.FC = () => {
  const { sections, loading } = usePageSections('facilities')

  if (loading) return <SkeletonNavGrid count={12} />

  return (
    <div className="w-full">
      {sections.map(s => <SectionRenderer key={s.id} section={s} />)}
    </div>
  )
}

export default FacilitiesLanding

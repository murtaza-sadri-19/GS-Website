import React from 'react'
import SectionRenderer, { usePageSections } from '../../components/sections/SectionRenderer'
import { SkeletonNavGrid } from '../../components/ui/Skeleton'

const PlacementsLanding: React.FC = () => {
  const { sections, loading } = usePageSections('placements')

  if (loading) return <SkeletonNavGrid count={4} />

  return (
    <div className="w-full">
      {sections.map(s => <SectionRenderer key={s.id} section={s} />)}
    </div>
  )
}

export default PlacementsLanding

import React from 'react'
import SectionRenderer, { usePageSections } from '../../components/sections/SectionRenderer'
import { SkeletonNavGrid } from '../../components/ui/Skeleton'

const CampusLifeLanding: React.FC = () => {
  const { sections, loading } = usePageSections('campus-life')

  if (loading) return <SkeletonNavGrid count={6} />

  return (
    <div className="w-full">
      {sections.map(s => <SectionRenderer key={s.id} section={s} />)}
    </div>
  )
}

export default CampusLifeLanding

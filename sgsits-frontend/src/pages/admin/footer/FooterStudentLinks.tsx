import React from 'react'
import { GraduationCap } from 'lucide-react'
import footerService, { type FooterSection } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, LinkListEditor, BackendNote, LoadingSkeleton } from './_shared'

const FooterStudentLinksEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterSection>(
    footerService.getStudentLinks,
    footerService.saveStudentLinks,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  return (
    <SectionCard
      title="Student Links"
      subtitle="Second navigational column in the footer (Student Gateways, Academics, etc.)"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<GraduationCap size={15} />}>Column Editor</CardHeading>
        <LinkListEditor
          section={data}
          onChange={setData as (s: FooterSection) => void}
          linkType="internal"
          placeholder={{ label: 'Academic Calendar', route: '/academics/calendar' }}
        />
      </Card>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
        <p className="font-bold text-slate-700 mb-1">💡 Student Links tips</p>
        <ul className="space-y-1 list-disc list-inside text-slate-500">
          <li>Typically contains: Academic Calendar, Exam Results, Scholarships, Placements</li>
          <li>All links should point to internal React Router paths</li>
          <li>Recommended: keep this to 5–8 links for visual balance</li>
        </ul>
      </div>

      <BackendNote endpoint="PUT /api/cms/footer/student-links" />
    </SectionCard>
  )
}

export default FooterStudentLinksEditor

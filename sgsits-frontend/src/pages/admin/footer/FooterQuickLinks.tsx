import React from 'react'
import { Link2 } from 'lucide-react'
import footerService, { type FooterSection } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, LinkListEditor, BackendNote, LoadingSkeleton } from './_shared'

const FooterQuickLinksEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterSection>(
    footerService.getQuickLinks,
    footerService.saveQuickLinks,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  return (
    <SectionCard
      title="Quick Links"
      subtitle="First navigational column in the footer (typically Administration links)"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<Link2 size={15} />}>Column Editor</CardHeading>
        <LinkListEditor
          section={data}
          onChange={setData as (s: FooterSection) => void}
          linkType="internal"
          placeholder={{ label: 'About the Institute', route: '/about/institute' }}
        />
      </Card>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
        <p className="font-bold text-slate-700 mb-1">💡 Quick Links tips</p>
        <ul className="space-y-1 list-disc list-inside text-slate-500">
          <li>These are <strong>internal routes</strong> — use React Router paths like <code>/about/institute</code></li>
          <li>Use the eye icon to temporarily hide a link without deleting it</li>
          <li>Up/Down arrows change display order</li>
          <li>Changes only apply after clicking <strong>Save</strong></li>
        </ul>
      </div>

      <BackendNote endpoint="PUT /api/cms/footer/quick-links" />
    </SectionCard>
  )
}

export default FooterQuickLinksEditor

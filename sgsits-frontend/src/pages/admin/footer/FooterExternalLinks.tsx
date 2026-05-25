import React from 'react'
import { Globe } from 'lucide-react'
import footerService, { type FooterSection } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, LinkListEditor, BackendNote, LoadingSkeleton } from './_shared'

const FooterExternalLinksEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterSection>(
    footerService.getExternalLinks,
    footerService.saveExternalLinks,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  return (
    <SectionCard
      title="Important External Links"
      subtitle="Regulatory bodies, affiliating universities, and portal links shown in the footer"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<Globe size={15} />}>External Link Column</CardHeading>
        <LinkListEditor
          section={data}
          onChange={setData as (s: FooterSection) => void}
          linkType="external"
          placeholder={{ label: 'AICTE India', url: 'https://www.aicte-india.org' }}
        />
      </Card>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
        <p className="font-bold text-slate-700 mb-1">💡 External Links tips</p>
        <ul className="space-y-1 list-disc list-inside text-slate-500">
          <li>Use full URLs including <code>https://</code></li>
          <li>All external links open in a new tab automatically</li>
          <li>Typical entries: AICTE, DTE MP, RGPV, NAAC, UGC, etc.</li>
          <li>Leave the Internal Route field blank for external-only links</li>
        </ul>
      </div>

      <BackendNote endpoint="PUT /api/cms/footer/external-links" />
    </SectionCard>
  )
}

export default FooterExternalLinksEditor

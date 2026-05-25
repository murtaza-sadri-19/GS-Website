import React from 'react'
import { Search } from 'lucide-react'
import footerService, { type FooterSeoMeta } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, Field, Txta, Toggle, BackendNote, LoadingSkeleton } from './_shared'

const FooterSeoEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterSeoMeta>(
    footerService.getSeoMeta,
    footerService.saveSeoMeta,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  const set = <K extends keyof FooterSeoMeta>(key: K, val: FooterSeoMeta[K]) =>
    setData(d => d ? { ...d, [key]: val } : d)

  return (
    <SectionCard
      title="SEO / Footer Metadata"
      subtitle="Search engine optimization settings specific to the footer"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<Search size={15} />}>Structured Data & Open Graph</CardHeading>
        <div className="space-y-3">
          <Toggle
            checked={data.schemaOrgEnabled}
            onChange={v => set('schemaOrgEnabled', v)}
            label="Schema.org Structured Data"
            desc="Inject JSON-LD Organization schema into the page for rich search results"
          />
          <Toggle
            checked={data.openGraphEnabled}
            onChange={v => set('openGraphEnabled', v)}
            label="Open Graph Tags"
            desc="Add og:title / og:description meta tags for social media sharing"
          />
        </div>
      </Card>

      <Card>
        <CardHeading>Footer Meta Description</CardHeading>
        <Field label="Description" hint="Used in Schema.org Organization description and og:description (max ~160 chars)">
          <Txta
            rows={3}
            value={data.footerMetaDescription}
            onChange={e => set('footerMetaDescription', e.target.value)}
            placeholder="SGSITS Indore — Shri G. S. Institute of Technology & Science…"
          />
          <p className={`text-[10px] mt-1 ${data.footerMetaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
            {data.footerMetaDescription.length}/160 characters
            {data.footerMetaDescription.length > 160 && ' — consider shortening for best SEO results'}
          </p>
        </Field>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-700">
        <p className="font-bold mb-1">🔌 Implementation Note</p>
        <p>When Schema.org is enabled, the public Footer component will inject a <code>&lt;script type="application/ld+json"&gt;</code> Organization schema block. When Open Graph is enabled, meta tags are injected via react-helmet or equivalent head management.</p>
      </div>

      <BackendNote endpoint="PUT /api/cms/footer/seo" />
    </SectionCard>
  )
}

export default FooterSeoEditor

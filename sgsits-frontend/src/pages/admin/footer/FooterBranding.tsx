import React from 'react'
import { Building2 } from 'lucide-react'
import footerService, { type FooterBranding } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, Field, Inp, Txta, BackendNote, LoadingSkeleton } from './_shared'

const FooterBrandingEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterBranding>(
    footerService.getBranding,
    footerService.saveBranding,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  const set = <K extends keyof FooterBranding>(key: K, val: FooterBranding[K]) =>
    setData(d => d ? { ...d, [key]: val } : d)

  return (
    <SectionCard
      title="Branding & Logo"
      subtitle="Institute identity shown in the footer left column"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<Building2 size={15} />}>Institute Identity</CardHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Short Code" hint="2-letter badge shown in footer (e.g. SG)" required>
            <Inp value={data.shortCode} maxLength={4}
              onChange={e => set('shortCode', e.target.value.toUpperCase())}
              placeholder="SG" />
          </Field>
          <Field label="Established Year" required>
            <Inp value={data.estYear} onChange={e => set('estYear', e.target.value)} placeholder="Est. 1952" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Full Institute Name" required>
              <Inp value={data.instituteName} onChange={e => set('instituteName', e.target.value)}
                placeholder="Shri G. S. Institute of Technology & Science" />
            </Field>
          </div>
          <Field label="Short Name" required>
            <Inp value={data.shortName} onChange={e => set('shortName', e.target.value)} placeholder="SGSITS INDORE" />
          </Field>
          <Field label="Tagline" required>
            <Inp value={data.tagline} onChange={e => set('tagline', e.target.value)}
              placeholder="An Institute of National Standing" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Sub-Tagline / Credential Line">
              <Inp value={data.subTagline} onChange={e => set('subTagline', e.target.value)}
                placeholder="Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Footer Description" hint="Short paragraph shown below logo in footer">
              <Txta rows={2} value={data.description} onChange={e => set('description', e.target.value)}
                placeholder="Brief institute description…" />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeading>Logo</CardHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Logo Image URL" hint="Relative path or CDN URL">
            <Inp value={data.logoUrl} onChange={e => set('logoUrl', e.target.value)} placeholder="/assets/image.png" />
          </Field>
          <Field label="Logo Alt Text" required>
            <Inp value={data.logoAlt} onChange={e => set('logoAlt', e.target.value)} placeholder="SGSITS Indore Logo" />
          </Field>
        </div>
        {data.logoUrl && (
          <div className="mt-4 p-3 bg-slate-900 rounded-lg inline-flex items-center gap-3">
            <img src={data.logoUrl} alt={data.logoAlt} className="w-12 h-12 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
            <span className="text-[10px] text-slate-400">Logo preview (dark bg = footer context)</span>
          </div>
        )}
      </Card>

      <BackendNote endpoint="PUT /api/cms/footer/branding" />
    </SectionCard>
  )
}

export default FooterBrandingEditor

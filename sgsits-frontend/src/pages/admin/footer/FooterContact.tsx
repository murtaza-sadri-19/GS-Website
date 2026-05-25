import React from 'react'
import { Phone } from 'lucide-react'
import footerService, { type FooterContact } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, Field, Inp, Txta, Toggle, BackendNote, LoadingSkeleton } from './_shared'

const FooterContactEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterContact>(
    footerService.getContact,
    footerService.saveContact,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  const set = <K extends keyof FooterContact>(key: K, val: FooterContact[K]) =>
    setData(d => d ? { ...d, [key]: val } : d)

  return (
    <SectionCard
      title="Contact Information"
      subtitle="Address, phone, and email displayed in the footer branding column"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<Phone size={15} />}>Contact Details</CardHeading>
        <div className="space-y-4">
          <Toggle
            checked={data.visible}
            onChange={v => set('visible', v)}
            label="Show Contact Info in Footer"
            desc="Toggle the entire contact block in the footer left column"
          />
          <Field label="Address" required>
            <Txta rows={2} value={data.address} onChange={e => set('address', e.target.value)}
              placeholder="23, Park Road, Indore, M.P. - 452003, India" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone Number(s)" required>
              <Inp value={data.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+91-731-2582100, 2582124" />
            </Field>
            <Field label="Email Address" required>
              <Inp type="email" value={data.email} onChange={e => set('email', e.target.value)}
                placeholder="registrar@sgsits.ac.in" />
            </Field>
          </div>
          <Field label="Google Maps Embed URL" hint="Optional — paste the embed src URL from Google Maps">
            <Inp type="url" value={data.mapEmbedUrl} onChange={e => set('mapEmbedUrl', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..." />
          </Field>
        </div>
      </Card>

      <BackendNote endpoint="PUT /api/cms/footer/contact" />
    </SectionCard>
  )
}

export default FooterContactEditor

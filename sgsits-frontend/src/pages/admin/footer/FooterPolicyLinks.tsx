import React from 'react'
import { Scale } from 'lucide-react'
import footerService, { type FooterPolicyLink } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, PolicyLinkListEditor, BackendNote, LoadingSkeleton } from './_shared'

const FooterPolicyLinksEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterPolicyLink[]>(
    footerService.getPolicyLinks,
    footerService.savePolicyLinks,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  return (
    <SectionCard
      title="Policies & Legal Links"
      subtitle="Links shown in the footer bottom strip (Privacy Policy, Disclaimer, etc.)"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<Scale size={15} />}>Policy Link Bar</CardHeading>
        <PolicyLinkListEditor
          links={data}
          onChange={setData as (l: FooterPolicyLink[]) => void}
        />
      </Card>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
        <p className="font-bold text-slate-700 mb-1">💡 Policy Links</p>
        <ul className="space-y-1 list-disc list-inside text-slate-500">
          <li>These appear as a horizontal bar in the footer bottom strip</li>
          <li>All routes must point to existing React Router paths</li>
          <li>Standard links: Privacy Policy, Terms of Use, Disclaimer, Accessibility, Copyright, Hyperlink, Sitemap</li>
          <li>Use eye toggle to hide links without deleting them</li>
        </ul>
      </div>

      <BackendNote endpoint="PUT /api/cms/footer/policy-links" />
    </SectionCard>
  )
}

export default FooterPolicyLinksEditor

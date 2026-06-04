import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Mail, Phone } from 'lucide-react'
import { aboutService, type AdminOfficial } from '../../services/aboutService'
import { getCmsSection } from '../../services/settingsService'
import { SkeletonCard } from '../../components/ui/Skeleton'

interface AdministrationProps {
  previewData?: AdminOfficial[]
}

const Administration: React.FC<AdministrationProps> = ({ previewData }) => {
  const [admins, setAdmins] = useState<AdminOfficial[]>(previewData ?? [])
  const [pageTitle, setPageTitle] = useState<string | null>(null)
  const [pageSubtitle, setPageSubtitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(!previewData)

  useEffect(() => {
    if (previewData) { setAdmins(previewData); return }
    Promise.all([
      aboutService.getAdministration(),
      getCmsSection<Record<string, unknown>>('about.administration_meta'),
    ]).then(([officials, meta]) => {
      setAdmins(officials)
      if (meta && typeof meta.pageTitle === 'string') setPageTitle(meta.pageTitle)
      if (meta && typeof meta.pageSubtitle === 'string') setPageSubtitle(meta.pageSubtitle)
      setLoading(false)
    })
  }, [previewData])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/administration" />
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">
          {pageTitle ?? 'Administration'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {pageSubtitle ?? 'Key administrative positions at SGSITS'}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {admins.map((admin) => (
            <div key={admin.title as string} className="bg-white rounded-md border border-slate-200 p-5 hover:border-slate-400 transition-colors">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-accent">{admin.title as string}</p>
              <h3 className="text-lg font-bold text-primary">{admin.name as string}</h3>
              <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                <p className="flex items-center gap-2"><Mail size={14} className="text-accent" /> {admin.email as string}</p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-accent" /> {admin.phone as string}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Administration

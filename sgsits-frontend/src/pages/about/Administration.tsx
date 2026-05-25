import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Mail, Phone } from 'lucide-react'
import { aboutService, administrationDefault, type AdminOfficial } from '../../services/aboutService'

const Administration: React.FC = () => {
  const [admins, setAdmins] = useState<AdminOfficial[]>(administrationDefault)

  useEffect(() => {
    aboutService.getAdministration().then(setAdmins)
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/administration" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Administration</h2>
        <p className="text-sm text-gray-500 mt-1">Key administrative positions at SGSITS</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {admins.map((admin) => (
          <div key={admin.title} className="bg-white rounded-md border border-gray-200 p-5 hover:border-slate-400 transition-colors">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-accent)' }}>{admin.title}</p>
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>{admin.name}</h3>
            <div className="mt-3 space-y-1.5 text-sm text-gray-600">
              <p className="flex items-center gap-2"><Mail size={14} style={{ color: 'var(--color-accent)' }} /> {admin.email}</p>
              <p className="flex items-center gap-2"><Phone size={14} style={{ color: 'var(--color-accent)' }} /> {admin.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Administration

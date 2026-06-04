import React from 'react'
import PageSeo from '../../components/global/PageSeo'

const SecurityPolicy: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageSeo pageKey="policy/security" />
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Security Policy</h2>
        <p className="text-sm text-slate-500 mt-1">SGSITS Indore — Official Policy</p>
      </div>

      <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
        <p>SGSITS takes appropriate security measures to protect information on this website. The website uses HTTPS/SSL encryption for secure data transmission.</p>
        <p>Unauthorized attempts to upload, change, or damage information on this site are strictly prohibited and may be punishable under the Information Technology Act, 2000.</p>
        <p>Users are advised to use updated browsers and maintain proper security practices while browsing the website.</p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mt-4">
        <p className="text-xs text-slate-500">Last updated: April 2026 | Website: www.sgsits.ac.in</p>
      </div>
    </div>
  )
}

export default SecurityPolicy

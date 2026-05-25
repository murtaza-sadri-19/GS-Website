import React from 'react'
import PageSeo from '../../components/global/PageSeo'

const WebInfoManager: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageSeo pageKey="policy/web-info-manager" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Web Information Manager</h2>
        <p className="text-sm text-gray-500 mt-1">SGSITS Indore — Official Policy</p>
      </div>

      <div className="prose max-w-none text-gray-700 text-[15px] leading-relaxed space-y-4">
        <p><strong>Name:</strong> Prof. A.K. Verma<br/><strong>Designation:</strong> Web Information Manager, SGSITS Indore</p>
        <p><strong>Email:</strong> wadmin@sgsits.ac.in<br/><strong>Phone:</strong> 0731-2582100 (Ext. 120)</p>
        <p>The Web Information Manager is responsible for the content, accuracy, and maintenance of the SGSITS official website. For any queries regarding website content, broken links, or accessibility issues, please contact the above person.</p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mt-4">
        <p className="text-xs text-slate-500">Last updated: April 2026 | Website: www.sgsits.ac.in</p>
      </div>
    </div>
  )
}

export default WebInfoManager

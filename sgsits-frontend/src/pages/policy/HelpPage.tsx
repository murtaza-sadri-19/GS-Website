import React from 'react'
import PageSeo from '../../components/global/PageSeo'

const HelpPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageSeo pageKey="policy/help" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Help</h2>
        <p className="text-sm text-gray-500 mt-1">SGSITS Indore — Official Policy</p>
      </div>

      <div className="prose max-w-none text-gray-700 text-[15px] leading-relaxed space-y-4">
        <p><strong>Navigation:</strong> Use the main navigation menu at the top to browse different sections of the website. On internal pages, use the left sidebar for section-specific navigation.</p>
        <p><strong>Search:</strong> Use the search bar in the top navigation to find specific content across the website.</p>
        <p><strong>Accessibility:</strong> Font size can be adjusted using the A-/A/A+ buttons in the top bar. High contrast mode is available for improved readability.</p>
        <p><strong>Contact:</strong> For technical issues with the website, contact wadmin@sgsits.ac.in. For academic or administrative queries, visit the Contact Us page.</p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mt-4">
        <p className="text-xs text-slate-500">Last updated: April 2026 | Website: www.sgsits.ac.in</p>
      </div>
    </div>
  )
}

export default HelpPage

import React from 'react'
import PageSeo from '../../components/global/PageSeo'

const PlagiarismPolicy: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/plagiarism-policy" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Plagiarism Policy</h2>
        <p className="text-sm text-gray-500 mt-1">Anti-plagiarism policy for academic work</p>
      </div>

      <div className="space-y-4">
      <p className="text-gray-700 text-[15px] leading-relaxed">SGSITS follows a strict anti-plagiarism policy for all academic submissions including dissertations, theses, research papers, and project reports.</p>
      <p className="text-gray-700 text-[15px] leading-relaxed"><strong>Turnitin:</strong> All M.Tech dissertations and Ph.D. theses must be checked through Turnitin before submission. The maximum allowable similarity index is <strong>15%</strong> (excluding references and bibliography).</p>
      <p className="text-gray-700 text-[15px] leading-relaxed"><strong>Levels of Plagiarism:</strong> Level 0 (0-10%): No penalty. Level 1 (10-40%): Revision required. Level 2 (40-60%): Rejected, resubmission allowed after 6 months. Level 3 (&gt;60%): Rejected, disciplinary action initiated.</p>
      </div>
    </div>
  )
}

export default PlagiarismPolicy

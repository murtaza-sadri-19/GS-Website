import React from 'react'
import PageSeo from '../../components/global/PageSeo'

const OBENep2020: React.FC = () => {
  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/obe-nep-2020" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>OBE & NEP 2020</h2>
        <p className="text-sm text-gray-500 mt-1">Outcome-Based Education and National Education Policy implementation</p>
      </div>

      <div className="space-y-4">
      <p className="text-gray-700 text-[15px] leading-relaxed">SGSITS has adopted <strong>Outcome-Based Education (OBE)</strong> framework as per NBA/NAAC guidelines. The curriculum is designed around Program Outcomes (POs), Program Educational Objectives (PEOs), and Course Outcomes (COs).</p>
      <p className="text-gray-700 text-[15px] leading-relaxed"><strong>Program Outcomes (POs):</strong> 12 graduate attributes defined by NBA including Engineering Knowledge, Problem Analysis, Design/Development of Solutions, Conduct Investigations, Modern Tool Usage, Engineer and Society, Environment and Sustainability, Ethics, Individual and Team Work, Communication, Project Management, and Life-long Learning.</p>
      <p className="text-gray-700 text-[15px] leading-relaxed"><strong>NEP 2020 Implementation:</strong> SGSITS is progressively implementing NEP 2020 features including multidisciplinary education, flexible curriculum with electives, research focus from UG level, credit-based system, and multiple entry-exit options.</p>
      <p className="text-gray-700 text-[15px] leading-relaxed"><strong>Continuous Improvement:</strong> Regular feedback from stakeholders (students, alumni, employers, parents) is collected and analyzed for continuous improvement of teaching-learning processes.</p>
      </div>
    </div>
  )
}

export default OBENep2020

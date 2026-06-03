import React from 'react'
import type { DepartmentSummary } from '../../../services/departmentService'

interface ObeTabProps {
  dept: DepartmentSummary
}

const ObeTab: React.FC<ObeTabProps> = ({ dept }) => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200">
      <h2 className="text-xl font-display font-bold text-slate-900">Outcome Based Education (OBE)</h2>
    </div>
    <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans text-justify">
      Adhering to National Board of Accreditation (NBA) standards and the NEP 2020 layout, the department implements a structured Outcome-Based Education model. Program Outcomes (PEOs / POs) and course metrics are continuously tracked to improve technical training.
    </p>
    <div className="space-y-4 pt-4">
      <div className="p-4 bg-slate-50 rounded border border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Departmental Vision</h4>
        <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify font-medium">
          "{dept.vision || `To emerge as a premier center of technical education and research in ${dept.shortName} sciences, creating ethically sound professionals equipped to handle global industrial demands.`}"
        </p>
      </div>
      <div className="p-4 bg-slate-50 rounded border border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Departmental Mission</h4>
        <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify font-medium">
          "{dept.mission || `Providing rich academic environments through advanced labs and Outcome-Based curriculums, fostering collaborative industrial projects, and instilling technical values conducive to social prosperity.`}"
        </p>
      </div>
    </div>
  </div>
)

export default ObeTab

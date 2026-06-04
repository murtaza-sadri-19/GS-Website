import React from 'react'
import { Mail, Phone, Building } from 'lucide-react'
import type { DepartmentSummary } from '../../../services/departmentService'

interface ContactTabProps {
  dept: DepartmentSummary
}

const ContactTab: React.FC<ContactTabProps> = ({ dept }) => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200">
      <h2 className="text-xl font-display font-bold text-slate-900">Administrative Contacts</h2>
    </div>
    <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-6 max-w-xl shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-white border border-slate-200 text-accent-blue rounded">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Academic Office Email</h4>
          <p className="text-xs text-slate-500 mt-1 font-sans font-medium">{dept.hodEmail} (HOD Inquiry Desk)</p>
          <p className="text-xs text-slate-400 mt-0.5 font-sans font-medium">
            office.{dept.slug.replace('-', '')}@sgsits.ac.in (Main Desk)
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-2 bg-white border border-slate-200 text-accent-blue rounded">
          <Phone className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Departmental Extension</h4>
          <p className="text-xs text-slate-500 mt-1 font-sans font-medium">
            {dept.hodPhone || '+91-731-2582100 (Ext. 401)'}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-2 bg-white border border-slate-200 text-accent-blue rounded">
          <Building className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Physical Location</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans font-medium text-justify">
            {dept.location || 'Location not set. Contact the department office for directions.'}
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default ContactTab

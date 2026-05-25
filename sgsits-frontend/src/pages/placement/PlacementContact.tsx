import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Phone, Mail, MapPin, Clock, Building2, User } from 'lucide-react'
import {
  placementService,
  placementContactsDefault,    type PlacementContactPerson,
  placementOfficeInfoDefault,  type PlacementOfficeInfo,
} from '../../services/placementService'

const PlacementContact: React.FC = () => {
  const [contacts, setContacts]   = useState<PlacementContactPerson[]>(placementContactsDefault)
  const [office,   setOffice]     = useState<PlacementOfficeInfo>(placementOfficeInfoDefault)

  useEffect(() => {
    placementService.getPlacementContacts().then(setContacts)
    placementService.getPlacementOfficeInfo().then(setOffice)
  }, [])

  return (
    <div className="space-y-10">
      <PageSeo pageKey="placement/contact" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Placements</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Placement Cell Contacts</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Training & Placement Cell — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          For campus recruitment enquiries, internship tie-ups, or student placement queries, please reach out to the
          Training & Placement Cell at SGSITS Indore. The T&P Cell works closely with companies for campus visits,
          PPTs, interview scheduling, and offer management.
        </p>
      </div>

      {/* Key Contacts */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Key Contacts</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">T&P Cell Personnel</h3>
        <div className="space-y-4">
          {contacts.map((contact, i) => (
            <div
              key={i}
              className={`bg-white border rounded p-5 shadow-sm ${contact.role === 'primary' ? 'border-accent/30 border-l-4 border-l-accent' : 'border-slate-200'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded flex items-center justify-center shrink-0">
                  <User size={22} className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800 text-base">{contact.name}</h4>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mt-0.5">{contact.designation}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{contact.dept}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm font-sans">
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-accent shrink-0" />
                      <span className="text-slate-600">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-accent shrink-0" />
                      <a href={`mailto:${contact.email}`} className="text-accent-blue hover:underline">{contact.email}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Office Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building2 size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Office Location</h4>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-600 font-sans">
            <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
            <span>{office.address}</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Clock size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Office Hours</h4>
          </div>
          <div className="text-sm space-y-2 font-sans text-slate-600">
            <div className="flex justify-between">
              <span>Monday – Friday</span>
              <span className="font-semibold">{office.mondayFridayHours}</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span className="font-semibold">{office.saturdayHours}</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday & Holidays</span>
              <span className="font-semibold text-[#0b2545]">{office.sundayStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* For Recruiters */}
      <div className="bg-primary text-white rounded p-5">
        <h4 className="font-bold font-display text-base mb-2">Information for Recruiting Companies</h4>
        <p className="text-sm text-slate-300 font-sans leading-relaxed mb-3">
          Organizations wishing to participate in campus placements at SGSITS should:
        </p>
        <ol className="text-sm text-slate-200 space-y-1 font-sans">
          {contacts[0] && (
            <li>1. Email the Job Description (JD) and package details to <a href={`mailto:${contacts[0].email}`} className="text-accent hover:underline">{contacts[0].email}</a></li>
          )}
          <li>2. Confirm preferred dates for PPT and recruitment drive</li>
          <li>3. Campus visits can be arranged for company representatives</li>
          <li>4. Virtual recruitment drives are also supported</li>
        </ol>
      </div>
    </div>
  )
}

export default PlacementContact

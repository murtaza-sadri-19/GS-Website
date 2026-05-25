import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import {
  MapPin, Phone, Mail, Building2, Library, Cpu, Home, Users, Dumbbell, Navigation, Bus, Train, Plane, Shield
} from 'lucide-react'

const campusLocations = [
  {
    icon: Building2,
    name: 'Main Academic Building',
    desc: 'The iconic heritage building housing the Director\'s office, administrative block, and key departments. Built in 1952, it stands as a symbol of SGSITS legacy.',
    color: 'text-[#0b2545] bg-[#0b2545]/5 border-[#0b2545]/15',
  },
  {
    icon: Library,
    name: 'Central Library',
    desc: 'Fully air-conditioned library with 80,000+ volumes, 200+ journals, DELNET access, e-library terminals, and dedicated reading zones for 500+ students.',
    color: 'text-[#bfa15f] bg-[#bfa15f]/10 border-[#bfa15f]/20',
  },
  {
    icon: Cpu,
    name: 'Computer Center',
    desc: 'Central computing facility with 300+ workstations, high-speed fiber internet, server cluster, software licensing for MATLAB, AutoCAD, ANSYS, and more.',
    color: 'text-[#0b2545] bg-[#0b2545]/10 border-[#0b2545]/25',
  },
  {
    icon: Home,
    name: 'Boys Hostels',
    desc: '5 hostel blocks accommodating 1,200+ students with furnished rooms, 24×7 water & power supply, Wi-Fi, study rooms, and a well-equipped mess.',
    color: 'text-[#bfa15f] bg-[#bfa15f]/5 border-[#bfa15f]/15',
  },
  {
    icon: Users,
    name: 'Girls Hostel',
    desc: 'Secure residential facility for 400+ girl students with modern amenities, in-house mess, common rooms, and dedicated 24×7 security personnel.',
    color: 'text-[#0b2545] bg-[#0b2545]/15 border-[#0b2545]/30',
  },
  {
    icon: Dumbbell,
    name: 'Sports Complex',
    desc: 'Multi-sport complex featuring cricket ground, basketball & volleyball courts, badminton hall, table tennis, athletics track, and an indoor gymnasium.',
    color: 'text-[#bfa15f] bg-[#bfa15f]/15 border-[#bfa15f]/30',
  },
]

const contactInfo = [
  { icon: Shield, label: 'Security Gate', value: '+91-731-2431000', type: 'phone' },
  { icon: Phone, label: 'Reception / EPABX', value: '+91-731-2431234', type: 'phone' },
  { icon: Mail, label: 'General Enquiry', value: 'info@sgsits.ac.in', type: 'email' },
  { icon: MapPin, label: 'Address', value: '23, Park Road, Indore — 452003, M.P.', type: 'text' },
]

const howToReach = [
  {
    icon: Plane,
    title: 'By Air',
    detail: 'Devi Ahilya Bai Holkar Airport, Indore',
    distance: '12 km from campus',
    tip: 'Take a cab or prepaid taxi from the airport (approx. ₹250–400). Journey time: 25–35 mins.',
  },
  {
    icon: Train,
    title: 'By Rail',
    detail: 'Indore Junction Railway Station',
    distance: '3 km from campus',
    tip: 'Auto-rickshaws and city buses are readily available. Journey time: 10–15 mins.',
  },
  {
    icon: Bus,
    title: 'By Road',
    detail: 'ISBT Gangwal Bus Stand',
    distance: '2 km from campus',
    tip: 'Well-connected via NH-3 and NH-59. City buses from Gangwal stand reach campus in 5 mins.',
  },
  {
    icon: Navigation,
    title: 'Using Navigation',
    detail: 'Search "SGSITS Indore" on Google Maps',
    distance: 'Park Road, Indore',
    tip: 'Enter from Park Road main gate. The red-and-white building is the iconic Main Block.',
  },
]

const CampusMapPage: React.FC = () => {
  return (
    <div className="space-y-10">
      <PageSeo pageKey="explore/campus-map" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1.5">Explore SGSITS</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Campus Map & Location</h2>
        <div className="w-16 h-0.5 bg-accent mt-2 mb-3" />
        <p className="text-sm text-slate-500 font-sans font-medium">
          SGSITS is located at 23, Park Road, Indore — easily accessible from all parts of the city and well-connected to major transport hubs.
        </p>
      </div>

      {/* Embedded Google Map */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
        <div className="bg-primary/5 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
          <MapPin size={15} className="text-accent" />
          <span className="text-xs font-bold text-primary">SGSITS Indore — 23, Park Road, Indore 452003</span>
          <a
            href="https://maps.google.com/?q=SGSITS+Indore"
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-[11px] font-bold text-accent-blue hover:text-primary transition-colors flex items-center gap-1"
          >
            Open in Maps ↗
          </a>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.9!2d75.8577!3d22.7196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd17e4f3b947!2sSGSITS!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="400"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SGSITS Campus Map"
        />
      </div>

      {/* Campus Locations Grid */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Campus Guide</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Key Buildings & Facilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {campusLocations.map((loc) => {
            const Icon = loc.icon
            return (
              <div
                key={loc.name}
                className={`rounded-xl border p-5 hover:shadow-md transition-all duration-200 ${loc.color}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Icon size={18} className={loc.color.split(' ')[0]} />
                  </div>
                  <h4 className="font-display font-bold text-primary text-sm leading-snug">{loc.name}</h4>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">{loc.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* How to Reach */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Directions</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">How to Reach SGSITS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {howToReach.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-accent/30 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">{item.title}</h4>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-wider">{item.distance}</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-700 mb-1.5">{item.detail}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">{item.tip}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Contact</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Security & Reception</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contactInfo.map((info) => {
            const Icon = info.icon
            return (
              <div key={info.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4 hover:border-accent/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{info.label}</p>
                  {info.type === 'phone' ? (
                    <a href={`tel:${info.value}`} className="text-sm font-bold text-primary hover:text-accent transition-colors">{info.value}</a>
                  ) : info.type === 'email' ? (
                    <a href={`mailto:${info.value}`} className="text-sm font-bold text-accent-blue hover:underline">{info.value}</a>
                  ) : (
                    <p className="text-sm font-medium text-slate-700">{info.value}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Campus Facts Strip */}
      <div className="bg-primary rounded-2xl p-6">
        <h4 className="text-white font-display font-bold text-base mb-4">SGSITS Campus at a Glance</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '52 Acres', label: 'Campus Area' },
            { value: '1952', label: 'Year Founded' },
            { value: '15+', label: 'Academic Blocks' },
            { value: '7', label: 'Hostel Blocks' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-display font-bold text-accent">{s.value}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CampusMapPage

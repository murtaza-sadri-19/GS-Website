import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { useGatedLoading } from '../../hooks/useGatedLoading'
import {
  MapPin, Phone, Mail, Building2, Library, Cpu, Home, Users, Dumbbell,
  Navigation, Bus, Train, Plane, Shield
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getCmsSection } from '../../services/settingsService'
import { Sk } from '../../components/ui/Skeleton'

interface CampusBuilding {
  name: string
  description: string
  specs?: string
}

interface CampusFact {
  label: string
  value: string
}

interface CampusMapData {
  address: string
  phone: string
  altPhone?: string
  email: string
  mapsLink: string
  mapsEmbed: string
  campusFacts: CampusFact[]
  buildings: CampusBuilding[]
}

const BUILDING_ICONS: LucideIcon[] = [Building2, Library, Cpu, Home, Users, Dumbbell]

const BUILDING_COLORS = [
  'text-primary bg-primary/5 border-primary/15',
  'text-accent bg-accent/10 border-accent/20',
  'text-primary bg-primary/10 border-primary/25',
  'text-accent bg-accent/5 border-accent/15',
  'text-primary bg-primary/15 border-primary/30',
  'text-accent bg-accent/15 border-accent/30',
]

const HOW_TO_REACH = [
  { icon: Plane, title: 'By Air', detail: 'Devi Ahilya Bai Holkar Airport, Indore', distance: '12 km from campus', tip: 'Take a cab or prepaid taxi from the airport (approx. ₹250–400). Journey time: 25–35 mins.' },
  { icon: Train, title: 'By Rail', detail: 'Indore Junction Railway Station', distance: '3 km from campus', tip: 'Auto-rickshaws and city buses are readily available. Journey time: 10–15 mins.' },
  { icon: Bus,   title: 'By Road', detail: 'ISBT Gangwal Bus Stand', distance: '2 km from campus', tip: 'Well-connected via NH-3 and NH-59. City buses from Gangwal stand reach campus in 5 mins.' },
  { icon: Navigation, title: 'Using Navigation', detail: 'Search "SGSITS Indore" on Google Maps', distance: 'Park Road, Indore', tip: 'Enter from Park Road main gate. The red-and-white building is the iconic Main Block.' },
]

const DEFAULT_DATA: CampusMapData = {
  address: '23, Park Road, Indore — 452003, M.P.',
  phone: '+91-731-2431000',
  altPhone: '+91-731-2431234',
  email: 'info@sgsits.ac.in',
  mapsLink: 'https://maps.google.com/?q=SGSITS+Indore',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.9!2d75.8577!3d22.7196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd17e4f3b947!2sSGSITS!5e0!3m2!1sen!2sin!4v1',
  campusFacts: [
    { label: 'Campus Area', value: '52 Acres' },
    { label: 'Year Founded', value: '1952' },
    { label: 'Academic Blocks', value: '15+' },
    { label: 'Hostel Blocks', value: '7' },
  ],
  buildings: [
    { name: 'Main Academic Building', description: 'The iconic heritage building housing the Director\'s office, administrative block, and key departments.', specs: 'Built 1952' },
    { name: 'Central Library', description: 'Fully air-conditioned library with 80,000+ volumes, 200+ journals, DELNET access, and e-library terminals.', specs: '80,000+ books' },
    { name: 'Computer Center', description: 'Central computing facility with 300+ workstations, high-speed fiber internet, and software licensing for MATLAB, AutoCAD.', specs: '300+ workstations' },
    { name: 'Boys Hostels', description: '5 hostel blocks accommodating 1,200+ students with furnished rooms, 24×7 water & power supply, and Wi-Fi.', specs: '1,200+ students' },
    { name: 'Girls Hostel', description: 'Secure residential facility for 400+ girl students with modern amenities, in-house mess, and dedicated security.', specs: '400+ students' },
    { name: 'Sports Complex', description: 'Multi-sport complex featuring cricket ground, basketball & volleyball courts, badminton hall, and indoor gymnasium.', specs: '5 Acres' },
  ],
}

const CampusMapPage: React.FC = () => {
  const [loading, setLoading] = useGatedLoading()
  const [data, setData]       = useState<CampusMapData>(DEFAULT_DATA)

  useEffect(() => {
    getCmsSection<CampusMapData>('campus.map').then((d) => {
      if (d && d.address) setData(d)
      setLoading(false)
    })
  }, [])

  const contactItems = [
    { icon: Shield, label: 'Security Gate',    value: data.phone,    type: 'phone' as const },
    { icon: Phone,  label: 'Reception / EPABX',value: data.altPhone ?? '+91-731-2431234', type: 'phone' as const },
    { icon: Mail,   label: 'General Enquiry',  value: data.email,    type: 'email' as const },
    { icon: MapPin, label: 'Address',          value: data.address,  type: 'text' as const },
  ]

  return (
    <div className="space-y-10">
      <PageSeo pageKey="explore/campus-map" />

      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1.5">Explore SGSITS</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Campus Map & Location</h2>
        <div className="w-16 h-0.5 bg-accent mt-2 mb-3" />
        <p className="text-sm text-slate-500 font-sans font-medium">
          SGSITS is located at {data.address} — easily accessible from all parts of the city.
        </p>
      </div>

      {/* Embedded Google Map */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
        <div className="bg-primary/5 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
          <MapPin size={15} className="text-accent" />
          <span className="text-xs font-bold text-primary">SGSITS Indore — {data.address}</span>
          <a
            href={data.mapsLink}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-xs font-bold text-accent hover:text-primary transition-colors flex items-center gap-1"
          >
            Open in Maps ↗
          </a>
        </div>
        <iframe
          src={data.mapsEmbed}
          width="100%"
          height="400"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SGSITS Campus Map"
        />
      </div>

      {/* Key Buildings */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Campus Guide</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Key Buildings & Facilities</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Sk className="w-10 h-10 rounded-lg" />
                  <Sk className="h-4 w-36 rounded" />
                </div>
                <Sk className="h-3 w-full rounded mb-1" />
                <Sk className="h-3 w-4/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.buildings.map((loc, idx) => {
              const Icon = BUILDING_ICONS[idx % BUILDING_ICONS.length]
              const colorClass = BUILDING_COLORS[idx % BUILDING_COLORS.length]
              return (
                <div key={loc.name} className={`rounded-xl border p-5 hover:shadow-md transition-all duration-200 ${colorClass}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <Icon size={18} className={colorClass.split(' ')[0]} />
                    </div>
                    <h4 className="font-display font-bold text-primary text-sm leading-snug">{loc.name}</h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">{loc.description}</p>
                  {loc.specs && <p className="text-xs font-bold text-accent mt-2">{loc.specs}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* How to Reach */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Directions</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">How to Reach SGSITS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HOW_TO_REACH.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-accent/30 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm">{item.title}</h4>
                    <p className="text-xs text-accent font-bold uppercase tracking-wider">{item.distance}</p>
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
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Contact</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Security & Reception</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
                <Sk className="w-10 h-10 rounded-xl" />
                <div>
                  <Sk className="h-3 w-24 rounded mb-2" />
                  <Sk className="h-4 w-36 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contactItems.map((info) => {
              const Icon = info.icon
              return (
                <div key={info.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-4 hover:border-accent/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{info.label}</p>
                    {info.type === 'phone' ? (
                      <a href={`tel:${info.value}`} className="text-sm font-bold text-primary hover:text-accent transition-colors">{info.value}</a>
                    ) : info.type === 'email' ? (
                      <a href={`mailto:${info.value}`} className="text-sm font-bold text-accent hover:underline">{info.value}</a>
                    ) : (
                      <p className="text-sm font-medium text-slate-700">{info.value}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Campus Facts Strip */}
      <div className="bg-primary rounded-2xl p-6">
        <h4 className="text-white font-display font-bold text-base mb-4">SGSITS Campus at a Glance</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(data.campusFacts.length > 0 ? data.campusFacts : DEFAULT_DATA.campusFacts).map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-display font-bold text-accent">{s.value}</p>
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CampusMapPage

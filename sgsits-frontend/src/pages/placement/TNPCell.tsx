import React, { useState, useEffect } from 'react'
import {
  Briefcase, Award, TrendingUp, Building2, CheckCircle2, ArrowRight,
  Phone, Mail, Users, Star
} from 'lucide-react'
import {
  placementService,
  placementRecordsDefault, type PlacementRecord,
  tnpTeamDefault,          type TNPTeamMember,
  placementProcessDefault, type PlacementProcessStep,
  trainingProgramsDefault,
  recruitingPartnersDefault,
  tnpCellInfoDefault,      type TNPCellInfo,
} from '../../services/placementService'
import PageSeo from '../../components/global/PageSeo'

const TNPCell: React.FC = () => {
  const [records,    setRecords]    = useState<PlacementRecord[]>(placementRecordsDefault)
  const [team,       setTeam]       = useState<TNPTeamMember[]>(tnpTeamDefault)
  const [process,    setProcess]    = useState<PlacementProcessStep[]>(placementProcessDefault)
  const [training,   setTraining]   = useState<string[]>(trainingProgramsDefault)
  const [partners,   setPartners]   = useState<string[]>(recruitingPartnersDefault)
  const [cellInfo,   setCellInfo]   = useState<TNPCellInfo>(tnpCellInfoDefault)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  useEffect(() => {
    placementService.getPlacementRecords().then(setRecords)
    placementService.getTNPTeam().then(setTeam)
    placementService.getPlacementProcess().then(setProcess)
    placementService.getTrainingPrograms().then(setTraining)
    placementService.getRecruitingPartners().then(setPartners)
    placementService.getTNPCellInfo().then(setCellInfo)
  }, [])

  const latest = records[0]

  return (
    <div className="space-y-10">
      <PageSeo pageKey="placement/tnp-cell" />
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1.5">Placements</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Training & Placement Cell</h2>
        <div className="w-16 h-0.5 bg-accent mt-2 mb-3" />
        <p className="text-sm text-slate-500 font-medium font-sans">Career Development & Campus Recruitment — SGSITS Indore</p>
      </div>

      {/* Stats Banner */}
      {latest && (
        <div className="bg-primary rounded-2xl p-6 text-white">
          <p className="text-[10px] uppercase tracking-widest font-bold text-accent/80 mb-3">Placement Statistics {latest.year}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: Users,    value: `${latest.studentsPlaced}+`, label: 'Students Placed' },
              { icon: Building2, value: `${latest.companies}+`,    label: 'Companies Visited' },
              { icon: Award,    value: latest.highestPackage,       label: 'Highest Package' },
              { icon: TrendingUp, value: latest.averagePackage,     label: 'Average Package' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold mt-1">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* About T&P Cell */}
      <div className="border-l-4 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{cellInfo.aboutText}</p>
      </div>

      {/* T&P Team */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Our Team</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Placement Cell Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <div key={i} className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all ${i === 0 ? 'border-accent/40 ring-1 ring-accent/20' : 'border-slate-200'}`}>
              {i === 0 && (
                <div className="flex items-center gap-1 mb-3">
                  <Star size={11} className="text-accent fill-accent" />
                  <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Lead</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{member.name}</h4>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-wider mt-0.5">{member.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{member.exp} experience</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mb-3 font-sans">{member.dept}</p>
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone size={11} className="text-accent shrink-0" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Mail size={11} className="text-accent shrink-0" />
                  <a href={`mailto:${member.email}`} className="text-accent-blue hover:underline truncate">{member.email}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placement Process */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Process</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Campus Recruitment Process</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {process.map((step, i) => (
            <div
              key={step.num}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
                activeStep === i
                  ? 'border-accent/40 bg-[#bfa15f]/10 shadow-md'
                  : 'bg-white border-slate-200 hover:border-accent/30 shadow-sm hover:shadow-md'
              }`}
            >
              <span className="text-4xl font-display font-black text-accent/20 block">{step.num}</span>
              <h4 className="text-sm font-bold text-primary mt-2 mb-1.5">{step.title}</h4>
              <p className="text-[12px] text-slate-500 leading-relaxed font-medium font-sans">{step.desc}</p>
              {activeStep === i && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-1 text-[10px] text-accent font-bold">
                    <CheckCircle2 size={11} /> Step {step.num} of {String(process.length).padStart(2, '0')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Training Programs */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Training</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Year-Round Training Programs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {training.map((prog) => (
            <div key={prog} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-3.5 text-sm hover:border-accent/30 hover:bg-[#bfa15f]/5 transition-all">
              <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{prog}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Partners</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Our Recruiting Partners</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {partners.map((company) => (
            <div
              key={company}
              className="bg-white border border-slate-200 rounded-xl px-2 py-3 text-center hover:border-accent/40 hover:bg-[#bfa15f]/5 hover:shadow-sm transition-all cursor-pointer"
            >
              <p className="text-[11px] font-bold text-primary font-sans leading-tight">{company}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-primary text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Briefcase size={18} className="text-accent" />
            <h4 className="font-bold font-display text-base">{cellInfo.ctaLabel}</h4>
          </div>
          <p className="text-sm text-slate-300 font-sans">We welcome companies from all sectors for on-campus and virtual recruitment drives.</p>
          <div className="flex flex-wrap gap-5 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-accent" />
              <span>{cellInfo.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-accent" />
              <a href={`mailto:${cellInfo.email}`} className="hover:underline">{cellInfo.email}</a>
            </div>
          </div>
        </div>
        <a
          href={`mailto:${cellInfo.ctaEmail}`}
          className="inline-flex items-center gap-2 bg-accent text-primary px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-accent/90 transition-colors shrink-0"
        >
          Contact T&P Cell <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

export default TNPCell

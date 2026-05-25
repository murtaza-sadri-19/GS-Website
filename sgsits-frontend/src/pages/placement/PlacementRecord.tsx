import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Award, TrendingUp, Building2, Users, BarChart2, Briefcase, ChevronRight } from 'lucide-react'
import {
  placementService,
  placementRecordsDefault, type PlacementRecord,
  deptPlacementDefault,    type DeptPlacementStat,
} from '../../services/placementService'

const PlacementRecordPage: React.FC = () => {
  const [records,  setRecords]  = useState<PlacementRecord[]>(placementRecordsDefault)
  const [deptData, setDeptData] = useState<DeptPlacementStat[]>(deptPlacementDefault)

  useEffect(() => {
    placementService.getPlacementRecords().then(setRecords)
    placementService.getDeptPlacement().then(setDeptData)
  }, [])

  const latest    = records[0]
  const maxPlaced = records.length > 0 ? Math.max(...records.map(r => r.studentsPlaced)) : 1

  return (
    <div className="space-y-10">
      <PageSeo pageKey="placement/records" />
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1.5">Placements</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Placement Records</h2>
        <div className="w-16 h-0.5 bg-accent mt-2 mb-3" />
        <p className="text-sm text-slate-500 font-medium font-sans">
          Year-wise institutional placement statistics and recruitment achievements — SGSITS Indore
        </p>
      </div>

      {/* Big Stats — Latest Year */}
      {latest && (
        <div className="bg-primary rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-accent/80">Latest — {latest.year}</p>
              <h3 className="font-display font-bold text-xl text-white mt-1">Placement Highlights</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Briefcase size={22} className="text-accent" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { icon: Users,     value: `${latest.studentsPlaced}+`, label: 'Students Placed' },
              { icon: Building2, value: `${latest.companies}+`,      label: 'Companies' },
              { icon: Award,     value: latest.highestPackage,        label: 'Highest Package' },
              { icon: TrendingUp, value: latest.averagePackage,       label: 'Average Package' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <p className="text-2xl font-display font-black text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold mt-1">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Year-wise Table */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Analytics</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Year-Wise Placement Data</h3>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-5 py-4 font-bold text-xs uppercase tracking-wider">Academic Year</th>
                  <th className="text-center px-5 py-4 font-bold text-xs uppercase tracking-wider">Students Placed</th>
                  <th className="text-center px-5 py-4 font-bold text-xs uppercase tracking-wider">Companies</th>
                  <th className="text-center px-5 py-4 font-bold text-xs uppercase tracking-wider">Highest Pkg</th>
                  <th className="text-center px-5 py-4 font-bold text-xs uppercase tracking-wider">Average Pkg</th>
                  <th className="text-left px-5 py-4 font-bold text-xs uppercase tracking-wider">Top Recruiters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, idx) => (
                  <tr key={r.year} className={`hover:bg-[#bfa15f]/5 transition-colors ${idx === 0 ? 'bg-[#bfa15f]/10' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-primary">{r.year}</span>
                        {idx === 0 && (
                          <span className="text-[9px] bg-accent text-primary font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Latest</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-black text-slate-800 font-display">{r.studentsPlaced.toLocaleString()}</td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">{r.companies}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-black text-accent font-display">{r.highestPackage}</span>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-slate-700">{r.averagePackage}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {r.topRecruiters.slice(0, 3).map(company => (
                          <span key={company} className="text-[9px] bg-primary/5 text-primary font-bold px-1.5 py-0.5 rounded-full">
                            {company}
                          </span>
                        ))}
                        {r.topRecruiters.length > 3 && (
                          <span className="text-[9px] text-slate-400 font-medium">+{r.topRecruiters.length - 3} more</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CSS Bar Chart */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart2 size={16} className="text-accent" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Visualization</span>
        </div>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Students Placed — Year-Over-Year</h3>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-end gap-3 h-48 mb-3">
            {records.slice().reverse().map((r, i) => {
              const pct = Math.round((r.studentsPlaced / maxPlaced) * 100)
              return (
                <div key={r.year} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold">{r.studentsPlaced}</span>
                  <div className="w-full relative" style={{ height: '80%' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${
                        i === records.length - 1 ? 'bg-accent' : 'bg-primary/70 hover:bg-primary'
                      }`}
                      style={{ height: `${pct}%`, position: 'absolute', bottom: 0 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-3 border-t border-slate-100 pt-3">
            {records.slice().reverse().map((r) => (
              <div key={r.year} className="flex-1 text-center">
                <p className="text-[9px] text-slate-500 font-bold">{r.year}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary/70" />
              <span className="text-[10px] text-slate-500 font-medium">Previous Years</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-accent" />
              <span className="text-[10px] text-slate-500 font-medium">Latest Year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department-wise Table */}
      {latest && (
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Department-wise</span>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Branch-wise Placement Rate ({latest.year})</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Placed</th>
                  <th className="text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Rate</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                  <th className="text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Pkg</th>
                  <th className="text-center px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Highest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptData.map((d) => {
                  const rate = Math.round((d.placed / d.total) * 100)
                  return (
                    <tr key={d.dept} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-800 text-xs font-sans">{d.dept}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="text-xs font-bold text-slate-700">{d.placed}/{d.total}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-xs font-black ${rate >= 90 ? 'text-[#bfa15f]' : rate >= 80 ? 'text-[#0b2545]' : 'text-slate-600'}`}>
                          {rate}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${rate >= 90 ? 'bg-[#bfa15f]' : rate >= 80 ? 'bg-[#0b2545]' : 'bg-slate-400'}`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center text-xs font-bold text-slate-700">{d.avg}</td>
                      <td className="px-5 py-3.5 text-center text-xs font-bold text-accent">{d.highest}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Briefcase size={20} className="text-accent shrink-0" />
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            Our exceptional student training framework ensures placements in top-tier multinational companies including
            <strong> Amazon, Microsoft, TCS, Infosys, Cognizant, Wipro</strong>, and high-impact deep-tech startups.
          </p>
        </div>
        <a
          href="/placement/companies"
          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-primary transition-colors"
        >
          View All Companies <ChevronRight size={13} />
        </a>
      </div>
    </div>
  )
}

export default PlacementRecordPage

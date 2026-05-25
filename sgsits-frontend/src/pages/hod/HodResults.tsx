import React, { useEffect, useMemo, useState } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { useAdminStore } from '../../store/adminStore'
import { getDeptResultSummary, type DeptResultSummary } from '../../services/hodService'
import { BarChart3, TrendingUp, Trophy, Users, Download } from 'lucide-react'

const HodResults: React.FC = () => {
  const { user } = useAdminStore()
  const [results, setResults] = useState<DeptResultSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [sem, setSem] = useState<'all' | number>('all')
  const [section, setSection] = useState<'all' | string>('all')

  useEffect(() => {
    let alive = true
    setLoading(true)
    getDeptResultSummary(user?.department_id).then(data => {
      if (alive) { setResults(data); setLoading(false) }
    }).catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [user?.department_id])

  const visible = useMemo(() => results.filter(r => {
    if (sem !== 'all' && r.semester !== sem) return false
    if (section !== 'all' && r.section !== section) return false
    return true
  }), [results, sem, section])

  const overall = useMemo(() => {
    const totalStudents = visible.reduce((s, r) => s + r.totalStudents, 0)
    const totalPassed   = visible.reduce((s, r) => s + r.passed, 0)
    const totalFailed   = visible.reduce((s, r) => s + r.failed, 0)
    const avgPass       = visible.length > 0
      ? (visible.reduce((s, r) => s + r.passPct, 0) / visible.length).toFixed(1)
      : '0'
    return { totalStudents, totalPassed, totalFailed, avgPass }
  }, [visible])

  const topper = useMemo(() => {
    return visible.reduce<{ name: string; sgpa: number; sem: number; section: string } | null>((best, r) => {
      if (!best || r.topper.sgpa > best.sgpa) return { ...r.topper, sem: r.semester, section: r.section }
      return best
    }, null)
  }, [visible])

  const exportCsv = () => {
    const head = 'Branch,Semester,Section,Total Students,Passed,Failed,Pass %,Topper,Topper SGPA\n'
    const body = visible.map(r =>
      [r.branch_id, r.semester, r.section, r.totalStudents, r.passed, r.failed, r.passPct, r.topper.name, r.topper.sgpa].join(',')
    ).join('\n')
    const blob = new Blob([head + body], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `results-summary-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Result Summary"
        subtitle="Branch-wide pass / fail summary and toppers"
        action={
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors">
            <Download size={13} /> Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Students"   icon={Users}      value={overall.totalStudents} accent="bg-[#0b2545]/10 text-[#0b2545]" />
        <Stat label="Passed"     icon={TrendingUp}  value={overall.totalPassed}   accent="bg-[#bfa15f]/10 text-[#bfa15f]" />
        <Stat label="Failed"     icon={BarChart3}   value={overall.totalFailed}   accent="bg-[#0b2545]/10 text-[#0b2545]" />
        <Stat label="Avg Pass %" icon={TrendingUp}  value={`${overall.avgPass}%`} accent="bg-[#bfa15f]/15 text-[#bfa15f]" />
      </div>

      {topper && (
        <PortalCard className="!p-4 !bg-gradient-to-r !from-[#0b2545] !to-[#0b2545]/85 !border-[#bfa15f]/40">
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 rounded-full bg-[#bfa15f] flex items-center justify-center shrink-0">
              <Trophy size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-widest">Branch Topper</p>
              <h3 className="text-lg font-bold">{topper.name}</h3>
              <p className="text-xs text-white/70">Sem {topper.sem} · Section {topper.section} · SGPA {topper.sgpa}</p>
            </div>
          </div>
        </PortalCard>
      )}

      <PortalCard className="!p-3">
        <div className="flex gap-2.5">
          <select
            value={String(sem)}
            onChange={(e) => setSem(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </PortalCard>

      {loading ? (
        <PortalCard><p className="text-center text-sm text-slate-400 py-12">Loading result summary…</p></PortalCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.length === 0
            ? <PortalCard className="col-span-full"><p className="text-center text-sm text-slate-400 py-12">No results match the filters.</p></PortalCard>
            : visible.map(r => {
                const pctW = r.totalStudents > 0 ? Math.round((r.passed / r.totalStudents) * 100) : 0
                return (
                  <PortalCard key={`${r.semester}-${r.section}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Semester {r.semester} · Section {r.section}</h4>
                        <p className="text-[11px] text-slate-500">{r.totalStudents} students</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#bfa15f]">{r.passPct}%</p>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pass</p>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#bfa15f] to-[#bfa15f]/70" style={{ width: `${pctW}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                      <span><strong className="text-[#bfa15f]">{r.passed}</strong> passed</span>
                      <span><strong className="text-[#0b2545]">{r.failed}</strong> failed</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
                      <div className="flex items-center gap-2">
                        <Trophy size={13} className="text-[#bfa15f]" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 truncate">{r.topper.name}</p>
                          <p className="text-[10px] text-slate-500">Section topper · SGPA {r.topper.sgpa}</p>
                        </div>
                      </div>
                    </div>
                  </PortalCard>
                )
              })
          }
        </div>
      )}
    </div>
  )
}

const Stat: React.FC<{
  label: string; value: number | string
  icon: React.ComponentType<{ size?: number; className?: string }>
  accent: string
}> = ({ label, value, icon: Icon, accent }) => (
  <PortalCard className="!p-4">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${accent}`}><Icon size={14} /></div>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">{label}</p>
  </PortalCard>
)

export default HodResults

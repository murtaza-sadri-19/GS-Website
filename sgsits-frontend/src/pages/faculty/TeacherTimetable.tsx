import React, { useState, useEffect, useMemo } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { Calendar, Clock, MapPin, BookOpen, AlertCircle, Loader2 } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import apiClient from '../../api/client'
import { TIMETABLE_PERIODS, TIMETABLE_DAYS, type TimetableDay } from '../../services/hodService'

// localStorage used only as a fast cache; backend is the source of truth
const PERIODS_CACHE_KEY = 'sgsits_timetable_periods'
const BREAKS_CACHE_KEY  = 'sgsits_timetable_breaks'

interface SlotEntry {
  day:         TimetableDay
  periodIdx:   number
  subjectId:   string
  subjectName: string
  room:        string
  semester:    number
  section:     string
}

const DAYS_FULL: Record<TimetableDay, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday',
}

function typeLabel(name: string): 'Theory' | 'Practical' | 'Tutorial' {
  const n = name.toLowerCase()
  if (n.includes('lab') || n.includes('practical')) return 'Practical'
  if (n.includes('tutorial')) return 'Tutorial'
  return 'Theory'
}

function parseStartMinutes(label: string): number {
  const m = label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!m) return Infinity
  let h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  const ampm = m[3]?.toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h * 60 + min
}

const TeacherTimetable: React.FC = () => {
  const { user } = useAdminStore()
  const teacherUserId = user?.id ? Number(user.id) : null
  const deptId        = user?.department_id ? Number(user.department_id) : null

  // Seed from localStorage cache first (fast); backend fetch overwrites on load
  const [periods, setPeriods] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem(PERIODS_CACHE_KEY)
      return cached ? (JSON.parse(cached) as string[]) : TIMETABLE_PERIODS
    } catch { return TIMETABLE_PERIODS }
  })

  const [breakSet, setBreakSet] = useState<Set<number>>(() => {
    try {
      const cached = localStorage.getItem(BREAKS_CACHE_KEY)
      return new Set<number>(cached ? (JSON.parse(cached) as number[]) : [])
    } catch { return new Set() }
  })

  const [slots,     setSlots]     = useState<SlotEntry[]>([])
  const [loading,   setLoading]   = useState(true)
  const [activeSem, setActiveSem] = useState<number | null>(null)
  const [activeDay, setActiveDay] = useState<TimetableDay>('Mon')

  // Fetch authoritative periods config from backend (also fixes legacy out-of-order data)
  useEffect(() => {
    if (!deptId) return
    let alive = true
    apiClient.get(`/v1/timetables/periods/${deptId}`)
      .then(res => {
        if (!alive) return
        const { periods: p, breaks: b } = res.data?.data ?? {}
        if (Array.isArray(p) && p.length > 0) {
          const sorted = [...p].sort((a, b) => parseStartMinutes(a) - parseStartMinutes(b))
          const breakArr: number[] = Array.isArray(b) ? b : []
          const origToNew = new Map(p.map((lbl, oi) => [oi, sorted.indexOf(lbl)]))
          const sortedBreaks = new Set(breakArr.map(bi => origToNew.get(bi) ?? bi).filter(i => i >= 0))
          setPeriods(sorted)
          setBreakSet(sortedBreaks)
          localStorage.setItem(PERIODS_CACHE_KEY, JSON.stringify(sorted))
          localStorage.setItem(BREAKS_CACHE_KEY,  JSON.stringify([...sortedBreaks]))
        }
      })
      .catch(() => { /* keep cached value */ })
    return () => { alive = false }
  }, [deptId])

  useEffect(() => {
    if (!deptId || !teacherUserId) { setLoading(false); return }

    const load = async () => {
      try {
        const listRes = await apiClient.get('/v1/timetables', {
          params: { department_id: deptId, pageSize: 50 },
        })
        const timetables: Record<string, unknown>[] = listRes.data?.data ?? []

        const allSlots: SlotEntry[] = []

        await Promise.all(
          timetables.map(async (tt) => {
            const ttId     = Number(tt.id)
            const title    = String(tt.title || '')
            const semMatch = title.match(/Sem\s+(\d+)/i)
            const secMatch = title.match(/Sec\s+([A-Z])/i)
            const semester = semMatch ? Number(semMatch[1]) : 0
            const section  = secMatch ? secMatch[1] : 'A'

            try {
              const detRes = await apiClient.get(`/v1/timetables/${ttId}`)
              const entries: Record<string, unknown>[] = detRes.data?.data?.entries ?? []
              entries.forEach(e => {
                if (Number(e.faculty_user_id) !== teacherUserId) return
                allSlots.push({
                  day:         String(e.day_of_week) as TimetableDay,
                  periodIdx:   Number(e.period_no),
                  subjectId:   String(e.subject_label || ''),
                  subjectName: String(e.subject_label || ''),
                  room:        String(e.room || ''),
                  semester,
                  section,
                })
              })
            } catch { /* skip unreachable timetable */ }
          })
        )

        setSlots(allSlots)
        const sems = [...new Set(allSlots.map(s => s.semester))].sort((a, b) => a - b)
        if (sems.length > 0) setActiveSem(sems[0])
      } catch {
        setSlots([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [deptId, teacherUserId])

  const semesters = useMemo(
    () => [...new Set(slots.map(s => s.semester))].sort((a, b) => a - b),
    [slots]
  )

  const viewSlots = useMemo(
    () => slots.filter(s => activeSem === null || s.semester === activeSem),
    [slots, activeSem]
  )

  // day → periodIdx → entry (for matrix)
  const grid = useMemo(() => {
    const g: Record<TimetableDay, Record<number, SlotEntry | null>> = {
      Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {},
    }
    TIMETABLE_DAYS.forEach(d => periods.forEach((_, i) => { g[d][i] = null }))
    viewSlots.forEach(s => {
      if (s.periodIdx < periods.length) g[s.day][s.periodIdx] = s
    })
    return g
  }, [viewSlots, periods])

  // slots for the active day excluding break periods
  const daySlots = useMemo(
    () => viewSlots
      .filter(s => s.day === activeDay && !breakSet.has(s.periodIdx))
      .sort((a, b) => a.periodIdx - b.periodIdx),
    [viewSlots, activeDay, breakSet]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">Loading your schedule…</span>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Teaching Schedule"
        subtitle="Your weekly lecture and lab assignments for the current semester"
      />

      {/* Semester selector (only shown when teacher teaches across multiple semesters) */}
      {semesters.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester:</span>
          {semesters.map(s => (
            <button
              key={s}
              onClick={() => setActiveSem(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded border transition-all ${
                activeSem === s
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary'
              }`}
            >
              Sem {s}
            </button>
          ))}
        </div>
      )}

      {/* Day tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {TIMETABLE_DAYS.map(d => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`py-2.5 px-5 text-sm font-semibold tracking-wide border-b-2 transition-all whitespace-nowrap ${
              activeDay === d
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {DAYS_FULL[d]}
          </button>
        ))}
      </div>

      {/* Class cards for active day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {daySlots.map((s, idx) => {
          const type     = typeLabel(s.subjectName)
          const timLabel = periods[s.periodIdx] ?? `Period ${s.periodIdx + 1}`
          return (
            <PortalCard key={idx} className="hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-primary" />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  type === 'Practical' ? 'bg-amber-50 text-amber-700 border-amber-250'
                  : type === 'Tutorial' ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-accent/15 text-accent border-accent/40'
                }`}>{type}</span>
              </div>
              <div className="mt-3">
                <span className="text-xs font-bold font-mono text-accent tracking-wide uppercase">{s.subjectId}</span>
                <h4 className="text-base font-bold text-slate-800 leading-tight mt-0.5">{s.subjectName}</h4>
                {activeSem === null && (
                  <p className="text-xs text-slate-400 mt-0.5">Sem {s.semester} · Sec {s.section}</p>
                )}
              </div>
              <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-slate-400" />
                  <span>{timLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{s.room}</span>
                </div>
              </div>
            </PortalCard>
          )
        })}

        {daySlots.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <AlertCircle size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-500">
              No scheduled lectures or labs for {DAYS_FULL[activeDay]}.
            </p>
          </div>
        )}
      </div>

      {/* Weekly Matrix View — columns aligned with HOD's period config, breaks shown */}
      <PortalCard className="hidden xl:block">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
          <Calendar size={15} className="text-accent" />
          Weekly Matrix View
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 w-32">
                  DAY
                </th>
                {periods
                  .map((p, i) => ({ label: p, idx: i }))
                  .filter(({ idx }) => !breakSet.has(idx))
                  .map(({ label, idx }) => (
                    <th key={idx} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 whitespace-nowrap last:border-r-0">
                      {label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {TIMETABLE_DAYS.map(d => (
                <tr key={d} className="hover:bg-slate-50/40">
                  <td className="px-4 py-4 text-xs font-bold text-slate-800 border-r border-slate-200 bg-slate-50/60 uppercase tracking-wider whitespace-nowrap">
                    {DAYS_FULL[d]}
                  </td>
                  {periods
                    .map((_, i) => ({ idx: i }))
                    .filter(({ idx }) => !breakSet.has(idx))
                    .map(({ idx }) => {
                      const s = grid[d][idx]
                      return (
                        <td key={idx} className="px-4 py-4 border-r border-slate-200 last:border-r-0">
                          {s ? (
                            <div>
                              <p className="font-bold text-slate-700 text-xs">
                                {s.subjectId} ({typeLabel(s.subjectName)})
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">{s.room}</p>
                              {activeSem === null && (
                                <p className="text-xs text-slate-300 mt-0.5">
                                  S{s.semester}/{s.section}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      )
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>
    </div>
  )
}

export default TeacherTimetable

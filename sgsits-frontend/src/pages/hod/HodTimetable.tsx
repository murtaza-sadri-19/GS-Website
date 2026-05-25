import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import {
  TIMETABLE_DAYS, TIMETABLE_PERIODS,
  type TimetableSlot, type TimetableDay,
} from '../../services/hodService'
import { Clock, Plus, Pencil, Trash2, AlertTriangle, CheckCircle, BarChart3, User, MapPin, Sparkles, Coffee, Send, Printer } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import { getSubjects, getFacultyMembers, type Subject, type FacultyMember } from '../../services/examService'
import apiClient from '../../api/client'

const PERIODS_STORAGE_KEY = 'sgsits_timetable_periods'
const BREAKS_STORAGE_KEY  = 'sgsits_timetable_breaks'

const HodTimetable: React.FC = () => {
  const { user } = useAdminStore()
  const HOD_BRANCH    = user?.department_id ? String(user.department_id) : 'CSE'
  const HOD_DEPT_ID   = user?.department_id ? Number(user.department_id) : null

  const [sem, setSem] = useState<number>(5)
  const [section, setSection] = useState<string>('A')

  // Numeric timetable ID for current dept/sem/section (null = not yet created)
  const [timetableId, setTimetableId] = useState<number | null>(null)
  const [isSyncing,    setIsSyncing]    = useState(false)
  const [isPublished,  setIsPublished]  = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  // Break periods: set of period indices that are breaks (no class assignments)
  const [breakPeriods, setBreakPeriods] = useState<Set<number>>(() => {
    const local = localStorage.getItem(BREAKS_STORAGE_KEY)
    if (local) { try { return new Set<number>(JSON.parse(local)) } catch {} }
    return new Set<number>()
  })
  const [newBreakSlotInput, setNewBreakSlotInput] = useState('')
  const [showAddBreakModal, setShowAddBreakModal] = useState(false)

  // Service-loaded subjects and faculty
  const [deptSubjects, setDeptSubjects] = useState<Subject[]>([])
  const [deptFaculty, setDeptFaculty] = useState<FacultyMember[]>([])

  useEffect(() => {
    let alive = true
    Promise.all([
      getSubjects(HOD_BRANCH),
      getFacultyMembers(HOD_BRANCH),
    ]).then(([subs, fac]) => {
      if (!alive) return
      setDeptSubjects(subs)
      setDeptFaculty(fac)
    }).catch(console.error)
    return () => { alive = false }
  }, [HOD_BRANCH])

  // ── Backend: load timetable for current dept/sem/section ─────────────────────
  const [slotsState, setSlotsState] = useState<TimetableSlot[]>([])

  useEffect(() => {
    if (!HOD_DEPT_ID) return
    let alive = true
    const load = async () => {
      try {
        const res = await apiClient.get('/v1/timetables', {
          params: { department_id: HOD_DEPT_ID, semester: sem },
        })
        const timetables: Record<string, unknown>[] = res.data?.data ?? []
        const match = timetables.find(t => {
          const title = String(t.title || '')
          return title === `Sem ${sem} - Sec ${section}` ||
                 title.includes(`Sec ${section}`) ||
                 (!title && timetables.length === 1)
        }) as Record<string, unknown> | undefined

        if (!alive) return
        if (match && match.id) {
          const detRes = await apiClient.get(`/v1/timetables/${match.id}`)
          const tt = detRes.data?.data as { entries?: Record<string, unknown>[] } | null
          if (!alive) return
          setTimetableId(Number(match.id))
          const entries = tt?.entries ?? []
          const mapped: TimetableSlot[] = entries.map((e) => ({
            id:          String(e.id),
            day:         (e.day_of_week as TimetableDay),
            period:      Number(e.period_no),
            branch_id:   HOD_BRANCH,
            semester:    sem,
            section:     section,
            subjectId:   String(e.subject_label || ''),
            subjectName: String(e.subject_label || ''),
            facultyId:   String(e.faculty_user_id || ''),
            facultyName: String(e.faculty_name || ''),
            room:        String(e.room || ''),
          }))
          setSlotsState(prev => [
            ...prev.filter(s => !(s.branch_id === HOD_BRANCH && s.semester === sem && s.section === section)),
            ...mapped,
          ])
        } else {
          setTimetableId(null)
          setSlotsState(prev => prev.filter(s => !(s.branch_id === HOD_BRANCH && s.semester === sem && s.section === section)))
        }
      } catch {
        // backend unreachable — leave current state as-is (empty for new session)
      }
    }
    load()
    return () => { alive = false }
  }, [HOD_DEPT_ID, HOD_BRANCH, sem, section])

  // ── Backend: save current view's slots ───────────────────────────────────────
  const syncRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const syncToBackend = useCallback(async (updatedSlots: TimetableSlot[], ttId: number | null) => {
    if (!HOD_DEPT_ID) return
    if (syncRef.current) clearTimeout(syncRef.current)
    syncRef.current = setTimeout(async () => {
      setIsSyncing(true)
      try {
        const viewSlots = updatedSlots.filter(s =>
          s.branch_id === HOD_BRANCH && s.semester === sem && s.section === section
        )
        const entries = viewSlots.map(s => ({
          day_of_week:      s.day,
          period_no:        s.period,
          subject_label:    s.subjectName,
          faculty_user_id:  s.facultyId ? Number(s.facultyId) || null : null,
          room:             s.room || null,
        }))
        let id = ttId
        if (!id) {
          const createRes = await apiClient.post('/v1/timetables', {
            department_id: HOD_DEPT_ID,
            semester:      sem,
            title:         `Sem ${sem} - Sec ${section}`,
          })
          id = (createRes.data?.data as { id?: number })?.id ?? null
          if (id) setTimetableId(id)
        }
        if (id) await apiClient.put(`/v1/timetables/${id}/entries`, { entries })
      } catch { /* sync failed silently — local state is still correct */ }
      finally   { setIsSyncing(false) }
    }, 600)
  }, [HOD_DEPT_ID, HOD_BRANCH, sem, section])

  // Load time periods dynamically from localStorage
  const [periodsState, setPeriodsState] = useState<string[]>(() => {
    const local = localStorage.getItem(PERIODS_STORAGE_KEY)
    if (local) {
      try {
        return JSON.parse(local)
      } catch (e) {
        console.error('Error parsing sgsits_timetable_periods', e)
      }
    }
    localStorage.setItem(PERIODS_STORAGE_KEY, JSON.stringify(TIMETABLE_PERIODS))
    return TIMETABLE_PERIODS
  })

  // Selected cell for assignment/editing
  const [activeSlot, setActiveSlot] = useState<{
    day: TimetableDay
    period: number
    slot?: TimetableSlot
  } | null>(null)

  // Modals & custom additions states
  const [showAddTimeModal, setShowAddTimeModal] = useState<boolean>(false)
  const [newTimeSlotInput, setNewTimeSlotInput] = useState<string>('')
  const [deletePeriodTarget, setDeletePeriodTarget] = useState<number | null>(null)

  // State for editing an existing period
  const [editPeriodIdx, setEditPeriodIdx] = useState<number | null>(null)
  const [editPeriodInput, setEditPeriodInput] = useState<string>('')

  // Modal form states for subject allocation
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('')
  const [roomInput, setRoomInput] = useState<string>('')
  const [toast, setToast] = useState<string>('')

  // deptSubjects and deptFaculty are loaded from services above (via useEffect)
  // No additional filtering needed — service already scopes to HOD's department

  // Currently filtered grid slots
  const slots = useMemo(
    () => slotsState.filter(s => s.branch_id === HOD_BRANCH && s.semester === sem && s.section === section),
    [slotsState, sem, section]
  )

  const grid = useMemo(() => {
    const g: Record<TimetableDay, Record<number, TimetableSlot | null>> = {
      Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {},
    }
    TIMETABLE_DAYS.forEach(d => {
      periodsState.forEach((_, i) => { g[d][i] = null })
    })
    slots.forEach(s => {
      if (s.period < periodsState.length) {
        g[s.day][s.period] = s
      }
    })
    return g
  }, [slots, periodsState])

  // Conflict Detection across the ENTIRE department timetable
  const { facultyClashes, roomClashes } = useMemo(() => {
    const fClashes: string[] = []
    const rClashes: string[] = []
    const seenFaculty = new Map<string, TimetableSlot>()
    const seenRoom = new Map<string, TimetableSlot>()

    slotsState.forEach(s => {
      if (s.branch_id !== HOD_BRANCH) return
      
      // Faculty double-booking key: Faculty + Day + Period
      const fKey = `${s.facultyId}-${s.day}-${s.period}`
      if (seenFaculty.has(fKey)) {
        const other = seenFaculty.get(fKey)!
        if (other.semester !== s.semester || other.section !== s.section) {
          const slotTime = periodsState[s.period] || `Period ${s.period + 1}`
          fClashes.push(
            `${s.facultyName} is assigned to both Sem ${other.semester} (Sec ${other.section}) and Sem ${s.semester} (Sec ${s.section}) on ${s.day} during ${slotTime}.`
          )
        }
      } else {
        seenFaculty.set(fKey, s)
      }

      // Room double-booking key: Room + Day + Period
      if (s.room) {
        const rKey = `${s.room.trim().toLowerCase()}-${s.day}-${s.period}`
        if (seenRoom.has(rKey)) {
          const other = seenRoom.get(rKey)!
          if (other.semester !== s.semester || other.section !== s.section) {
            const slotTime = periodsState[s.period] || `Period ${s.period + 1}`
            rClashes.push(
              `Room ${s.room} is scheduled for both Sem ${other.semester} (Sec ${other.section}) and Sem ${s.semester} (Sec ${s.section}) on ${s.day} during ${slotTime}.`
            )
          }
        } else {
          seenRoom.set(rKey, s)
        }
      }
    })

    return { facultyClashes: fClashes, roomClashes: rClashes }
  }, [slotsState, periodsState])

  // Faculty Workloads calculator
  const facultyWorkloads = useMemo(() => {
    return deptFaculty.map(f => {
      const hours = slotsState.filter(s => s.facultyId === f.id).length
      return {
        id: f.id,
        name: f.name,
        designation: f.designation,
        hours,
      }
    }).sort((a, b) => b.hours - a.hours)
  }, [slotsState, deptFaculty])

  // Modal Open Handlers
  const handleOpenAssign = (day: TimetableDay, periodIdx: number, slot?: TimetableSlot) => {
    setActiveSlot({ day, period: periodIdx, slot })
    if (slot) {
      setSelectedSubjectId(slot.subjectId)
      setSelectedFacultyId(slot.facultyId)
      setRoomInput(slot.room)
    } else {
      setSelectedSubjectId('')
      setSelectedFacultyId('')
      setRoomInput('')
    }
  }

  // Pre-allocation Auto-allotment logic when Subject selection changes
  const handleSubjectChange = (subjId: string) => {
    setSelectedSubjectId(subjId)
    const sub = deptSubjects.find(s => s.id === subjId)
    if (sub && sub.facultyId) {
      setSelectedFacultyId(sub.facultyId)
    } else {
      setSelectedFacultyId('')
    }
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Save Assignment
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeSlot) return
    if (!selectedSubjectId || !selectedFacultyId || !roomInput.trim()) {
      showToast('Please fill in all the required fields.')
      return
    }

    const subject = deptSubjects.find(s => s.id === selectedSubjectId)
    const faculty = deptFaculty.find(f => f.id === selectedFacultyId)

    if (!subject || !faculty) return

    const updatedSlots = [...slotsState]
    const existingIdx = updatedSlots.findIndex(
      s => s.branch_id === HOD_BRANCH &&
           s.semester === sem &&
           s.section === section &&
           s.day === activeSlot.day &&
           s.period === activeSlot.period
    )

    const newSlot: TimetableSlot = {
      id: activeSlot.slot?.id || `TT${Date.now()}`,
      day: activeSlot.day,
      period: activeSlot.period,
      branch_id: HOD_BRANCH,
      semester: sem,
      section: section,
      subjectId: subject.id,
      subjectName: subject.name,
      facultyId: faculty.id,
      facultyName: faculty.name,
      room: roomInput.trim(),
    }

    if (existingIdx > -1) {
      updatedSlots[existingIdx] = newSlot
    } else {
      updatedSlots.push(newSlot)
    }

    setSlotsState(updatedSlots)
    void syncToBackend(updatedSlots, timetableId)
    showToast(`Slot assigned successfully to ${subject.name} (${subject.id}).`)
    setActiveSlot(null)
  }

  // Clear Slot (Delete)
  const handleClearSlot = () => {
    if (!activeSlot || !activeSlot.slot) return

    const updatedSlots = slotsState.filter(s => s.id !== activeSlot.slot?.id)
    setSlotsState(updatedSlots)
    void syncToBackend(updatedSlots, timetableId)
    showToast('Timetable slot cleared successfully.')
    setActiveSlot(null)
  }

  // Dynamic Add Custom Time Slot
  const handleAddTimeSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newTimeSlotInput.trim()
    if (!trimmed) return

    if (periodsState.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      showToast('This time slot range already exists!')
      return
    }

    const nextPeriods = [...periodsState, trimmed]
    setPeriodsState(nextPeriods)
    localStorage.setItem(PERIODS_STORAGE_KEY, JSON.stringify(nextPeriods))
    showToast(`Time slot "${trimmed}" added successfully.`)
    setNewTimeSlotInput('')
    setShowAddTimeModal(false)
  }

  // Open Edit Period Modal
  const handleOpenEditPeriod = (idx: number) => {
    setEditPeriodIdx(idx)
    setEditPeriodInput(periodsState[idx])
  }

  // Save Renamed Custom Time Slot (No class reset needed!)
  const handleSaveEditPeriod = (e: React.FormEvent) => {
    e.preventDefault()
    if (editPeriodIdx === null) return
    const trimmed = editPeriodInput.trim()
    if (!trimmed) return

    if (periodsState.some((p, i) => p.toLowerCase() === trimmed.toLowerCase() && i !== editPeriodIdx)) {
      showToast('This time slot range already exists!')
      return
    }

    const nextPeriods = [...periodsState]
    nextPeriods[editPeriodIdx] = trimmed
    setPeriodsState(nextPeriods)
    localStorage.setItem(PERIODS_STORAGE_KEY, JSON.stringify(nextPeriods))
    showToast(`Time slot updated to "${trimmed}".`)
    setEditPeriodIdx(null)
    setEditPeriodInput('')
  }

  // Dynamic Delete Custom Time Slot (With safe shifting & slots purging)
  const handleDeletePeriod = (idx: number) => {
    const deletedTime = periodsState[idx]

    // 1. Purge slots in that specific time slot
    let updatedSlots = slotsState.filter(s => s.period !== idx)

    // 2. Shift subsequent slot index markers down to prevent layout drifts
    updatedSlots = updatedSlots.map(s => {
      if (s.period > idx) {
        return { ...s, period: s.period - 1 }
      }
      return s
    })

    // 3. Remove time slot from state list
    const nextPeriods = periodsState.filter((_, i) => i !== idx)

    // 4. Remove from break periods (shift indices above deleted)
    const nextBreaks = new Set<number>()
    breakPeriods.forEach(b => {
      if (b < idx)  nextBreaks.add(b)
      if (b > idx)  nextBreaks.add(b - 1)
      // b === idx is deleted — skip
    })

    setSlotsState(updatedSlots)
    void syncToBackend(updatedSlots, timetableId)
    setPeriodsState(nextPeriods)
    setBreakPeriods(nextBreaks)
    localStorage.setItem(PERIODS_STORAGE_KEY, JSON.stringify(nextPeriods))
    localStorage.setItem(BREAKS_STORAGE_KEY,  JSON.stringify([...nextBreaks]))
    showToast(`Time slot "${deletedTime}" and its classes cleared.`)
  }

  // Add a break period
  const handleAddBreakSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newBreakSlotInput.trim() || 'Break / Recess'
    if (periodsState.some(p => p.toLowerCase() === trimmed.toLowerCase())) {
      showToast('A time slot with that name already exists!')
      return
    }
    const idx = periodsState.length
    const nextPeriods = [...periodsState, trimmed]
    const nextBreaks  = new Set(breakPeriods).add(idx)
    setPeriodsState(nextPeriods)
    setBreakPeriods(nextBreaks)
    localStorage.setItem(PERIODS_STORAGE_KEY, JSON.stringify(nextPeriods))
    localStorage.setItem(BREAKS_STORAGE_KEY,  JSON.stringify([...nextBreaks]))
    showToast(`Break "${trimmed}" added.`)
    setNewBreakSlotInput('')
    setShowAddBreakModal(false)
  }

  // Publish timetable to backend
  const publishTimetable = async () => {
    if (isPublishing) return
    setIsPublishing(true)
    try {
      let id = timetableId
      if (!id && HOD_DEPT_ID) {
        const createRes = await apiClient.post('/v1/timetables', {
          department_id: HOD_DEPT_ID,
          semester: sem,
          title: `Sem ${sem} - Sec ${section}`,
        })
        id = (createRes.data?.data as { id?: number })?.id ?? null
        if (id) setTimetableId(id)
      }
      if (id) {
        await apiClient.put(`/v1/timetables/${id}`, {
          is_published: true,
          title: `Sem ${sem} - Sec ${section}`,
        })
      }
      setIsPublished(true)
      showToast('Timetable published! Faculty can now view it.')
    } catch {
      showToast('Failed to publish. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  // Print / PDF export
  const printTimetable = () => {
    const dayHeaders = TIMETABLE_DAYS.map(d => `<th>${d}</th>`).join('')
    const bodyRows = periodsState.map((time, i) => {
      if (breakPeriods.has(i)) {
        return `<tr class="break-row"><td class="time-cell">${time}</td><td colspan="${TIMETABLE_DAYS.length}">— BREAK / RECESS —</td></tr>`
      }
      const cells = TIMETABLE_DAYS.map(day => {
        const s = grid[day][i]
        return s
          ? `<td><strong>${s.subjectId}</strong><br/>${s.subjectName}<br/><small>${s.facultyName}</small><br/><small>Room: ${s.room}</small></td>`
          : '<td class="empty"></td>'
      }).join('')
      return `<tr><td class="time-cell">${time}</td>${cells}</tr>`
    }).join('')

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Class Timetable — Sem ${sem} Sec ${section}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; margin: 16px; }
  h2 { text-align: center; margin-bottom: 4px; color: #0b2545; }
  p.sub { text-align: center; font-size: 10px; color: #666; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #0b2545; color: #fff; padding: 6px 4px; text-align: center; font-size: 10px; }
  td { border: 1px solid #ddd; padding: 5px 4px; vertical-align: top; text-align: center; font-size: 10px; }
  td.time-cell { background: #f8fafc; font-weight: bold; text-align: left; white-space: nowrap; }
  td.empty { background: #fafafa; }
  tr.break-row td { background: #f1f5f9; color: #64748b; font-style: italic; text-align: center; }
  strong { color: #0b2545; }
  small { color: #888; }
  @media print { body { margin: 8px; } }
</style></head><body>
<h2>SGSITS — Class Timetable</h2>
<p class="sub">Department: ${user?.department ?? '—'} | Semester ${sem} | Section ${section} | Printed: ${new Date().toLocaleDateString('en-IN')}</p>
<table><thead><tr><th>Time</th>${dayHeaders}</tr></thead><tbody>${bodyRows}</tbody></table>
</body></html>`

    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print() }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Timetable"
        subtitle="Manage and assign department class schedules with automated conflict validation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Timetable Board */}
        <div className="lg:col-span-2 space-y-6">
          <PortalCard className="!p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={sem}
                onChange={(e) => setSem(Number(e.target.value))}
                className="border border-slate-200 rounded px-3 py-2 text-sm bg-white font-semibold text-slate-800 focus:outline-none focus:border-[#0b2545] cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="border border-slate-200 rounded px-3 py-2 text-sm bg-white font-semibold text-slate-800 focus:outline-none focus:border-[#0b2545] cursor-pointer"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>

              <button
                type="button"
                onClick={() => setShowAddTimeModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded text-xs font-semibold hover:border-[#0b2545] hover:text-[#0b2545] hover:bg-[#0b2545]/5 transition-all bg-white"
              >
                <Plus size={13} className="text-[#bfa15f]" />
                <span>Add Period</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddBreakModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded text-xs font-semibold hover:border-[#bfa15f] hover:text-[#bfa15f] hover:bg-[#bfa15f]/5 transition-all bg-white"
              >
                <Coffee size={13} className="text-[#bfa15f]" />
                <span>Add Break</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={printTimetable}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded text-xs font-semibold hover:border-slate-400 hover:bg-slate-50 transition-all bg-white text-slate-700"
              >
                <Printer size={13} />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={publishTimetable}
                disabled={isPublishing || !timetableId}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold transition-all ${
                  isPublished
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-[#0b2545] text-white hover:bg-[#0b2545]/90 disabled:opacity-50'
                }`}
              >
                <Send size={13} />
                <span>{isPublishing ? 'Publishing…' : isPublished ? 'Published ✓' : 'Publish Timetable'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-[#bfa15f] bg-[#bfa15f]/10 px-3 py-1.5 rounded font-bold border border-[#bfa15f]/20">
                <Sparkles size={13} />
                <span>{isSyncing ? 'Saving…' : 'Live Mode'}</span>
              </div>
            </div>
          </PortalCard>

          <PortalCard className="!p-0 overflow-hidden border border-slate-200/80 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="text-left px-4 py-3.5 font-bold uppercase tracking-wider w-28 border-r border-slate-200/60">
                      <Clock size={12} className="inline mr-1 text-[#0b2545]" /> Time
                    </th>
                    {TIMETABLE_DAYS.map(d => (
                      <th key={d} className="text-center px-3 py-3.5 font-bold uppercase tracking-wider border-r border-slate-200/60">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {periodsState.map((time, periodIdx) => {
                    // ── Break row ────────────────────────────────────────────
                    if (breakPeriods.has(periodIdx)) {
                      return (
                        <tr key={`break-${periodIdx}`} className="bg-slate-50">
                          <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500 bg-slate-100/80 border-r border-slate-200/60 group/row relative pr-10 font-semibold">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5"><Coffee size={11} className="text-[#bfa15f]" />{time}</span>
                              <div className="opacity-0 group-hover/row:opacity-100 flex items-center gap-1 absolute right-2 top-1/2 -translate-y-1/2 bg-slate-100/90 pl-1.5 py-0.5 rounded shadow-sm border border-slate-200">
                                <button type="button" onClick={() => handleOpenEditPeriod(periodIdx)} className="p-0.5 rounded text-slate-500 hover:bg-slate-200 hover:text-[#0b2545] transition-all"><Pencil size={11} /></button>
                                <button type="button" onClick={() => setDeletePeriodTarget(periodIdx)} className="p-0.5 rounded text-rose-500 hover:bg-rose-50 transition-all"><Trash2 size={11} /></button>
                              </div>
                            </div>
                          </td>
                          <td colSpan={TIMETABLE_DAYS.length} className="text-center text-[11px] text-slate-400 italic font-semibold py-2.5 border-r border-slate-200/60 bg-slate-50">
                            — BREAK / RECESS —
                          </td>
                        </tr>
                      )
                    }

                    return (
                    <tr key={time} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-650 bg-slate-50/50 align-middle font-semibold border-r border-slate-200/60 group/row relative pr-10">
                        <div className="flex items-center justify-between">
                          <span>{time}</span>
                          <div className="opacity-0 group-hover/row:opacity-100 flex items-center gap-1 absolute right-2 top-1/2 -translate-y-1/2 bg-slate-50/90 pl-1.5 py-0.5 rounded shadow-sm border border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPeriod(periodIdx)}
                              className="p-0.5 rounded text-slate-500 hover:bg-slate-200 hover:text-[#0b2545] transition-all"
                              title="Edit Time Slot"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletePeriodTarget(periodIdx)}
                              className="p-0.5 rounded text-rose-500 hover:bg-rose-50 transition-all"
                              title="Delete Time Slot"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </td>
                      {TIMETABLE_DAYS.map(day => {
                        const slot = grid[day][periodIdx]
                        return (
                          <td key={`${day}-${periodIdx}`} className="p-1.5 align-top border-r border-slate-200/60 w-36">
                            {slot ? (
                              <div
                                onClick={() => handleOpenAssign(day, periodIdx, slot)}
                                className="relative bg-white border border-slate-200 hover:border-[#0b2545]/40 hover:shadow-sm rounded p-2 cursor-pointer transition-all group min-h-[80px] flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold font-mono text-[#0b2545]">{slot.subjectId}</span>
                                    <Pencil size={10} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <p className="text-[11px] font-semibold text-slate-800 leading-tight mt-1 line-clamp-2">{slot.subjectName}</p>
                                </div>
                                <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-0.5">
                                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 line-clamp-1">
                                    <User size={10} className="text-slate-400 shrink-0" />
                                    {slot.facultyName}
                                  </span>
                                  <span className="text-[9px] text-[#bfa15f] font-semibold flex items-center gap-1">
                                    <MapPin size={10} className="text-slate-400 shrink-0" />
                                    {slot.room}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenAssign(day, periodIdx)}
                                className="w-full min-h-[80px] flex flex-col items-center justify-center border border-dashed border-slate-250 hover:border-[#0b2545] hover:bg-[#0b2545]/5 rounded text-slate-400 hover:text-[#0b2545] transition-all p-2 group text-[10px] font-bold gap-1.5"
                              >
                                <Plus size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                <span>Assign Slot</span>
                              </button>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                    ) // end normal row
                  })}

                  {periodsState.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 font-semibold">
                        No time slots configured. Click "Add Time Slot" to start building the schedule.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PortalCard>
        </div>

        {/* Right Column: Conflicts Panel & Workloads Summary */}
        <div className="space-y-6">
          
          {/* conflict Validation */}
          <PortalCard>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#bfa15f]" />
              Schedule Conflict Audit
            </h3>
            
            <div className="space-y-3">
              {facultyClashes.length === 0 && roomClashes.length === 0 ? (
                <div className="flex gap-3 bg-emerald-50 border border-emerald-200/80 rounded-lg p-4 text-emerald-800 text-xs">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                  <div>
                    <h5 className="font-bold text-emerald-900">All Clear</h5>
                    <p className="mt-0.5 font-medium leading-relaxed">No faculty schedules or classroom clashes detected in the database.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {facultyClashes.map((c, i) => (
                    <div key={`f-${i}`} className="flex gap-2.5 bg-rose-50 border border-rose-200/80 rounded-lg p-3 text-rose-800 text-xs">
                      <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-rose-900">Teacher Conflict</h5>
                        <p className="mt-0.5 leading-relaxed font-semibold">{c}</p>
                      </div>
                    </div>
                  ))}

                  {roomClashes.map((c, i) => (
                    <div key={`r-${i}`} className="flex gap-2.5 bg-amber-50 border border-amber-250/80 rounded-lg p-3 text-amber-800 text-xs">
                      <AlertTriangle size={16} className="text-[#bfa15f] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-amber-900">Room Clash</h5>
                        <p className="mt-0.5 leading-relaxed font-semibold">{c}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PortalCard>

          {/* Faculty Workload Counter */}
          <PortalCard>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-[#0b2545]" />
              Weekly Faculty Workloads
            </h3>
            
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
              {facultyWorkloads.map(w => {
                const maxExpected = 12
                const pct = Math.min((w.hours / maxExpected) * 100, 100)
                let colorClass = 'bg-[#bfa15f]' // Optimal load
                let badgeColor = 'bg-[#bfa15f]/10 text-[#bfa15f]'
                let loadLabel = 'Optimal'
                
                if (w.hours > 10) {
                  colorClass = 'bg-rose-500' // Overload
                  badgeColor = 'bg-rose-500/10 text-rose-600 font-bold'
                  loadLabel = 'High Load'
                } else if (w.hours === 0) {
                  colorClass = 'bg-slate-200' // Unassigned
                  badgeColor = 'bg-slate-100 text-slate-400'
                  loadLabel = 'Unassigned'
                }
                
                return (
                  <div key={w.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-slate-800">{w.name}</h5>
                        <p className="text-[10px] text-slate-400 font-medium">{w.designation}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeColor}`}>
                          {w.hours} hrs ({loadLabel})
                        </span>
                      </div>
                    </div>
                    
                    {w.hours > 0 && (
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </PortalCard>
        </div>
      </div>

      {/* Assignment/Editor Modal */}
      <PortalModal
        isOpen={!!activeSlot}
        title={activeSlot?.slot ? `Edit Timetable Slot` : `Assign Timetable Slot`}
        onClose={() => setActiveSlot(null)}
        width="max-w-md"
      >
        {activeSlot && (
          <form onSubmit={handleSaveSlot} className="space-y-4">
            
            {/* Slot Info Badge */}
            <div className="bg-[#0b2545]/5 border border-[#0b2545]/15 rounded-lg p-3 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Schedule</span>
                <span className="font-bold text-[#0b2545]">Sem {sem} (Sec {section})</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Day & Time</span>
                <span className="font-mono font-bold text-[#bfa15f]">{activeSlot.day}, {periodsState[activeSlot.period] || `Period ${activeSlot.period + 1}`}</span>
              </div>
            </div>

            {/* Subject Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Subject <span className="text-[#bfa15f]">*</span>
              </label>
              <select
                required
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545] cursor-pointer"
              >
                <option value="">— Choose Subject —</option>
                {deptSubjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.id} — {s.name} ({s.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Faculty Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Allotted Teacher <span className="text-[#bfa15f]">*</span>
              </label>
              <select
                required
                value={selectedFacultyId}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545] cursor-pointer"
              >
                <option value="">— Choose Teacher —</option>
                {deptFaculty.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.designation})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Note: Selecting a subject auto-assigns its primary allotted teacher by default.</p>
            </div>

            {/* Room Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Classroom / Laboratory Code <span className="text-[#bfa15f]">*</span>
              </label>
              <input
                type="text"
                required
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="e.g. CR-301, Lab-2"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-semibold"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-3 border-t border-slate-100">
              {activeSlot.slot && (
                <button
                  type="button"
                  onClick={handleClearSlot}
                  className="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
                  title="Clear Assignment"
                >
                  <Trash2 size={13} />
                  <span>Clear Slot</span>
                </button>
              )}
              
              <div className="flex-1" />

              <button
                type="button"
                onClick={() => setActiveSlot(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90 transition-colors shadow-sm"
              >
                {activeSlot.slot ? 'Save Changes' : 'Allot Slot'}
              </button>
            </div>

          </form>
        )}
      </PortalModal>

      {/* Add Custom Time Slot Modal */}
      <PortalModal
        isOpen={showAddTimeModal}
        title="Add Custom Time Slot"
        onClose={() => { setShowAddTimeModal(false); setNewTimeSlotInput('') }}
        width="max-w-md"
      >
        <form onSubmit={handleAddTimeSlotSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Time Slot Range <span className="text-[#bfa15f]">*</span>
            </label>
            <input
              type="text"
              required
              value={newTimeSlotInput}
              onChange={(e) => setNewTimeSlotInput(e.target.value)}
              placeholder="e.g. 04:00 - 05:00, 05:00 - 06:00"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-semibold"
            />
            <p className="text-[10px] text-slate-400 mt-1">Specify a clear 12-hour or 24-hour style range representation.</p>
          </div>
          
          <div className="flex gap-2.5 pt-3 border-t border-slate-100 justify-end">
            <button
              type="button"
              onClick={() => { setShowAddTimeModal(false); setNewTimeSlotInput('') }}
              className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90 transition-colors shadow-sm"
            >
              Add Time Slot
            </button>
          </div>
        </form>
      </PortalModal>

      {/* Edit Custom Time Slot Modal */}
      <PortalModal
        isOpen={editPeriodIdx !== null}
        title="Edit Time Slot Range"
        onClose={() => { setEditPeriodIdx(null); setEditPeriodInput('') }}
        width="max-w-md"
      >
        {editPeriodIdx !== null && (
          <form onSubmit={handleSaveEditPeriod} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Time Slot Range <span className="text-[#bfa15f]">*</span>
              </label>
              <input
                type="text"
                required
                value={editPeriodInput}
                onChange={(e) => setEditPeriodInput(e.target.value)}
                placeholder="e.g. 09:00 - 10:00"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-semibold"
              />
              <p className="text-[10px] text-slate-400 mt-1">Updates the display range of the period without losing any class allotments.</p>
            </div>
            
            <div className="flex gap-2.5 pt-3 border-t border-slate-100 justify-end">
              <button
                type="button"
                onClick={() => { setEditPeriodIdx(null); setEditPeriodInput('') }}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </PortalModal>

      {/* Delete Time Slot Confirmation Modal */}
      <PortalModal
        isOpen={deletePeriodTarget !== null}
        title="Delete Time Slot"
        onClose={() => setDeletePeriodTarget(null)}
        width="max-w-sm"
      >
        {deletePeriodTarget !== null && (
          <div className="text-center">
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} className="text-rose-600" />
            </div>
            <p className="text-sm text-slate-700 font-semibold">
              Are you sure you want to delete the time slot "{periodsState[deletePeriodTarget]}"?
            </p>
            <p className="text-[11px] text-slate-550 mt-2 leading-relaxed">
              This will permanently remove this range. <strong>All assigned classes in this specific period will be cleared.</strong>
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setDeletePeriodTarget(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeletePeriod(deletePeriodTarget)
                  setDeletePeriodTarget(null)
                }}
                className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded hover:bg-rose-700 transition-all"
              >
                Delete Slot
              </button>
            </div>
          </div>
        )}
      </PortalModal>

      {/* Add Break Modal */}
      <PortalModal
        isOpen={showAddBreakModal}
        title="Add Break / Recess Period"
        onClose={() => { setShowAddBreakModal(false); setNewBreakSlotInput('') }}
        width="max-w-md"
      >
        <form onSubmit={handleAddBreakSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Break Label
            </label>
            <input
              type="text"
              value={newBreakSlotInput}
              onChange={(e) => setNewBreakSlotInput(e.target.value)}
              placeholder="e.g. 10:00 - 10:15 (Recess)"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-semibold"
            />
            <p className="text-[10px] text-slate-400 mt-1">Leave blank to use "Break / Recess". Break rows span all days — no class assignments possible.</p>
          </div>
          <div className="flex gap-2.5 pt-3 border-t border-slate-100 justify-end">
            <button type="button" onClick={() => { setShowAddBreakModal(false); setNewBreakSlotInput('') }} className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90 transition-colors shadow-sm flex items-center gap-1.5">
              <Coffee size={13} /> Add Break
            </button>
          </div>
        </form>
      </PortalModal>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] bg-[#0b2545] text-white px-5 py-3.5 rounded-lg shadow-xl text-xs font-bold border border-slate-750 flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="text-[#bfa15f]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}

export default HodTimetable

import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'

// Simple local Toast component
interface ToastProps {
  message: string
  onClose: () => void
}
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose} className="hover:text-slate-300">
        <X size={14} />
      </button>
    </div>
  )
}

interface TrainingProgram {
  id: string
  title: string
  trainer: string
  startDate: string
  endDate: string
  timings: string
  mode: 'Online' | 'Offline'
  targetAudience: string
  description: string
  status: 'Upcoming' | 'Ongoing' | 'Completed'
}

const MOCK_TRAININGS: TrainingProgram[] = [
  {
    id: 'TP001',
    title: 'Aptitude & Logical Reasoning Bootcamp',
    trainer: 'Preach Education Services',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    timings: '04:00 PM – 06:00 PM',
    mode: 'Online',
    targetAudience: 'BE 3rd Year (All Branches)',
    description: 'Cracking company aptitude rounds — cover quant, data interpretation, verbal, and logical grids.',
    status: 'Upcoming',
  },
  {
    id: 'TP002',
    title: 'Java & DSA Placement Prep Program',
    trainer: 'Dr. Neha Gupta (In-house)',
    startDate: '2026-05-10',
    endDate: '2026-06-05',
    timings: '09:00 AM – 11:30 AM',
    mode: 'Offline',
    targetAudience: 'CSE, IT (3rd & 4th Year)',
    description: 'Comprehensive reviews of arrays, trees, heaps, dynamic algorithms, and object design.',
    status: 'Ongoing',
  },
  {
    id: 'TP003',
    title: 'Resume Writing & Interview Simulation Lab',
    trainer: 'Barclays Professional Mentors',
    startDate: '2026-04-12',
    endDate: '2026-04-14',
    timings: '10:00 AM – 04:30 PM',
    mode: 'Offline',
    targetAudience: 'All Branches (Final Year)',
    description: 'One-on-one resume reviews and mock hr interviews conducted by industry professionals.',
    status: 'Completed',
  },
]

const PlacementTrainingPrograms: React.FC = () => {
  const [trainings, setTrainings] = useState<TrainingProgram[]>(MOCK_TRAININGS)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTraining, setEditTraining] = useState<TrainingProgram | null>(null)
  const [toast, setToast] = useState('')

  // Form State
  const [title, setTitle] = useState('')
  const [trainer, setTrainer] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [timings, setTimings] = useState('04:00 PM – 06:00 PM')
  const [mode, setMode] = useState<'Online' | 'Offline'>('Online')
  const [targetAudience, setTargetAudience] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TrainingProgram['status']>('Upcoming')

  const handleOpenAdd = () => {
    setEditTraining(null)
    setTitle('')
    setTrainer('')
    setStartDate(new Date().toISOString().slice(0, 10))
    setEndDate(new Date().toISOString().slice(0, 10))
    setTimings('04:00 PM – 06:00 PM')
    setMode('Online')
    setTargetAudience('BE 3rd Year')
    setDescription('')
    setStatus('Upcoming')
    setShowModal(true)
  }

  const handleOpenEdit = (t: TrainingProgram) => {
    setEditTraining(t)
    setTitle(t.title)
    setTrainer(t.trainer)
    setStartDate(t.startDate)
    setEndDate(t.endDate)
    setTimings(t.timings)
    setMode(t.mode)
    setTargetAudience(t.targetAudience)
    setDescription(t.description)
    setStatus(t.status)
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !trainer || !targetAudience || !description) {
      setToast('Please fill all required fields.')
      return
    }

    if (editTraining) {
      setTrainings(prev =>
        prev.map(t =>
          t.id === editTraining.id
            ? {
                ...t,
                title,
                trainer,
                startDate,
                endDate,
                timings,
                mode,
                targetAudience,
                description,
                status,
              }
            : t
        )
      )
      setToast('Training program updated.')
    } else {
      const newTraining: TrainingProgram = {
        id: `TP0${trainings.length + 1}`,
        title,
        trainer,
        startDate,
        endDate,
        timings,
        mode,
        targetAudience,
        description,
        status,
      }
      setTrainings(prev => [newTraining, ...prev])
      setToast('Training program scheduled successfully.')
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this training program?')) {
      setTrainings(prev => prev.filter(t => t.id !== id))
      setToast('Training program deleted.')
    }
  }

  const filteredTrainings = trainings.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.trainer.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadgeVariant = (s: TrainingProgram['status']) => {
    switch (s) {
      case 'Ongoing': return 'info'
      case 'Upcoming': return 'warning'
      case 'Completed': return 'success'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Training Programs"
        subtitle="Manage and schedule placement training bootcamps, aptitude workshops, and mock interview labs"
        action={
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Schedule Program</span>
          </button>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search programs by title, vendor/trainer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm text-slate-700 bg-transparent focus:outline-none"
        />
      </div>

      <PortalCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Program & Trainer</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Audience</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dates & Timings</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mode</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    No placement training sessions scheduled.
                  </td>
                </tr>
              ) : (
                filteredTrainings.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 max-w-sm">
                      <p className="font-semibold text-slate-800 text-sm">{t.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">Trainer: {t.trainer}</p>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">"{t.description}"</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-semibold">
                      {t.targetAudience}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      <div className="font-semibold text-slate-700 whitespace-nowrap">
                        {t.startDate} &rarr; {t.endDate}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap font-mono">{t.timings}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={t.mode}
                        variant={t.mode === 'Online' ? 'info' : 'warning'}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={t.status}
                        variant={getStatusBadgeVariant(t.status)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Edit Program Details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Program"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PortalCard>

      {/* Add Modal */}
      <PortalModal isOpen={showModal} title={editTraining ? 'Edit Training Bootcamp' : 'Schedule Skill Bootcamp'} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Program Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Java & DSA Placement Prep Boot Camp"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Trainer / Vendor
              </label>
              <input
                type="text"
                required
                value={trainer}
                onChange={e => setTrainer(e.target.value)}
                placeholder="e.g. In-house Faculty / External Agency"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Target Audience
              </label>
              <input
                type="text"
                required
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder="e.g. BE 3rd Year (All Branches)"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Daily Timings
              </label>
              <input
                type="text"
                required
                value={timings}
                onChange={e => setTimings(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Bootcamp Mode
              </label>
              <select
                value={mode}
                onChange={e => setMode(e.target.value as 'Online' | 'Offline')}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Program Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Outline what will be covered..."
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Bootcamp Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as TrainingProgram['status'])}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors"
            >
              Schedule Bootcamp
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default PlacementTrainingPrograms

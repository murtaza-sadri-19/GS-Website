import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { CheckCircle2, XCircle, Eye, User, Clock, Loader2, RefreshCw } from 'lucide-react'
import apiClient from '../../api/client'

interface PendingProfile {
  id: number
  teacher_name: string
  teacher_email: string
  designation: string
  department_name: string
  specialization: string | null
  bio: string | null
  updated_at: string
  profile_image_url: string | null
}

const HodProfileReviews: React.FC = () => {
  const [profiles, setProfiles] = useState<PendingProfile[]>([])
  const [loading,  setLoading]  = useState(true)
  const [acting,   setActing]   = useState<number | null>(null)
  const [toast,    setToast]    = useState('')
  const [viewing,  setViewing]  = useState<PendingProfile | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/faculty/department/pending')
      setProfiles((res.data?.data ?? []) as PendingProfile[])
    } catch {
      setToast('Failed to load pending profiles.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const approve = async (id: number) => {
    setActing(id)
    try {
      await apiClient.patch(`/v1/faculty/${id}/status`, { status: 'ACTIVE' })
      showToast('Profile approved and published.')
      setProfiles(prev => prev.filter(p => p.id !== id))
    } catch {
      showToast('Failed to approve. Please try again.')
    } finally {
      setActing(null)
    }
  }

  const decline = async (id: number) => {
    setActing(id)
    try {
      await apiClient.patch(`/v1/faculty/${id}/status`, { status: 'INACTIVE' })
      showToast('Profile kept inactive (declined).')
      await load()
    } catch {
      showToast('Failed. Please try again.')
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Faculty Profile Reviews"
        subtitle="Profiles submitted by teachers in your department awaiting approval"
        action={
          <button onClick={load} disabled={loading} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      />

      {/* Info banner */}
      <PortalCard className="!p-3 bg-primary/5 border-primary/15">
        <div className="flex items-start gap-2">
          <Clock size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary/80">
            When a teacher clicks <strong>"Submit for Approval"</strong> on their profile page, it appears here.
            <br />
            <strong>Approve</strong> publishes the profile to the public website.
            <strong> Keep Inactive</strong> leaves it in draft state — teacher can re-edit and re-submit.
          </p>
        </div>
      </PortalCard>

      {loading ? (
        <PortalCard>
          <div className="flex items-center justify-center py-12 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" />
            <span className="text-sm">Loading pending profiles…</span>
          </div>
        </PortalCard>
      ) : profiles.length === 0 ? (
        <PortalCard>
          <div className="text-center py-16">
            <CheckCircle2 size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm font-semibold text-slate-600">No pending profiles</p>
            <p className="text-xs text-slate-400 mt-1">All faculty profiles in your department are up to date.</p>
          </div>
        </PortalCard>
      ) : (
        <div className="space-y-3">
          {profiles.map(p => (
            <PortalCard key={p.id} className="!p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/15 overflow-hidden shrink-0 flex items-center justify-center">
                  {p.profile_image_url
                    ? <img src={p.profile_image_url} alt={p.teacher_name} className="w-full h-full object-cover" />
                    : <User size={20} className="text-primary/40" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{p.teacher_name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{p.designation || 'No designation'} — {p.department_name}</p>
                      <p className="text-xs text-slate-400">{p.teacher_email}</p>
                      {p.specialization && (
                        <p className="text-xs text-accent font-medium mt-1">{p.specialization}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">
                        <Clock size={10} /> PENDING REVIEW
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        Submitted: {new Date(p.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {p.bio && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.bio}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setViewing(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50"
                    >
                      <Eye size={12} /> View Full
                    </button>
                    <button
                      onClick={() => approve(p.id)}
                      disabled={acting === p.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 disabled:opacity-50"
                    >
                      {acting === p.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      Approve
                    </button>
                    <button
                      onClick={() => decline(p.id)}
                      disabled={acting === p.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50"
                    >
                      {acting === p.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                      Keep Inactive
                    </button>
                  </div>
                </div>
              </div>
            </PortalCard>
          ))}
        </div>
      )}

      {/* Full profile modal */}
      <PortalModal
        isOpen={!!viewing}
        title={viewing ? `Profile — ${viewing.teacher_name}` : ''}
        onClose={() => setViewing(null)}
        width="max-w-lg"
      >
        {viewing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Detail label="Name">{viewing.teacher_name}</Detail>
              <Detail label="Email">{viewing.teacher_email}</Detail>
              <Detail label="Designation">{viewing.designation || '—'}</Detail>
              <Detail label="Department">{viewing.department_name}</Detail>
              <Detail label="Specialization">{viewing.specialization || '—'}</Detail>
              <Detail label="Submitted">{new Date(viewing.updated_at).toLocaleString('en-IN')}</Detail>
            </div>
            {viewing.bio && (
              <Detail label="Bio">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{viewing.bio}</p>
              </Detail>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setViewing(null); approve(viewing.id) }}
                className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Approve & Publish
              </button>
              <button
                onClick={() => setViewing(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-bold rounded hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  )
}

const Detail: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="bg-slate-50 border border-slate-100 rounded p-2.5">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    <div className="text-sm font-semibold text-slate-800 mt-0.5">{children}</div>
  </div>
)

export default HodProfileReviews

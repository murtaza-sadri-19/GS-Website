import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge, SessionBanner } from '../../components/layout/PortalLayout'
import {
  getCorrectionRequests, getFacultyMembers, getActiveSession,
  type CorrectionRequest, type FacultyMember, type Session,
} from '../../services/examService'
import { Eye, Check, X as XIcon } from 'lucide-react'

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
        <XIcon size={14} />
      </button>
    </div>
  )
}

const ExamRequests: React.FC = () => {
  const [requests, setRequests] = useState<CorrectionRequest[]>([])
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([])
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [selectedReq, setSelectedReq] = useState<CorrectionRequest | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    Promise.all([getCorrectionRequests(), getFacultyMembers(), getActiveSession()]).then(([cr, fm, s]) => {
      setRequests(cr); setFacultyMembers(fm); setActiveSession(s); setLoading(false)
    })
  }, [])

  const handleUpdateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    )
    setToast(`Request ${id} has been ${newStatus}.`)
  }

  const getFacultyName = (facultyId: string) => {
    const fac = facultyMembers.find(f => f.id === facultyId)
    return fac ? fac.name : facultyId
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Marks Correction Requests"
        subtitle="Review and approve or reject marks correction requests submitted by faculty members"
      />

      {activeSession && <SessionBanner session={activeSession.label} />}

      <PortalCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Faculty</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Component</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sub-Component</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Submitted On</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400 text-xs">
                    No correction requests found.
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{req.id}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{getFacultyName(req.facultyId)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{req.subjectName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{req.subjectId}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{req.component}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{req.subComponent}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{req.submittedOn}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={req.status}
                        variant={
                          req.status === 'approved'
                            ? 'success'
                            : req.status === 'rejected'
                            ? 'error'
                            : req.status === 'pending'
                            ? 'warning'
                            : 'default'
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="View Request Details"
                        >
                          <Eye size={14} />
                        </button>
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'approved')}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                              title="Approve Request"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'rejected')}
                              className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                              title="Reject Request"
                            >
                              <XIcon size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PortalCard>

      {/* Details Modal */}
      <PortalModal
        isOpen={!!selectedReq}
        title={`Correction Request Details — ${selectedReq?.id}`}
        onClose={() => setSelectedReq(null)}
      >
        {selectedReq && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Faculty Member</p>
                <p className="text-sm font-semibold text-slate-700">{getFacultyName(selectedReq.facultyId)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Submitted Date</p>
                <p className="text-sm font-semibold text-slate-700">{selectedReq.submittedOn}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Subject Details</p>
                <p className="text-sm font-semibold text-slate-700">
                  {selectedReq.subjectName} ({selectedReq.subjectId})
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Assessment Component</p>
                <p className="text-sm font-semibold text-slate-700">
                  {selectedReq.component} &rarr; {selectedReq.subComponent}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Reason for Request</p>
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-slate-600 leading-relaxed italic">
                "{selectedReq.reason}"
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Affected Student Enrollments</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedReq.affectedEnrollments.map(enr => (
                  <span key={enr} className="bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-xs font-mono font-medium text-slate-700">
                    {enr}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedReq(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              {selectedReq.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedReq.id, 'rejected')
                      setSelectedReq(null)
                    }}
                    className="py-2 px-4 bg-rose-600 text-white rounded font-semibold text-sm hover:bg-rose-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedReq.id, 'approved')
                      setSelectedReq(null)
                    }}
                    className="py-2 px-4 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamRequests

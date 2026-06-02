import React, { useState } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react'
import apiClient from '../../api/client'

// ── Password strength rules ───────────────────────────────────────────────────

const RULES = [
  { id: 'len',   label: 'At least 8 characters',      test: (p: string) => p.length >= 8 },
  { id: 'upper', label: 'At least one uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'num',   label: 'At least one number',          test: (p: string) => /[0-9]/.test(p) },
]

function strength(pw: string): 'empty' | 'weak' | 'fair' | 'strong' {
  if (!pw) return 'empty'
  const passed = RULES.filter(r => r.test(pw)).length
  if (passed === 0) return 'weak'
  if (passed === 1) return 'weak'
  if (passed === 2) return 'fair'
  return 'strong'
}

const STRENGTH_CFG = {
  empty:  { label: '',       bar: 'bg-slate-200', width: 'w-0',       text: 'text-slate-400' },
  weak:   { label: 'Weak',   bar: 'bg-red-400',   width: 'w-1/3',     text: 'text-red-500' },
  fair:   { label: 'Fair',   bar: 'bg-amber-400', width: 'w-2/3',     text: 'text-amber-600' },
  strong: { label: 'Strong', bar: 'bg-green-500', width: 'w-full',    text: 'text-green-600' },
}

// ── Component ─────────────────────────────────────────────────────────────────

const ChangePasswordPage: React.FC = () => {
  const [oldPassword, setOldPassword]   = useState('')
  const [newPassword, setNewPassword]   = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showOld, setShowOld]           = useState(false)
  const [showNew, setShowNew]           = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [success, setSuccess]           = useState(false)

  const pw = newPassword
  const str = strength(pw)
  const allRulesPassed = RULES.every(r => r.test(pw))
  const passwordsMatch = pw === confirm && confirm !== ''
  const canSubmit = oldPassword && allRulesPassed && passwordsMatch && !saving

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    if (!allRulesPassed) { setError('New password does not meet the requirements.'); return }
    if (!passwordsMatch) { setError('Passwords do not match.'); return }

    setSaving(true)
    try {
      await apiClient.post('/v1/auth/change-password', { oldPassword, newPassword })
      setSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setConfirm('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Failed to change password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Change Password"
        subtitle="Update your portal login password"
      />

      <div className="max-w-lg">
        <PortalCard>
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <ShieldCheck size={28} className="text-green-600" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">Password updated</p>
                <p className="text-xs text-slate-500 mt-1">Your new password is active. Use it on your next login.</p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 px-5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors"
              >
                Change Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Current password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Current Password <span className="text-[#bfa15f]">*</span>
                </label>
                <PasswordInput
                  value={oldPassword}
                  onChange={setOldPassword}
                  show={showOld}
                  onToggle={() => setShowOld(v => !v)}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />
              </div>

              {/* New password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  New Password <span className="text-[#bfa15f]">*</span>
                </label>
                <PasswordInput
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNew}
                  onToggle={() => setShowNew(v => !v)}
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                />

                {/* Strength bar */}
                {newPassword && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${STRENGTH_CFG[str].bar} ${STRENGTH_CFG[str].width}`} />
                      </div>
                      <span className={`text-[10px] font-bold ${STRENGTH_CFG[str].text}`}>
                        {STRENGTH_CFG[str].label}
                      </span>
                    </div>
                  </div>
                )}

                {/* Rule checklist */}
                <ul className="mt-2.5 space-y-1">
                  {RULES.map(rule => {
                    const passed = rule.test(pw)
                    return (
                      <li key={rule.id} className="flex items-center gap-2">
                        {passed
                          ? <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                          : <XCircle size={12} className="text-slate-300 shrink-0" />
                        }
                        <span className={`text-[11px] ${passed ? 'text-green-700 font-medium' : 'text-slate-500'}`}>
                          {rule.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Confirm New Password <span className="text-[#bfa15f]">*</span>
                </label>
                <PasswordInput
                  value={confirm}
                  onChange={setConfirm}
                  show={showConfirm}
                  onToggle={() => setShowConfirm(v => !v)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  matchState={confirm ? passwordsMatch : null}
                />
                {confirm && !passwordsMatch && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">Passwords do not match.</p>
                )}
                {confirm && passwordsMatch && (
                  <p className="mt-1 text-[11px] text-green-600 font-medium">Passwords match.</p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <XCircle size={13} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-2.5 bg-[#0b2545] text-white text-sm font-bold rounded-md hover:bg-[#0b2545]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {saving
                    ? <><Loader2 size={14} className="animate-spin" /> Updating…</>
                    : <><Lock size={14} /> Update Password</>
                  }
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  You will remain logged in after changing your password.
                </p>
              </div>
            </form>
          )}
        </PortalCard>
      </div>
    </div>
  )
}

// ── Shared password input with show/hide toggle ───────────────────────────────

const PasswordInput: React.FC<{
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
  placeholder: string
  autoComplete?: string
  matchState?: boolean | null
}> = ({ value, onChange, show, onToggle, placeholder, autoComplete, matchState }) => {
  const borderColor =
    matchState === true  ? 'border-green-400 focus:border-green-500' :
    matchState === false ? 'border-red-300 focus:border-red-400' :
                           'border-slate-200 focus:border-[#0b2545]'

  return (
    <div className="relative">
      <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded focus:outline-none transition-colors ${borderColor}`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  )
}

export default ChangePasswordPage

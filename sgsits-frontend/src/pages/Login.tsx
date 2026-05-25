import React, { useState, useRef, useEffect, useCallback } from 'react'
import PageSeo from '../components/global/PageSeo'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'
import { authAPI } from '../api'
import apiClient from '../api/client'

/* ── Canvas Captcha ──────────────────────────────────────── */
function generateCaptchaText(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

interface CaptchaCanvasProps {
  text: string
}

const CaptchaCanvas: React.FC<CaptchaCanvasProps> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height
    ctx.fillStyle = '#f7f8fa'
    ctx.fillRect(0, 0, W, H)
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.moveTo(0, (H / 6) * i)
      ctx.lineTo(W, (H / 6) * i)
      ctx.strokeStyle = 'rgba(11,37,69,0.12)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
    const fonts = ['Georgia', 'Times New Roman', 'Arial', 'Courier New']
    const spacing = (W - 16) / text.length
    for (let i = 0; i < text.length; i++) {
      ctx.save()
      ctx.translate(10 + i * spacing + spacing / 2, H / 2 + 5)
      ctx.rotate((Math.random() - 0.5) * 0.45)
      ctx.font = `bold ${16 + Math.random() * 7}px ${fonts[i % fonts.length]}`
      ctx.fillStyle = '#0b2545'
      ctx.fillText(text[i], -5, 5)
      ctx.restore()
    }
  }, [text])

  return <canvas ref={canvasRef} width={140} height={46} className="rounded select-none border border-gray-300" />
}

/* ── Login Page ──────────────────────────────────────────── */
type LoginTab = 'student' | 'hod' | 'faculty' | 'admin' | 'exam' | 'placement'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAdminStore((state) => state.setAuth)

  const [loginType, setLoginType] = useState<LoginTab>('student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [captchaText, setCaptchaText] = useState(() => generateCaptchaText())
  const [captchaInput, setCaptchaInput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Forgot-password flow
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [forgotMsg, setForgotMsg] = useState('')

  const refreshCaptcha = useCallback(() => {
    setCaptchaText(generateCaptchaText())
    setCaptchaInput('')
  }, [])

  const handleTabChange = (tab: LoginTab) => {
    setLoginType(tab)
    setError('')
    setUsername('')
    setPassword('')
    setCaptchaInput('')
    setForgotMode(false)
    setForgotStatus('idle')
    refreshCaptcha()
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    setForgotStatus('loading')
    setForgotMsg('')
    try {
      const res = await apiClient.post('/v1/auth/forgot-password', { email: forgotEmail.trim().toLowerCase() })
      const msg: string = res.data?.message ?? 'If that email exists, a reset link has been sent.'
      setForgotMsg(msg)
      setForgotStatus('sent')
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setForgotMsg(apiMsg || 'Something went wrong. Please try again.')
      setForgotStatus('error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) return setError('Please enter your username.')
    if (!password) return setError('Please enter your password.')
    if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
      setError('Captcha does not match. Please try again.')
      refreshCaptcha()
      return
    }

    setIsLoading(true)

    try {
      if (loginType === 'student') {
        // Student login — redirect to ERP portal (external)
        window.open('https://erp.sgsits.ac.in', '_blank')
        return
      }

      // All staff roles use a SINGLE backend endpoint POST /api/v1/auth/login
      // The backend returns the role and the frontend redirects accordingly.
      const loginFn =
        loginType === 'admin'     ? authAPI.adminLogin     :
        loginType === 'faculty'   ? authAPI.facultyLogin   :
        loginType === 'hod'       ? authAPI.hodLogin       :
        loginType === 'exam'      ? authAPI.examLogin      :
                                    authAPI.placementLogin

      const res = await loginFn(username, password) as typeof res & { redirectTo?: string }
      setAuth(res.token, res.user)

      // Role-based redirect — backend-driven
      const role = res.user?.role ?? ''
      const ROLE_ROUTES: Record<string, string> = {
        CENTRAL_ADMIN:     '/dashboard/central-admin/dashboard',
        EXAM_CONTROLLER:   '/dashboard/exam/dashboard',
        PLACEMENT_OFFICER: '/dashboard/placement/dashboard',
        HOD:               '/dashboard/hod/dashboard',
        TEACHER:           '/dashboard/teacher/dashboard',
      }
      const dest = (res as { redirectTo?: string }).redirectTo
        ?? ROLE_ROUTES[role]
        ?? '/dashboard/central-admin/dashboard'

      navigate(dest, { replace: true })

    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      const msg = axiosMsg || (err instanceof Error ? err.message : 'Login failed. Please check your credentials.')
      setError(msg)
      refreshCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  const tabs: { key: LoginTab; label: string }[] = [
    { key: 'student',   label: 'Student' },
    { key: 'hod',       label: 'HOD' },
    { key: 'faculty',   label: 'Teacher' },
    { key: 'admin',     label: 'Admin' },
    { key: 'exam',      label: 'Exam Dept' },
    { key: 'placement', label: 'Placement' },
  ]

  const placeholders: Record<LoginTab, { username: string; hint: string; fieldLabel: string }> = {
    student:   { username: 'Enrollment Number (e.g. 0801CS211001)', hint: 'Use your enrollment number and ERP password',                          fieldLabel: 'Enrollment Number' },
    hod:       { username: 'Email (e.g. hod.ce@sgsits.ac.in)',      hint: 'Use your official institute email and password',                       fieldLabel: 'Email Address' },
    faculty:   { username: 'Email (e.g. faculty@sgsits.ac.in)',      hint: 'Use your official institute email and password',                       fieldLabel: 'Email Address' },
    admin:     { username: 'Email (e.g. admin@sgsits.ac.in)',        hint: 'Use your official admin email and password',                           fieldLabel: 'Email Address' },
    exam:      { username: 'Email (e.g. exam@sgsits.ac.in)',         hint: 'Use your official Exam Department email and password',                 fieldLabel: 'Email Address' },
    placement: { username: 'Email (e.g. tnp@sgsits.ac.in)',          hint: 'Use your official T&P Cell email and password',                       fieldLabel: 'Email Address' },
  }

  const resolvedBgImage = `${import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''}/assets/media__1776272596244.png`

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: `url('${resolvedBgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <PageSeo pageKey="login" />
      {/* Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'rgba(11,37,69,0.55)' }} />

      {/* Navbar */}
      <nav className="w-full flex items-center gap-3 px-4 sm:px-6 py-3 shadow-sm relative z-40 bg-primary border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/image.png" alt="SGSITS" className="w-10 h-10 object-contain bg-white rounded-full p-0.5 shrink-0" />
          <div className="hidden sm:block text-left">
            <p className="text-white font-bold text-sm leading-tight">Shri G. S. Institute</p>
            <p className="text-white/50 text-[11px]">of Technology and Science, Indore</p>
          </div>
        </Link>
        <div className="ml-auto">
          <Link to="/" className="text-white/70 hover:text-white text-xs font-medium flex items-center gap-1 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-1.5 bg-accent" />

            <div className="px-7 sm:px-9 py-8">
              {/* Header */}
              <div className="flex flex-col items-center mb-6 text-center">
                <img src="/assets/image.png" alt="SGSITS Logo" className="w-14 h-14 object-contain mb-3" />
                <h1 className="text-xl font-display font-bold text-gray-800">SGSITS Portal Login</h1>
                <p className="text-xs text-slate-500 mt-0.5">Shri G. S. Institute of Technology & Science</p>
              </div>

              {/* Tab Switcher */}
              <div className="grid grid-cols-3 sm:grid-cols-6 rounded border border-gray-200 overflow-hidden mb-5 text-[11px] font-semibold divide-x divide-gray-200 sm:divide-y-0 divide-y">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => handleTabChange(t.key)}
                    className="py-2.5 px-1 transition-all cursor-pointer truncate"
                    style={
                      loginType === t.key
                        ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                        : { backgroundColor: '#fff', color: '#6b7280' }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Hint */}
              <p className="text-[11px] text-slate-500 text-center mb-4 bg-slate-50 border border-slate-100 rounded px-3 py-2">
                {placeholders[loginType].hint}
              </p>

              {/* Error */}
              {error && (
                <div className="mb-4 bg-[#bfa15f]/10 border border-[#bfa15f]/30 text-[#0b2545] text-sm px-4 py-2.5 rounded flex items-center gap-2">
                  <span className="shrink-0">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Username */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block mb-1">
                    {placeholders[loginType].fieldLabel}
                  </label>
                  <input
                    type={loginType === 'admin' ? 'email' : 'text'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={placeholders[loginType].username}
                    autoComplete="username"
                    disabled={isLoading}
                    className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none placeholder-gray-400 bg-white transition-all focus:border-primary disabled:opacity-60"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Password</label>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setForgotStatus('idle'); setForgotEmail(''); setForgotMsg('') }}
                      className="text-[11px] text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="w-full border border-gray-300 rounded px-4 py-2.5 pr-11 text-sm focus:outline-none placeholder-gray-400 bg-white transition-all focus:border-primary disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPwd ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                {/* Captcha */}
                <div className="flex items-center gap-2">
                  <CaptchaCanvas text={captchaText} />
                  <button type="button" onClick={refreshCaptcha} className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors" title="Refresh Captcha">
                    ↻
                  </button>
                  <input
                    type="text"
                    value={captchaInput}
                    maxLength={6}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter captcha"
                    autoComplete="off"
                    disabled={isLoading}
                    className="flex-1 min-w-0 border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none placeholder-gray-400 font-mono tracking-widest bg-white transition-all focus:border-primary disabled:opacity-60"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded text-white font-bold text-sm tracking-wide transition-all hover:opacity-95 active:scale-[0.98] mt-1 cursor-pointer bg-primary disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    `Sign In as ${tabs.find(t => t.key === loginType)?.label ?? loginType}`
                  )}
                </button>
              </form>

              {/* Student special note */}
              {loginType === 'student' && (
                <p className="text-center text-[11px] text-slate-400 mt-4">
                  Student login redirects to the{' '}
                  <a href="https://erp.sgsits.ac.in" target="_blank" rel="noreferrer" className="text-primary underline">ERP Portal</a>
                </p>
              )}

            </div>

            {/* ── Forgot Password inline panel ─────────────────────── */}
            {forgotMode && (
              <div className="border-t border-slate-100 px-7 sm:px-9 py-6 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-slate-700">Reset Your Password</h2>
                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm leading-none"
                    aria-label="Close"
                  >✕</button>
                </div>

                {forgotStatus === 'sent' ? (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-4 py-3">
                    {forgotMsg}
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-3" noValidate>
                    <p className="text-[11px] text-slate-500">
                      Enter your official institute email. If it exists in our system, a reset link will be sent.
                    </p>
                    {forgotStatus === 'error' && (
                      <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                        {forgotMsg}
                      </div>
                    )}
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="your.email@sgsits.ac.in"
                      required
                      disabled={forgotStatus === 'loading'}
                      className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none placeholder-gray-400 bg-white focus:border-primary disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={forgotStatus === 'loading' || !forgotEmail.trim()}
                      className="w-full py-2.5 rounded text-white font-semibold text-sm bg-primary hover:opacity-95 disabled:opacity-50 transition-all"
                    >
                      {forgotStatus === 'loading' ? 'Sending…' : 'Send Reset Link'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-white/60 text-xs mt-5">
            © {new Date().getFullYear()} SGSITS Indore. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

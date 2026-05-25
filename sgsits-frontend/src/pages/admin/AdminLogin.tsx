import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { authAPI } from '../../api'
import { ShieldCheck, Mail, Lock, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAdminStore((state) => state.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }

    setIsLoading(true)
    try {
      // Calls authAPI.adminLogin — replace with real backend when ready
      const res = await authAPI.adminLogin(email, password)
      setAuth(res.token, res.user)
      navigate('/dashboard/central-admin/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col justify-center items-center py-12 px-6">
      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link to="/" className="absolute -top-12 left-0 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Institute Homepage
        </Link>

        <div className="bg-white border border-slate-200 rounded-lg p-8 md:p-10 shadow-sm space-y-7">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <img src="/assets/image.png" alt="SGSITS Logo" className="w-16 h-16 object-contain" />
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[9px] font-extrabold bg-primary/10 text-primary tracking-widest uppercase border border-primary/20">
                <ShieldCheck className="w-3 h-3" />
                Admin Panel
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 font-display">SGSITS Administration</h2>
              <p className="text-xs text-slate-500">Sign in with your official admin credentials</p>
            </div>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-[#0b2545]/10 border border-[#0b2545]/25 rounded p-3 text-xs text-[#0b2545]">
            <p className="font-bold mb-1">Demo Credentials (Frontend Mock):</p>
            <p>Email: <code className="font-mono">admin@sgsits.ac.in</code></p>
            <p>Password: <code className="font-mono">admin123</code> (min 4 chars)</p>
            <p className="mt-1 text-[#0b2545]/70 italic">Replace with real backend API when ready</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-[#bfa15f]/10 border border-[#bfa15f]/30 rounded flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#bfa15f] shrink-0 mt-0.5" />
                <p className="text-[11px] font-semibold text-[#0b2545]">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@sgsits.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded text-sm font-medium text-slate-800 focus:outline-none placeholder-slate-400 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  Password
                </label>
                <a href="mailto:webmanager@sgsits.ac.in?subject=Admin Password Reset" className="text-[10px] font-semibold text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded text-sm font-medium text-slate-800 focus:outline-none placeholder-slate-400 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-500">
              Unauthorized access is monitored. Contact{' '}
              <a href="mailto:webmanager@sgsits.ac.in" className="text-primary underline">webmanager@sgsits.ac.in</a>
              {' '}for access issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

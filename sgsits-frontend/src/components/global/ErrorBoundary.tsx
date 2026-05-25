import React from 'react'
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { Home, ArrowLeft, ShieldQuestion, RotateCw } from 'lucide-react'
import Logo from './Header/Logo'

const ErrorBoundary: React.FC = () => {
  const error = useRouteError()
  let errorMessage = 'The academic listing or document sub-directory you are looking for has been relocated, renamed, or is currently undergoing data migration.'
  let statusCode = 404
  let errorDetails = ''

  if (isRouteErrorResponse(error)) {
    statusCode = error.status
    errorMessage = error.statusText || error.data?.message || errorMessage
  } else if (error instanceof Error) {
    statusCode = 500
    errorMessage = error.message
    errorDetails = error.stack || ''
  } else if (typeof error === 'string') {
    statusCode = 500
    errorMessage = error
  } else if (error && typeof error === 'object') {
    statusCode = 500
    errorMessage = (error as { message?: string }).message || JSON.stringify(error)
  }

  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-6 bg-white font-sans selection:bg-[#bfa15f]/20">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-150 relative z-10">
        <Logo />
        <Link 
          to="/" 
          className="text-xs font-semibold tracking-wider uppercase transition-colors text-[#0b2545] hover:text-[#bfa15f]"
        >
          ← Go Back Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center my-12 relative z-10 px-4">
        {/* 404 Compass Graphic */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-slate-100 rounded-full filter blur-xl"></div>
          <div className="relative w-36 h-36 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm group-hover:border-[#0b2545] transition-colors duration-500 mx-auto">
            <svg
              className="w-20 h-20 text-slate-400 group-hover:text-[#0b2545] transition-colors duration-500 transform group-hover:rotate-45 duration-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <polygon points="12,4 15,12 12,20 9,12" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05" />
            </svg>
            <div className="absolute top-2 text-[10px] font-bold text-slate-400">N</div>
            <div className="absolute bottom-2 text-[10px] font-bold text-slate-400">S</div>
            <div className="absolute left-2 text-[10px] font-bold text-slate-400">W</div>
            <div className="absolute right-2 text-[10px] font-bold text-slate-400">E</div>
          </div>
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-[#bfa15f] text-white font-semibold text-[10px] px-3 py-0.5 rounded shadow-sm font-display tracking-wider whitespace-nowrap">
            {statusCode} ERROR
          </span>
        </div>

        {/* Text Info */}
        <div className="max-w-md space-y-3">
          <h1 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">
            Page Lost in Transit
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            {errorMessage}
          </p>
        </div>

        {/* Technical Stack Trace details */}
        {errorDetails && (
          <div className="mt-6 text-left w-full max-w-md mx-auto">
            <details className="cursor-pointer group">
              <summary className="text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 select-none outline-none text-center">
                Technical Details ▾
              </summary>
              <pre className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-red-600 font-mono overflow-auto max-h-40 leading-relaxed whitespace-pre-wrap">
                {errorDetails}
              </pre>
            </details>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md">
          <Link
            to="/"
            className="px-6 py-2.5 bg-[#0b2545] hover:bg-[#0b2545]/90 text-white rounded font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-400 text-slate-700 rounded font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          {statusCode !== 404 && (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-400 text-slate-700 rounded font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <RotateCw className="w-4 h-4" />
              Retry Page
            </button>
          )}
        </div>

        {/* Help Disclosures */}
        <div className="mt-12 p-5 bg-[#f7f8fa] border border-slate-200 rounded-md max-w-md flex items-start gap-3 text-left shadow-sm mx-auto">
          <ShieldQuestion className="w-5 h-5 text-[#0b2545] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-display">
              Need immediate administrative assistance?
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Please contact the respective academic department, or file a notice report with the{' '}
              <Link to="/policy/web-info-manager" className="text-[#0b2545] hover:underline font-semibold">
                Web Info Manager
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] tracking-wider uppercase text-slate-400 border-t border-slate-100 py-6 max-w-7xl mx-auto w-full relative z-10 mt-12">
        &copy; {new Date().getFullYear()} Shri G. S. Institute of Technology & Science (SGSITS). All rights reserved.
      </footer>
    </div>
  )
}

export default ErrorBoundary

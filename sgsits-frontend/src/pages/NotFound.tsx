import React from 'react'
import PageSeo from '../components/global/PageSeo'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, ShieldQuestion } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-6 text-center bg-white">
      <PageSeo pageKey="404" />
      {/* 404 Compass Graphic */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-slate-100 rounded-full filter blur-xl"></div>
        <div className="relative w-36 h-36 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm group-hover:border-[#0b2545] transition-colors duration-500">
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
        <span className="absolute -bottom-1 right-2 bg-[#bfa15f] text-white font-semibold text-[10px] px-2 py-0.5 rounded shadow-sm font-display tracking-wider">
          404 ERROR
        </span>
      </div>

      {/* Text Info */}
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-display font-semibold text-slate-850 tracking-tight">
          Page Lost in Transit
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          The academic listing or document sub-directory you are looking for has been relocated, renamed, or is currently undergoing data migration.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center w-full max-w-sm">
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
      </div>

      {/* Help Disclosures */}
      <div className="mt-12 p-5 bg-[#f7f8fa] border border-slate-200 rounded-md max-w-md flex items-start gap-3 text-left shadow-sm">
        <ShieldQuestion className="w-5 h-5 text-[#0b2545] flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-slate-850 font-display">
            Need immediate administrative assistance?
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Please search our official{' '}
            <Link to="/about/telephone-directory" className="text-[#0b2545] hover:underline font-semibold">
              Telephone Directory
            </Link>{' '}
            to contact the respective academic department, or file a notice report with the{' '}
            <Link to="/policy/web-info-manager" className="text-[#0b2545] hover:underline font-semibold">
              Web Info Manager
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound

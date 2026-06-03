import React from 'react'
import { Link } from 'react-router-dom'
import { Accessibility } from 'lucide-react'
import SearchBar from '../global/Header/SearchBar'
import type { TopBarData } from '../../services/settingsService'

interface TopBarProps {
  topBar: TopBarData
  quickLinks: { label: string; to: string }[]
  loginLabel: string
}

const TopBar: React.FC<TopBarProps> = ({ topBar, quickLinks, loginLabel }) => (
  <div className="bg-primary text-white/80 text-xs md:text-sm py-2 border-b border-white/10 w-full relative z-30 font-sans font-medium">
    <div className="w-full px-4 lg:px-12 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:items-center">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-x-6">
        {quickLinks.map((ql) => (
          <Link key={ql.to} to={ql.to} className="hover:text-white transition-colors">
            {ql.label}
          </Link>
        ))}
        {topBar.helpline && (
          <span className="hidden lg:inline text-white/50">| Helpline: {topBar.helpline}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <SearchBar dark />
          <button className="flex items-center hover:text-white transition-colors">
            <Accessibility size={14} className="sm:mr-1 text-white/50" />
            <span className="hidden sm:inline">A- / A / A+</span>
          </button>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-1.5 bg-transparent hover:bg-white/10 border border-accent text-accent px-3 py-1.5 rounded-full font-semibold text-xs transition-all shrink-0"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          <span>{loginLabel}</span>
        </Link>
      </div>
    </div>
  </div>
)

export default TopBar

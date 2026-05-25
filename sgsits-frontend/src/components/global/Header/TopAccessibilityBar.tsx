/**
 * TopAccessibilityBar — Top utility bar with helpline, accessibility tools, and theme toggle.
 *
 * ALL label text loaded from uiLabelsService — admin can change:
 *   • "Skip to Content" label
 *   • "Text Size:" label
 *   • "A-" / "A" / "A+" button text
 *   • "High Contrast" / "Normal Contrast" toggle text
 *   • "Switch to Dark Mode" / "Switch to Light Mode" title text
 * Helpline/email/ERP data from settingsService.
 */

import React, { useEffect, useState } from 'react'
import { useUIStore } from '../../../store/uiStore'
import { Sun, Moon, Eye, EyeOff, Type } from 'lucide-react'
// ─── Service layer ────────────────────────────────────────────────────────────
import { settingsService, topBarDefaults } from '../../../services/settingsService'
import { uiLabelsService, uiLabelsDefaults } from '../../../services/uiLabelsService'
import type { TopBarData } from '../../../mock/settings/settingsData'
import type { UiLabelsConfig } from '../../../services/uiLabelsService'

const TopAccessibilityBar: React.FC = () => {
  const {
    fontSize,
    highContrast,
    setFontSize,
    toggleContrast
  } = useUIStore()

  // ── Top bar data — loaded through service layer ───────────────────────────
  const [barData, setBarData] = useState<TopBarData>(topBarDefaults)

  // ── UI labels — loaded through service layer ──────────────────────────────
  const [labels, setLabels] = useState<UiLabelsConfig>(uiLabelsDefaults)

  useEffect(() => {
    settingsService.getTopBarData().then(setBarData)
    uiLabelsService.getUiLabels().then(setLabels)
  }, [])

  // Apply Font Scale to <html> element
  useEffect(() => {
    const root = document.documentElement
    if (fontSize === 'sm') {
      root.style.setProperty('--font-scale', '90%')
    } else if (fontSize === 'lg') {
      root.style.setProperty('--font-scale', '110%')
    } else {
      root.style.setProperty('--font-scale', '100%')
    }
  }, [fontSize])

  // Apply High Contrast class
  useEffect(() => {
    const root = document.documentElement
    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
  }, [highContrast])

  // Theme support toggling
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    }
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    if (root.classList.contains('dark')) {
      root.classList.remove('dark')
      setTheme('light')
    } else {
      root.classList.add('dark')
      setTheme('dark')
    }
  }

  const a11y = labels.accessibility

  return (
    <div className="w-full bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 py-2 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
        {/* Quick Helpline Info */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">
            <strong className="text-brand-gold">Helpline:</strong> {barData.helpline}
          </span>
          <span className="hidden md:inline">
            <strong className="text-brand-gold">Email:</strong> {barData.email}
          </span>
          <span>
            <strong className="text-brand-gold">Code:</strong> {barData.instituteCode}
          </span>
        </div>

        {/* Accessibility Buttons */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Skip to Content */}
          <a
            href="#main-content"
            className="hover:text-brand-gold font-medium px-2 py-0.5 border border-slate-700 hover:border-brand-gold rounded transition-colors"
          >
            {a11y.skipToContent}
          </a>

          <div className="h-4 w-px bg-slate-700" />

          {/* Font Resizing */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 mr-1 flex items-center gap-0.5">
              <Type className="w-3.5 h-3.5" /> {a11y.textSizeLabel}
            </span>
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 rounded border transition-all ${
                fontSize === 'sm'
                  ? 'bg-brand-burgundy text-white border-brand-burgundy'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
              title="Decrease Font Size"
            >
              {a11y.textSizeSmall}
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-0.5 rounded border transition-all ${
                fontSize === 'base'
                  ? 'bg-brand-burgundy text-white border-brand-burgundy'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
              title="Normal Font Size"
            >
              {a11y.textSizeNormal}
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded border transition-all ${
                fontSize === 'lg'
                  ? 'bg-brand-burgundy text-white border-brand-burgundy'
                  : 'border-slate-700 hover:border-slate-500'
              }`}
              title="Increase Font Size"
            >
              {a11y.textSizeLarge}
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Contrast Toggling */}
          <button
            onClick={toggleContrast}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-all ${
              highContrast
                ? 'bg-brand-gold text-slate-900 border-brand-gold font-bold'
                : 'border-slate-700 hover:border-slate-500'
            }`}
            title="Toggle High Contrast Mode"
          >
            {highContrast ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>{a11y.normalContrast}</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>{a11y.highContrast}</span>
              </>
            )}
          </button>

          <div className="h-4 w-px bg-slate-700" />

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all text-slate-350 hover:text-white"
            title={theme === 'light' ? a11y.darkMode : a11y.lightMode}
          >
            {theme === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-slate-300" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-[#bfa15f]" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopAccessibilityBar

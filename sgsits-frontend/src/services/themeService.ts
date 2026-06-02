import { getCmsSection, saveCmsSection } from './settingsService'

export interface ThemeColors {
  primary: string    // nav, buttons, headings
  accent: string     // gold highlights, CTAs
  background: string // section/page backgrounds
  text: string       // body & heading text
}

export const themeDefaults: ThemeColors = {
  primary:    '#0b2545',
  accent:     '#bfa15f',
  background: '#f7f8fa',
  text:       '#0b2545',
}

export const getThemeColors = async (): Promise<ThemeColors> => {
  const data = await getCmsSection<ThemeColors>('theme.colors')
  return data ? { ...themeDefaults, ...data } : themeDefaults
}

export const saveThemeColors = async (colors: ThemeColors): Promise<void> => {
  await saveCmsSection('theme.colors', colors)
}

const hexToRgb = (hex: string): string => {
  const h = hex.replace('#', '')
  return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`
}

export const applyTheme = (colors: ThemeColors): void => {
  const r = document.documentElement
  // Primary — affects nav, buttons, headings, links
  r.style.setProperty('--color-primary',        colors.primary)
  r.style.setProperty('--color-primary-rgb',    hexToRgb(colors.primary))
  r.style.setProperty('--color-brand-burgundy', colors.primary)
  r.style.setProperty('--color-brand-dark',     colors.primary)
  r.style.setProperty('--color-accent-blue',    colors.primary)
  r.style.setProperty('--nav-text-default',     colors.primary)
  r.style.setProperty('--nav-text-sticky',      colors.primary)
  r.style.setProperty('--login-btn-bg',         colors.primary)
  r.style.setProperty('--login-panel-text',     colors.primary)
  r.style.setProperty('--prof-name-color',      colors.primary)
  r.style.setProperty('--prof-year-color',      colors.primary)
  r.style.setProperty('--prof-link-color',      colors.primary)
  r.style.setProperty('--color-slate-850',      colors.primary)
  // Accent — gold highlights, CTAs, active states
  r.style.setProperty('--color-accent',         colors.accent)
  r.style.setProperty('--color-accent-rgb',     hexToRgb(colors.accent))
  r.style.setProperty('--color-brand-gold',     colors.accent)
  r.style.setProperty('--prof-ribbon-color',    colors.accent)
  // Background — alternating section backgrounds
  r.style.setProperty('--color-brand-light',        colors.background)
  r.style.setProperty('--color-sgsits-section-bg',  colors.background)
  // Text — body and heading text
  r.style.setProperty('--color-heading', colors.text)
}

export const themeService = { getThemeColors, saveThemeColors, applyTheme }
export default themeService

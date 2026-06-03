import {
  BookOpen,
  GraduationCap,
  Microscope,
  Users,
  Building,
  FileText,
  FlaskConical,
  Rocket,
  Newspaper,
  Landmark,
} from 'lucide-react'
import type { ComponentType, CSSProperties } from 'react'

export type IconComponent = ComponentType<{
  size?: number
  style?: CSSProperties
  strokeWidth?: number
  className?: string
}>

// Palette — CSS variables so admin theme changes propagate automatically
export const C = {
  navy:    'var(--color-primary)',
  gold:    'var(--color-accent)',
  white:   '#ffffff',
  navy10:  'rgba(var(--color-primary-rgb), 0.10)',
  navy15:  'rgba(var(--color-primary-rgb), 0.15)',
  navy40:  'rgba(var(--color-primary-rgb), 0.40)',
  navy45:  'rgba(var(--color-primary-rgb), 0.45)',
  navy55:  'rgba(var(--color-primary-rgb), 0.55)',
  navy60:  'rgba(var(--color-primary-rgb), 0.60)',
  navy70:  'rgba(var(--color-primary-rgb), 0.70)',
  navy75:  'rgba(var(--color-primary-rgb), 0.75)',
  gold15:  'rgba(var(--color-accent-rgb), 0.15)',
  gold20:  'rgba(var(--color-accent-rgb), 0.20)',
  gold25:  'rgba(var(--color-accent-rgb), 0.25)',
  white60: 'rgba(255,255,255,0.60)',
  white70: 'rgba(255,255,255,0.70)',
  white80: 'rgba(255,255,255,0.80)',
}

export const ICON_MAP: Record<string, IconComponent> = {
  FlaskConical,
  Rocket,
  Newspaper,
  Landmark,
  BookOpen,
  GraduationCap,
  Microscope,
  Users,
  Building,
  FileText,
}

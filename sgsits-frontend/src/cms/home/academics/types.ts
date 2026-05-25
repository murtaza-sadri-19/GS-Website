export interface AcademicProgram {
  id: string
  iconName: string
  title: string
  description: string
  to: string
  ctaLabel: string
}

export interface AcademicsSectionConfig {
  label: string
  heading: string
  accentText: string
  description: string
  programs: AcademicProgram[]
  enabled: boolean
  order: number
}

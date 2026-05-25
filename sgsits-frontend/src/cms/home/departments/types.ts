export interface DepartmentShortcutItem {
  name: string
  slug: string
}

export interface HomeDepartmentsConfig {
  label: string
  heading: string
  accentText: string
  showAllLink: string
  items: DepartmentShortcutItem[]
  enabled: boolean
  order: number
}

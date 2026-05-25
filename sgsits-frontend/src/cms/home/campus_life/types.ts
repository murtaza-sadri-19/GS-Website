export interface CampusLifeShortcutItem {
  id: string
  title: string
  description: string
  iconName: string
  imageUrl: string
  to: string
}

export interface HomeCampusLifeConfig {
  label: string
  heading: string
  accentText: string
  description: string
  facilities: CampusLifeShortcutItem[]
  enabled: boolean
  order: number
}

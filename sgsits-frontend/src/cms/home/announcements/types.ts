export interface AnnouncementItem {
  id: string
  title: string
  date: string
  isNew: boolean
  to: string
}

export interface AnnouncementsConfig {
  enabled: boolean
  order: number
  items: AnnouncementItem[]
}

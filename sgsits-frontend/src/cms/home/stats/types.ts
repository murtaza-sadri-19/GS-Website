export interface StatItem {
  val: string
  label: string
}

export interface HomeStatsConfig {
  backgroundImage: string
  fallbackImage: string
  items: StatItem[]
  enabled: boolean
  order: number
}

export interface HeroConfig {
  instituteName: string
  welcomeText: string
  accentText: string
  imageUrl: string
  imagePosition: string
  enabled: boolean
  order: number
}

export interface HeroTileData {
  id: number
  title: string
  subtitle: string
  iconName: string
  dark: boolean
  path: string
  enabled: boolean
  order: number
}

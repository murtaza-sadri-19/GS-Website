export interface HeroTileData {
  iconName: string
  [key: string]: unknown
}

export interface HeroConfig {
  tiles?: HeroTileData[]
  [key: string]: unknown
}

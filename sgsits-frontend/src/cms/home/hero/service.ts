/**
 * Hero CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.hero
 * Falls back to defaults when backend unreachable.
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HeroConfig, HeroTileData } from './types'
import { defaultHeroConfig, defaultHeroTiles } from './mock'

type HeroCmsBlob = HeroConfig & { tiles?: HeroTileData[] }

const KEY = 'home.hero'

export const getHeroConfig = async (): Promise<HeroConfig> => {
  const data = await getCmsSection<HeroCmsBlob>(KEY, { ...defaultHeroConfig, tiles: defaultHeroTiles })
  const { tiles: _tiles, ...config } = data
  return { ...defaultHeroConfig, ...config }
}

export const getHeroTiles = async (): Promise<HeroTileData[]> => {
  const data = await getCmsSection<HeroCmsBlob>(KEY, { ...defaultHeroConfig, tiles: defaultHeroTiles })
  return Array.isArray(data.tiles) && data.tiles.length > 0 ? data.tiles : defaultHeroTiles
}

export const saveHero = async (config: HeroConfig, tiles: HeroTileData[]): Promise<void> => {
  await saveCmsSection(KEY, { ...config, tiles })
}

export const heroService = { getHeroConfig, getHeroTiles, saveHero }
export default heroService

import type { HeroConfig, HeroTileData } from './types'

export const defaultHeroConfig: HeroConfig = {
  instituteName: 'Shri G. S. Institute of Technology & Science',
  welcomeText: 'Welcome To SGSITS',
  accentText: 'Indore',
  imageUrl: 'var(--hero-img-url)',
  imagePosition: 'center 28%',
  enabled: true,
  order: 1,
}

export const defaultHeroTiles: HeroTileData[] = [
  { id: 1, title: 'Research',        subtitle: 'Mapping the Innovations',         iconName: 'FlaskConical', dark: false, path: '/about/iqac',        enabled: true, order: 1 },
  { id: 2, title: 'Startups',        subtitle: 'Success stories of researchers',  iconName: 'Rocket',       dark: true,  path: '/startup-cell',       enabled: true, order: 2 },
  { id: 3, title: 'News',            subtitle: 'Panorama of Events',              iconName: 'Newspaper',    dark: false, path: '/news',               enabled: true, order: 3 },
  { id: 4, title: 'SGSITS Outreach', subtitle: 'Innovate. Inspire. Transform.',   iconName: 'Landmark',     dark: true,  path: '/about/institute',    enabled: true, order: 4 },
]
export default defaultHeroConfig

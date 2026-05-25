import type { HomeStatsConfig } from './types'

export const defaultHomeStatsConfig: HomeStatsConfig = {
  backgroundImage: '/assets/campus.jpg',
  fallbackImage: 'https://picsum.photos/seed/sgsitscampus/1600/600',
  items: [
    { val: '10,000+', label: 'Students' },
    { val: '600+',    label: 'Faculty' },
    { val: '700+',    label: 'Staff' },
    { val: '70+',     label: 'Years of Excellence' },
  ],
  enabled: true,
  order: 6,
}

export default defaultHomeStatsConfig

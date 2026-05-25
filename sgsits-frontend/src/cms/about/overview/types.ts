export interface AboutHighlight {
  iconName: string
  label: string
  value: string
  desc: string
}

export interface AboutOverviewConfig {
  narrativeParagraphs: string[]
  highlights: AboutHighlight[]
  affiliations: string[]
}

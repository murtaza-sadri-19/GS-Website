export interface AboutConfig {
  label: string
  heading: string
  accentText: string
  body: string
  primaryButton: { label: string; to: string }
  secondaryButton: { label: string; to: string }
  enabled: boolean
  order: number
}

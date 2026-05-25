export interface FaqItem {
  id: string
  question: string
  answer?: string | null
  contact?: { name: string; phone: string; email: string } | null
  defaultOpen?: boolean
}

export interface HomeFaqsConfig {
  heading: string
  subLabel: string
  viewAllLink: string
  items: FaqItem[]
  enabled: boolean
  order: number
}

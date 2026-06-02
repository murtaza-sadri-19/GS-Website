export interface FaqItem {
  id: string
  question: string
  answer: string
  contact?: string
  [key: string]: unknown
}

export interface HomeFaqsConfig {
  heading?: string
  subLabel?: string
  viewAllLink?: string
  items?: FaqItem[]
  enabled?: boolean
  order?: number
  [key: string]: unknown
}

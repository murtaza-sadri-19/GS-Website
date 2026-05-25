export interface AccreditationRecord {
  body: string
  grade: string
  validUpto: string
  cycle?: string
  naacScore?: string
}

export interface AccreditationData {
  about: string
  records: AccreditationRecord[]
  nbaPrograms: string[]
  nirf: { year: string; rank: string; category: string }[]
}

export interface InfrastructureItem {
  title: string
  description: string
  stats?: { label: string; value: string }[]
}

export interface InfrastructureData {
  summary: string
  campusArea: string
  builtUpArea: string
  items: InfrastructureItem[]
  additionalFacilities: string[]
}

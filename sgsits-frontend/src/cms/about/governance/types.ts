export type GovBodyCategory = 'Government' | 'University' | 'Industry' | 'Regulatory' | 'Faculty' | 'Institute'

export interface GoverningBodyMember {
  role: string
  name: string
  category: GovBodyCategory
}

export interface GoverningBodyData {
  description: string
  members: GoverningBodyMember[]
}

export interface AcademicCouncilMember {
  sno: number
  name: string
  designation: string
  category: string
}

export interface AcademicCouncilData {
  description: string
  members: AcademicCouncilMember[]
}

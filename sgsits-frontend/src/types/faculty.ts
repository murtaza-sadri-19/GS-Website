export type ProfileStatus = 'pending' | 'approved' | 'rejected'
export type ContentStatus = 'draft' | 'published' | 'archived'

export interface AdminRole {
  role: string
  period: string
  description?: string
}

export interface TeacherProfile {
  faculty_id: string
  name: string
  email: string
  phone: string
  designation: string
  qualification: string
  experience_years: number
  specialization: string
  subjects_taught: string[]
  bio: string
  profile_photo: string
  office_location: string
  linkedin_url: string
  google_scholar_url: string
  personal_website: string
  branch_id: string
  status: ProfileStatus
  last_submitted: string
  approval_note?: string
  // Extended profile fields
  phd_guided: number
  phd_ongoing: number
  pg_guided: number
  admin_roles: AdminRole[]
  memberships: string[]
}

export interface Publication {
  id: string
  title: string
  journal_name: string
  publication_year: number
  authors: string
  publication_link: string
  description: string
  citation_count: number
  venue_type: 'Journal' | 'Conference' | 'Book Chapter' | 'Patent'
  status: ContentStatus
}

export type ResearchStatus = 'Proposed' | 'Ongoing' | 'Completed' | 'On Hold'

export interface ResearchProject {
  id: string
  research_title: string
  research_area: string
  description: string
  start_year: number
  end_year?: number
  status: ResearchStatus
  funding_agency?: string
  funding_amount_lakh?: number
  collaborators: string[]
  publish_status: ContentStatus
}

export interface Qualification {
  id: string
  degree: string
  institution: string
  year: number
  specialization: string
  grade: string
  status: ContentStatus
}

export interface MarkRow {
  enrollment: string
  studentName: string
  co_marks: Record<string, number | null>
  isAbsent: boolean
}

export interface CourseOutcome {
  co_name: string
  max_marks: number
}

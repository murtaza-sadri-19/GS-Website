export interface CommitteeMember {
  role: string
  name: string
  dept?: string
}

export interface CommitteeData {
  name: string
  desc: string
  members: string
  membersList: CommitteeMember[]
}

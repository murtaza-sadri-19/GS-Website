export interface IQACActivity {
  title: string
  description: string
  date: string
}

export interface IQACData {
  about: string
  vision: string
  objectives: string[]
  recentActivities: IQACActivity[]
  chairpersonName: string
  chairpersonTitle: string
  coordinatorName: string
  coordinatorTitle: string
  coordinatorEmail: string
  coordinatorPhone: string
}

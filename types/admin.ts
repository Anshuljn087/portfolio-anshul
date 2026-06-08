export type ProjectStatus = 'published' | 'draft'
export type ProjectType = 'PERSONAL' | 'PROFESSIONAL'

export type AdminProject = {
  id: string
  title: string
  slug: string
  summary: string
  stack: string[]
  status: ProjectStatus
  featured: boolean
  repoUrl?: string
  liveUrl?: string
  createdAt: string
  updatedAt: string
}

export type ProjectFormValues = {
  title: string
  slug: string
  projectType: ProjectType
  isConfidential: boolean
  summary: string
  duration: string
  category?: string
  businessDomain?: string
  responsibilities?: string
  myContributions?: string
  keyAchievements?: string
  teamSize?: string
  content?: string
  stack: string
  status: ProjectStatus
  featured: boolean
  sortOrder?: number
  coverImage?: string
  galleryImages?: string
  githubUrl?: string
  liveUrl?: string
  architectureNotes?: string
  challenges?: string
  solutions?: string
  metrics?: string
  seo?: string
  previewImage?: string
  showGithub?: boolean
  showLiveUrl?: boolean
  showScreenshots?: boolean
  showMetrics?: boolean
  showArchitecture?: boolean
  showChallenges?: boolean
  showSolutions?: boolean
}

export type ExperienceFormValues = {
  company: string
  role: string
  slug: string
  location?: string
  summary: string
  startDate: string
  endDate?: string
  featured: boolean
}

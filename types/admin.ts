export type ProjectStatus = 'published' | 'draft'

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
  summary: string
  category?: string
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
}

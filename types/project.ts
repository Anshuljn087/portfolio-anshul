export type ProjectMetric = {
  label: string
  value: string
}

export type PublicProject = {
  id: string
  title: string
  slug: string
  summary: string
  category?: string | null
  coverImage: string | null
  galleryImages: string[]
  stack: string[]
  featured: boolean
  sortOrder: number
  githubUrl: string | null
  liveUrl: string | null
  architectureNotes: string | null
  challenges: string | null
  solutions: string | null
  metrics: unknown
  seo: unknown
  previewImage: string | null
}

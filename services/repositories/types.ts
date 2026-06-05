import type { Prisma } from '@prisma/client'

export type ProjectInput = {
  title: string
  slug: string
  summary: string
  category?: string | null
  content?: string
  coverImage?: string | null
  galleryImages: string[]
  stack: string[]
  status: 'DRAFT' | 'PUBLISHED'
  featured: boolean
  sortOrder?: number
  githubUrl?: string | null
  liveUrl?: string | null
  architectureNotes?: string | null
  challenges?: string | null
  solutions?: string | null
  metrics?: Prisma.InputJsonValue | null
  seo?: Prisma.InputJsonValue | null
  previewImage?: string | null
  publishedAt?: Date | null
}

export type BlogInput = {
  title: string
  slug: string
  excerpt: string
  content: string
  markdown?: string | null
  coverImage?: string | null
  status: 'DRAFT' | 'PUBLISHED'
  featured: boolean
  readingTime?: number
  seo?: Prisma.InputJsonValue | null
  publishedAt?: Date | null
  categoryIds?: string[]
  tags?: string[]
}

export type ExperienceInput = {
  company: string
  role: string
  slug: string
  location?: string | null
  summary: string
  startDate: Date
  endDate?: Date | null
  featured: boolean
}

export type SkillInput = {
  name: string
  slug: string
  category: string
  level?: number | null
  description?: string | null
  featured: boolean
}

export type SiteSettingsInput = {
  siteName: string
  siteDescription: string
  siteUrl: string
  email?: string | null
  socialLinks?: Prisma.InputJsonValue | null
  metadata?: Prisma.InputJsonValue | null
  profileImage?: string | null
  profileImageAlt?: string | null
  profileImageBlurDataUrl?: string | null
  profileImageWidth?: number | null
  profileImageHeight?: number | null
}

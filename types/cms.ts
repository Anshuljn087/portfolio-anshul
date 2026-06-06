import type { Prisma } from '@prisma/client'

export type SocialLink = {
  label: string
  href: string
}

export type SeoSettings = {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

export type SiteContent = {
  profileImage?: {
    src: string
    alt: string
    width?: number
    height?: number
    blurDataUrl?: string
  } | null
  hero: {
    eyebrow?: string
    title: string
    description: string
    primaryCtaLabel?: string
    primaryCtaHref?: string
    secondaryCtaLabel?: string
    secondaryCtaHref?: string
    tertiaryCtaLabel?: string
    tertiaryCtaHref?: string
    stats?: Array<{ label: string; value: string }>
  }
  about: {
    eyebrow?: string
    title: string
    description: string
    profileName?: string
    profileRole?: string
    body: string
  }
  navigation?: Array<{
    label: string
    href: string
    enabled?: boolean
  }>
  sections?: {
    about?: boolean
  }
  homepage?: {
    order?: Array<'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'blogs' | 'contact'>
    sections?: {
      hero?: boolean
      about?: boolean
      skills?: boolean
      experience?: boolean
      projects?: boolean
      blogs?: boolean
      contact?: boolean
    }
    limits?: {
      featuredProjects?: number
      featuredBlogs?: number
    }
    heroSection?: {
      badge?: string
      shippingBadge?: string
      title?: string
      description?: string
      focus?: string
      frontendLabel?: string
      frontendValue?: string
      backendLabel?: string
      backendValue?: string
      stats?: Array<{ label: string; value: string }>
    }
    aboutSection?: {
      eyebrow?: string
      title?: string
      description?: string
      profileName?: string
      profileRole?: string
      body?: string
    }
    projectsSection?: {
      eyebrow?: string
      title?: string
      description?: string
    }
    blogsSection?: {
      eyebrow?: string
      title?: string
      description?: string
    }
    contactSection?: {
      eyebrow?: string
      title?: string
      description?: string
      ctaLabel?: string
    }
  }
  contact: {
    eyebrow?: string
    title: string
    description: string
    email: string
    ctaLabel?: string
  }
  footer: {
    text?: string
  }
  seo: SeoSettings
  socialLinks: SocialLink[]
}

export type SiteSettingsMetadata = Prisma.JsonObject

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

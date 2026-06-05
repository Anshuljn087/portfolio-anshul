import type { Metadata } from 'next'
import type { SiteContent } from '@/types/cms'

type SeoFields = {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
}

const defaultImage = '/vercel.svg'

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

export function buildCanonicalUrl(pathname = '/') {
  return new URL(pathname, getSiteUrl()).toString()
}

export function buildBaseMetadata({
  site,
  pathname = '/',
  seo,
  image,
}: {
  site: Pick<SiteContent, 'seo'> | { seo: SiteContent['seo'] }
  pathname?: string
  seo?: SeoFields
  image?: string
}): Metadata {
  const title = seo?.title ?? site.seo.title
  const description = seo?.description ?? site.seo.description
  const canonicalUrl = seo?.canonicalUrl ?? buildCanonicalUrl(pathname)
  const ogImage = seo?.ogImage ?? image ?? defaultImage

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: 'Anshul Jain | Full Stack Engineer',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    keywords: seo?.keywords,
    robots: {
      index: seo?.noIndex ? false : true,
      follow: seo?.noIndex ? false : true,
      googleBot: {
        index: seo?.noIndex ? false : true,
        follow: seo?.noIndex ? false : true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

export function structuredDataJson(data: Record<string, unknown>) {
  return JSON.stringify(data)
}

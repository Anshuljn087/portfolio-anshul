import type { MetadataRoute } from 'next'
import { buildCanonicalUrl } from '@/services/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: buildCanonicalUrl('/sitemap.xml'),
    host: buildCanonicalUrl('/'),
  }
}

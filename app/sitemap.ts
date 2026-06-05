import type { MetadataRoute } from 'next'
import { listPublishedBlogs } from '@/services/blog-store'
import { projectRepository } from '@/services/repositories/project-repository'
import { buildCanonicalUrl } from '@/services/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, projects] = await Promise.all([
    listPublishedBlogs().catch(() => []),
    projectRepository.findMany().catch(() => []),
  ])

  const basePages: MetadataRoute.Sitemap = [
    {
      url: buildCanonicalUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: buildCanonicalUrl('/blogs'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: buildCanonicalUrl(`/blogs/${blog.slug}`),
    lastModified: blog.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: buildCanonicalUrl(`/projects/${project.slug}`),
    lastModified: project.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  return [...basePages, ...blogPages, ...projectPages]
}

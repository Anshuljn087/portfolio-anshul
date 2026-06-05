import MarkdownIt from 'markdown-it'
import { blogRepository } from '@/services/repositories/blog-repository'
import type { BlogWithRelations } from '@/services/repositories/blog-repository'
import type { BlogInput } from '@/services/repositories/types'

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function estimateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function toBlogInput(values: {
  title: string
  slug?: string
  excerpt: string
  contentHtml: string
  contentMarkdown?: string
  coverImage?: string
  status: 'draft' | 'published'
  featured?: boolean
  seo?: string
  tags?: string
}) {
  const markdown = values.contentMarkdown?.trim()
  const html = values.contentHtml.trim() || (markdown ? md.render(markdown) : '')
  const textSource = markdown ?? html
  const seo = values.seo?.trim() ? JSON.parse(values.seo) : null

  return {
    title: values.title.trim(),
    slug: slugify(values.slug ?? values.title),
    excerpt: values.excerpt.trim(),
    content: html,
    markdown: markdown ?? null,
    coverImage: values.coverImage?.trim() || null,
    status: values.status === 'published' ? 'PUBLISHED' : 'DRAFT',
    featured: values.featured ?? false,
    readingTime: estimateReadingTime(textSource),
    seo,
    publishedAt: values.status === 'published' ? new Date() : null,
    tags: (values.tags ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  } satisfies BlogInput
}

export async function listBlogs(): Promise<BlogWithRelations[]> {
  return blogRepository.findMany()
}

export async function listPublishedBlogs(): Promise<BlogWithRelations[]> {
  return blogRepository.findPublished()
}

export async function getBlog(id: string): Promise<BlogWithRelations | null> {
  return blogRepository.findById(id)
}

export async function getBlogBySlug(slug: string): Promise<BlogWithRelations | null> {
  return blogRepository.findBySlug(slug)
}

export async function createBlog(values: Parameters<typeof toBlogInput>[0]) {
  return blogRepository.create(toBlogInput(values))
}

export async function updateBlog(id: string, values: Parameters<typeof toBlogInput>[0]) {
  return blogRepository.update(id, toBlogInput(values))
}

export async function deleteBlog(id: string) {
  return blogRepository.softDelete(id)
}

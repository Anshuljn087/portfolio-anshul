export type BlogFormValues = {
  title: string
  slug: string
  excerpt: string
  contentHtml: string
  contentMarkdown?: string
  coverImage?: string
  status: 'published' | 'draft'
  featured: boolean
  tags?: string
  seo?: string
}

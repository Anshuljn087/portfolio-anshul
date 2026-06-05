import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createBlog, listBlogs } from '@/services/blog-store'

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(20),
  contentHtml: z.string().min(20),
  contentMarkdown: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['published', 'draft']),
  featured: z.coerce.boolean(),
  tags: z.string().optional(),
  seo: z.string().optional(),
})

export async function GET() {
  return NextResponse.json(await listBlogs())
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const parsed = schema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    contentHtml: formData.get('contentHtml'),
    contentMarkdown: formData.get('contentMarkdown') ?? '',
    coverImage: formData.get('coverImage') ?? '',
    status: formData.get('status'),
    featured: formData.get('featured') === 'on',
    tags: formData.get('tags') ?? '',
    seo: formData.get('seo') ?? '',
  })

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? 'Invalid data' }, { status: 400 })
  }

  const blog = await createBlog(parsed.data)
  return NextResponse.json(blog, { status: 201 })
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { deleteBlog, getBlog, updateBlog } from '@/services/blog-store'

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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await getBlog(id)
  if (!blog) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(blog)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  const blog = await updateBlog(id, parsed.data)
  return NextResponse.json(blog)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteBlog(id)
  return NextResponse.json({ ok: true })
}

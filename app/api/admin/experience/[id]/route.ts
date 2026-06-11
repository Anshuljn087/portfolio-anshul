import { NextResponse } from 'next/server'
import { z } from 'zod'
import { experienceRepository } from '@/services/repositories/experience-repository'

const schema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  slug: z.string().min(2),
  location: z.string().optional(),
  summary: z.string().min(20),
  startDate: z.string().min(4),
  endDate: z.string().optional(),
  featured: z.boolean(),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experience = await experienceRepository.findById(id)
  if (!experience) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(experience)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await experienceRepository.findById(id)
  if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  const formData = await request.formData()
  const parsed = schema.safeParse({
    company: formData.get('company'),
    role: formData.get('role'),
    slug: formData.get('slug'),
    location: formData.get('location') ?? '',
    summary: formData.get('summary'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate') ?? '',
    featured: formData.get('featured') === 'on',
  })

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? 'Invalid data' }, { status: 400 })
  }

  const experience = await experienceRepository.update(id, {
    company: parsed.data.company,
    role: parsed.data.role,
    slug: parsed.data.slug.trim().toLowerCase(),
    location: parsed.data.location?.trim() || null,
    summary: parsed.data.summary.trim(),
    startDate: new Date(parsed.data.startDate),
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    featured: parsed.data.featured,
  })

  return NextResponse.json(experience)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await experienceRepository.softDelete(id)
  return NextResponse.json({ ok: true })
}

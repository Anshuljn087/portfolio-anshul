import { NextResponse } from 'next/server'
import { z } from 'zod'
import { deleteSkill, getSkill, updateSkill } from '@/services/skills-store'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  level: z.coerce.number().int().min(0).max(5),
  sortBy: z.enum(['NAME', 'CATEGORY']).default('CATEGORY'),
  featured: z.boolean(),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const skill = await getSkill(id)
  if (!skill) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(skill)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contentType = request.headers.get('content-type') ?? ''
  const payload =
    contentType.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData())
  const parsed = schema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? 'Invalid data' }, { status: 400 })
  }

  const skill = await updateSkill(id, parsed.data)
  return NextResponse.json(skill)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteSkill(id)
  return NextResponse.json({ ok: true })
}

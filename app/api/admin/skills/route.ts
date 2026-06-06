import { NextResponse } from 'next/server'
import { z } from 'zod'
import { skillRepository } from '@/services/repositories/skill-repository'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  level: z.coerce.number().int().min(0).max(100),
  featured: z.coerce.boolean(),
})

export async function GET() {
  return NextResponse.json(await skillRepository.findMany())
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const parsed = schema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    category: formData.get('category'),
    level: formData.get('level') ?? '0',
    featured: formData.get('featured') === 'on',
  })

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? 'Invalid data' }, { status: 400 })
  }

  const skill = await skillRepository.create(parsed.data)
  return NextResponse.json(skill, { status: 201 })
}

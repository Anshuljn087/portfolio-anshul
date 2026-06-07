import { NextResponse } from 'next/server'
import { z } from 'zod'
import { skillRepository } from '@/services/repositories/skill-repository'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  level: z.coerce.number().int().min(0).max(5),
  sortBy: z.enum(['NAME', 'CATEGORY']).default('CATEGORY'),
  featured: z.boolean(),
})

export async function GET() {
  return NextResponse.json(await skillRepository.findMany())
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''
  const payload =
    contentType.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData())

  const parsed = z
    .union([schema, z.object({ skills: z.array(schema).min(1) })])
    .safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? 'Invalid data' }, { status: 400 })
  }

  if ('skills' in parsed.data) {
    const skills = await skillRepository.createMany(parsed.data.skills)
    return NextResponse.json(skills, { status: 201 })
  }

  const skill = await skillRepository.create(parsed.data)
  return NextResponse.json(skill, { status: 201 })
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { reorderProjects } from '@/services/project-store'

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)),
})

export async function PATCH(request: Request) {
  const body = await request.json()
  const parsed = reorderSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid order payload' }, { status: 400 })
  }

  await reorderProjects(parsed.data.ids)
  return NextResponse.json({ ok: true })
}

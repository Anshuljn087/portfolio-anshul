import { NextResponse } from 'next/server'
import { projectRepository } from '@/services/repositories/project-repository'

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await projectRepository.findById(id)
  if (!project) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  await projectRepository.toggleFeatured(id, !project.featured)
  return NextResponse.json({ ok: true })
}

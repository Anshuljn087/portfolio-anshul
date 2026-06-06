import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { resumeRepository } from '@/services/repositories/resume-repository'

const MAX_RESUME_HISTORY = 5

function resumeUploadDir() {
  return path.join(process.cwd(), 'public', 'uploads', 'resumes')
}

export async function GET() {
  const resumes = await resumeRepository.list()
  return NextResponse.json({ resumes })
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'Resume file is required' }, { status: 400 })
  }

  const altName = String(formData.get('name') ?? '').trim()
  const originalName = altName || file.name
  const extension = path.extname(file.name) || '.pdf'
  const safeBase = originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    || 'resume'
  const id = crypto.randomUUID()
  const fileName = `${safeBase}-${id}${extension}`.toLowerCase()
  const uploadDir = resumeUploadDir()
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, fileName)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  const uploaded = await resumeRepository.create({
    fileName,
    originalName,
    mimeType: file.type || 'application/pdf',
    size: file.size,
    filePath: `/uploads/resumes/${fileName}`,
    isCurrent: true,
  })

  await resumeRepository.setCurrent(uploaded.id)
  const pruned = await resumeRepository.pruneOld(MAX_RESUME_HISTORY)
  await Promise.all(
    pruned.map((asset) =>
      fs.rm(path.join(process.cwd(), 'public', asset.filePath.replace(/^\//, '')), { force: true }),
    ),
  )

  return NextResponse.json({
    ok: true,
    resume: uploaded,
  })
}

export async function PATCH(request: Request) {
  const formData = await request.formData()
  const id = String(formData.get('id') ?? '')
  if (!id) {
    return NextResponse.json({ message: 'Resume id is required' }, { status: 400 })
  }

  const resume = await resumeRepository.setCurrent(id)
  if (!resume) {
    return NextResponse.json({ message: 'Resume not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, resume })
}

export async function DELETE(request: Request) {
  const formData = await request.formData()
  const id = String(formData.get('id') ?? '')
  if (!id) {
    return NextResponse.json({ message: 'Resume id is required' }, { status: 400 })
  }

  const existing = await resumeRepository.findCurrent()
  const target = await resumeRepository.list().then((items) => items.find((item) => item.id === id) ?? null)
  if (!target) {
    return NextResponse.json({ message: 'Resume not found' }, { status: 404 })
  }

  const filePath = path.join(process.cwd(), 'public', target.filePath.replace(/^\//, ''))
  await fs.rm(filePath, { force: true })
  await resumeRepository.softDelete(id)

  if (existing?.id === id) {
    const remaining = await resumeRepository.list()
    const nextCurrent = remaining.find((item) => item.id !== id)
    if (nextCurrent) {
      await resumeRepository.setCurrent(nextCurrent.id)
    }
  }

  return NextResponse.json({ ok: true })
}

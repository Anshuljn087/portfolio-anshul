import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { processProfileImage } from '@/lib/profile-image'
import { siteSettingsRepository } from '@/services/repositories/site-settings-repository'

export async function GET() {
  const settings = await siteSettingsRepository.findLatest()
  return NextResponse.json({
    profileImage: settings?.profileImage ?? null,
    profileImageAlt: settings?.profileImageAlt ?? null,
    profileImageWidth: settings?.profileImageWidth ?? null,
    profileImageHeight: settings?.profileImageHeight ?? null,
    profileImageBlurDataUrl: settings?.profileImageBlurDataUrl ?? null,
  })
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'Image file is required' }, { status: 400 })
  }

  const left = Number(formData.get('cropLeft') ?? '')
  const top = Number(formData.get('cropTop') ?? '')
  const width = Number(formData.get('cropWidth') ?? '')
  const height = Number(formData.get('cropHeight') ?? '')
  const crop =
    Number.isFinite(left) &&
    Number.isFinite(top) &&
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width > 0 &&
    height > 0
      ? { left, top, width, height }
      : undefined

  const buffer = Buffer.from(await file.arrayBuffer())
  const processed = await processProfileImage(buffer, crop)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, 'profile.webp')
  await fs.writeFile(filePath, processed.buffer)

  const siteSettings = await siteSettingsRepository.upsertSingle({
    siteName: 'Anshul Portfolio',
    siteDescription: 'Premium engineering portfolio',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    email: 'hello@anshuljain.dev',
    socialLinks: null,
    metadata: null,
    profileImage: '/uploads/profile.webp',
    profileImageAlt: formData.get('alt')?.toString() || 'Anshul Jain profile portrait',
    profileImageBlurDataUrl: processed.blurDataUrl,
    profileImageWidth: processed.width,
    profileImageHeight: processed.height,
  })

  return NextResponse.json({
    ok: true,
    siteSettingsId: siteSettings.id,
    profileImage: '/uploads/profile.webp',
  })
}

export async function DELETE() {
  const settings = await siteSettingsRepository.findLatest()
  if (settings?.profileImage) {
    const filePath = path.join(process.cwd(), 'public', settings.profileImage.replace(/^\//, ''))
    await fs.rm(filePath, { force: true })
  }

  if (settings) {
    await siteSettingsRepository.update(settings.id, {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteUrl: settings.siteUrl,
      email: settings.email,
      socialLinks: settings.socialLinks,
      metadata: settings.metadata,
      profileImage: null,
      profileImageAlt: null,
      profileImageBlurDataUrl: null,
      profileImageWidth: null,
      profileImageHeight: null,
    })
  }

  return NextResponse.json({ ok: true })
}

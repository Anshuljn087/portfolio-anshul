import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { siteConfig } from '@/constants/site'
import { siteSettingsRepository } from '@/services/repositories/site-settings-repository'

function jsonError(message: string, status = 500) {
  return NextResponse.json({ message }, { status })
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function toJsonValue(value: unknown): Prisma.InputJsonValue | null {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => toJsonValue(item))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [
        key,
        toJsonValue(nestedValue),
      ]),
    ) as Prisma.InputJsonValue
  }

  return null
}

function readBlock(
  body: Record<string, unknown>,
  incomingMetadata: Record<string, unknown>,
  existingMetadata: Record<string, unknown>,
  key: string,
) {
  return {
    ...asRecord(existingMetadata[key]),
    ...asRecord(incomingMetadata[key]),
    ...asRecord(body[key]),
  }
}

export async function GET() {
  try {
    const siteSettings = await siteSettingsRepository.findLatest()

    if (!siteSettings) {
      return jsonError('Site settings not found', 404)
    }

    return NextResponse.json({ siteSettings })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load site settings'
    return jsonError(message, 500)
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const latest = await siteSettingsRepository.findLatest()
    const existingMetadata = asRecord(latest?.metadata)
    const incomingMetadata = asRecord(body.metadata)
    const existingHero = asRecord(existingMetadata.hero)
    const incomingHero = asRecord(incomingMetadata.hero)
    const heroFromBody = asRecord(body.hero ?? body.heroSection)
    const sectionsFromBody = asRecord(body.sections ?? body.sectionToggles)
    const homepageFromBody = asRecord(body.homepage)
    const navigationFromBody = asArray(body.navigation ?? body.navItems)
    const socialLinksFromBody = asArray(body.socialLinks ?? body.links)

    const heroTitle =
      body.heroHeading ??
      body.heroTitle ??
      heroFromBody.title ??
      incomingHero.title ??
      asRecord(existingMetadata.hero).title ??
      siteConfig.hero?.title ??
      undefined

    const heroEyebrow =
      body.heroEyebrow ??
      heroFromBody.eyebrow ??
      incomingHero.eyebrow ??
      existingHero.eyebrow ??
      undefined

    const heroDescription =
      body.heroDescription ??
      heroFromBody.description ??
      incomingHero.description ??
      existingHero.description ??
      undefined

    const normalizedMetadata = {
      ...existingMetadata,
      ...incomingMetadata,
      hero: {
        ...existingHero,
        ...incomingHero,
        ...heroFromBody,
        ...(heroTitle ? { title: heroTitle } : {}),
        ...(heroEyebrow ? { eyebrow: heroEyebrow } : {}),
        ...(heroDescription ? { description: heroDescription } : {}),
      },
      about: readBlock(body as Record<string, unknown>, incomingMetadata, existingMetadata, 'about'),
      contact: readBlock(body as Record<string, unknown>, incomingMetadata, existingMetadata, 'contact'),
      footer: readBlock(body as Record<string, unknown>, incomingMetadata, existingMetadata, 'footer'),
      seo: readBlock(body as Record<string, unknown>, incomingMetadata, existingMetadata, 'seo'),
      sections: {
        ...asRecord(existingMetadata.sections),
        ...asRecord(incomingMetadata.sections),
        ...sectionsFromBody,
      },
      homepage: {
        ...asRecord(existingMetadata.homepage),
        ...asRecord(incomingMetadata.homepage),
        ...homepageFromBody,
      },
      navigation:
        navigationFromBody.length > 0
          ? navigationFromBody
          : (incomingMetadata.navigation as unknown[] | undefined) ??
            (existingMetadata.navigation as unknown[] | undefined) ??
            [],
      socialLinks:
        socialLinksFromBody.length > 0
          ? socialLinksFromBody
          : (incomingMetadata.socialLinks as unknown[] | undefined) ??
            (existingMetadata.socialLinks as unknown[] | undefined) ??
            [],
    }

    const siteName =
      body.siteName ?? body.name ?? latest?.siteName ?? siteConfig.name
    const siteDescription =
      body.siteDescription ?? body.description ?? latest?.siteDescription ?? siteConfig.description
    const siteUrl = body.siteUrl ?? body.url ?? latest?.siteUrl ?? siteConfig.url

    if (!siteName || !siteDescription || !siteUrl) {
      return jsonError('Missing required site settings fields', 400)
    }

    const payload = {
      siteName,
      siteDescription,
      siteUrl,
      email: body.email ?? null,
      socialLinks: toJsonValue(body.socialLinks ?? normalizedMetadata.socialLinks),
      metadata: toJsonValue(normalizedMetadata),
      profileImage: body.profileImage ?? null,
      profileImageAlt: body.profileImageAlt ?? null,
      profileImageBlurDataUrl: body.profileImageBlurDataUrl ?? null,
      profileImageWidth: body.profileImageWidth ?? null,
      profileImageHeight: body.profileImageHeight ?? null,
    }

    const siteSettings = latest
      ? await siteSettingsRepository.update(latest.id, payload)
      : await siteSettingsRepository.create(payload)

    return NextResponse.json({ siteSettings })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save settings'
    const status =
      message.includes('does not exist') || message.includes('TableDoesNotExist') ? 503 : 500

    return jsonError(message, status)
  }
}

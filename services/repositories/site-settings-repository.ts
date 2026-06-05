import { getPrisma } from '@/lib/prisma'
import type { SiteSettingsInput } from '@/services/repositories/types'

export const siteSettingsRepository = {
  async findLatest() {
    try {
      const prisma = await getPrisma()
      return prisma.siteSettings.findFirst({
        where: { deletedAt: null },
        orderBy: { updatedAt: 'desc' },
      })
    } catch {
      return null
    }
  },
  async create(data: SiteSettingsInput) {
    const prisma = await getPrisma()
    return prisma.siteSettings.create({
      data: {
        ...data,
        socialLinks: data.socialLinks ?? undefined,
        metadata: data.metadata ?? undefined,
      },
    })
  },
  async upsertSingle(data: SiteSettingsInput) {
    const prisma = await getPrisma()
    const latest = await this.findLatest()
    if (latest) {
      return prisma.siteSettings.update({
        where: { id: latest.id },
        data: {
          ...data,
          socialLinks: data.socialLinks ?? undefined,
          metadata: data.metadata ?? undefined,
        },
      })
    }
    return prisma.siteSettings.create({
      data: {
        ...data,
        socialLinks: data.socialLinks ?? undefined,
        metadata: data.metadata ?? undefined,
      },
    })
  },
  async update(id: string, data: SiteSettingsInput) {
    const prisma = await getPrisma()
    return prisma.siteSettings.update({
      where: { id },
      data: {
        ...data,
        socialLinks: data.socialLinks ?? undefined,
        metadata: data.metadata ?? undefined,
      },
    })
  },
  async replaceProfileImage(data: SiteSettingsInput) {
    return this.upsertSingle(data)
  },
  async softDelete(id: string) {
    const prisma = await getPrisma()
    return prisma.siteSettings.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}

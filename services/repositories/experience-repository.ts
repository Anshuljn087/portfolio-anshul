import { getPrisma } from '@/lib/prisma'
import type { ExperienceInput } from '@/services/repositories/types'

export const experienceRepository = {
  async findMany() {
    try {
      const prisma = await getPrisma()
      return prisma.experience.findMany({
        where: { deletedAt: null },
        orderBy: [{ featured: 'desc' }, { startDate: 'desc' }],
      })
    } catch {
      return []
    }
  },
  async findBySlug(slug: string) {
    try {
      const prisma = await getPrisma()
      return prisma.experience.findFirst({
        where: { slug, deletedAt: null },
      })
    } catch {
      return null
    }
  },
  async create(data: ExperienceInput) {
    const prisma = await getPrisma()
    return prisma.experience.create({ data })
  },
  async update(id: string, data: ExperienceInput) {
    const prisma = await getPrisma()
    return prisma.experience.update({ where: { id }, data })
  },
  async softDelete(id: string) {
    const prisma = await getPrisma()
    return prisma.experience.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}

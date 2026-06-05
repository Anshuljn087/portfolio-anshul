import { getPrisma } from '@/lib/prisma'
import type { SkillInput } from '@/services/repositories/types'

export const skillRepository = {
  async findMany() {
    try {
      const prisma = await getPrisma()
      return prisma.skill.findMany({
        where: { deletedAt: null },
        orderBy: [{ featured: 'desc' }, { category: 'asc' }, { name: 'asc' }],
      })
    } catch {
      return []
    }
  },
  async findBySlug(slug: string) {
    try {
      const prisma = await getPrisma()
      return prisma.skill.findFirst({
        where: { slug, deletedAt: null },
      })
    } catch {
      return null
    }
  },
  async create(data: SkillInput) {
    const prisma = await getPrisma()
    return prisma.skill.create({ data })
  },
  async update(id: string, data: SkillInput) {
    const prisma = await getPrisma()
    return prisma.skill.update({ where: { id }, data })
  },
  async softDelete(id: string) {
    const prisma = await getPrisma()
    return prisma.skill.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}

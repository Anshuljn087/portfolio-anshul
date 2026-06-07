import { getPrisma } from '@/lib/prisma'
import type { SkillInput } from '@/services/repositories/types'

export const skillRepository = {
  async findMany() {
    try {
      const prisma = await getPrisma()
      return prisma.skill.findMany({
        where: { deletedAt: null },
        orderBy: [{ featured: 'desc' }, { sortBy: 'asc' }, { category: 'asc' }, { name: 'asc' }],
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
  async findBySlugs(slugs: string[]) {
    try {
      const prisma = await getPrisma()
      return prisma.skill.findMany({
        where: { slug: { in: slugs }, deletedAt: null },
        select: { slug: true },
      })
    } catch {
      return []
    }
  },
  async findById(id: string) {
    try {
      const prisma = await getPrisma()
      return prisma.skill.findFirst({
        where: { id, deletedAt: null },
      })
    } catch {
      return null
    }
  },
  async create(data: SkillInput) {
    const prisma = await getPrisma()
    return prisma.skill.create({ data })
  },
  async createMany(data: SkillInput[]) {
    const prisma = await getPrisma()
    return prisma.skill.createMany({
      data,
      skipDuplicates: true,
    })
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

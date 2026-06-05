import { getPrisma } from '@/lib/prisma'
import type { ProjectInput } from '@/services/repositories/types'

function projectWhere() {
  return { deletedAt: null }
}

export const projectRepository = {
  async findMany() {
    try {
      const prisma = await getPrisma()
      return prisma.project.findMany({
        where: projectWhere(),
        orderBy: [{ sortOrder: 'asc' }, { featured: 'desc' }, { updatedAt: 'desc' }],
      })
    } catch {
      return []
    }
  },
  async findFeatured() {
    try {
      const prisma = await getPrisma()
      return prisma.project.findMany({
        where: { ...projectWhere(), featured: true },
        orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
      })
    } catch {
      return []
    }
  },
  async findById(id: string) {
    try {
      const prisma = await getPrisma()
      return prisma.project.findFirst({
        where: { id, deletedAt: null },
      })
    } catch {
      return null
    }
  },
  async findBySlug(slug: string) {
    try {
      const prisma = await getPrisma()
      return prisma.project.findFirst({
        where: { slug, deletedAt: null },
      })
    } catch {
      return null
    }
  },
  async create(data: ProjectInput) {
    const prisma = await getPrisma()
    return prisma.project.create({ data })
  },
  async update(id: string, data: ProjectInput) {
    const prisma = await getPrisma()
    return prisma.project.update({
      where: { id },
      data,
    })
  },
  async softDelete(id: string) {
    const prisma = await getPrisma()
    return prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
  async toggleFeatured(id: string, featured: boolean) {
    const prisma = await getPrisma()
    return prisma.project.update({
      where: { id },
      data: { featured, updatedAt: new Date() },
    })
  },
  async reorder(ids: string[]) {
    const prisma = await getPrisma()
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { sortOrder: index, updatedAt: new Date() },
        })
      )
    )
  },
}

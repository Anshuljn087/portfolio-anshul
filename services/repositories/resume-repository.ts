import { getPrisma } from '@/lib/prisma'

export type ResumeRecord = {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  filePath: string
  isCurrent: boolean
  createdAt: Date
  updatedAt: Date
}

export const resumeRepository = {
  async list() {
    try {
      const prisma = await getPrisma()
      return prisma.resumeAsset.findMany({
        where: { deletedAt: null },
        orderBy: [{ isCurrent: 'desc' }, { createdAt: 'desc' }],
      })
    } catch {
      return []
    }
  },
  async findCurrent() {
    try {
      const prisma = await getPrisma()
      return prisma.resumeAsset.findFirst({
        where: { deletedAt: null, isCurrent: true },
        orderBy: { createdAt: 'desc' },
      })
    } catch {
      return null
    }
  },
  async create(data: {
    fileName: string
    originalName: string
    mimeType: string
    size: number
    filePath: string
    isCurrent?: boolean
  }) {
    const prisma = await getPrisma()
    return prisma.resumeAsset.create({ data: { ...data, isCurrent: data.isCurrent ?? false } })
  },
  async setCurrent(id: string) {
    const prisma = await getPrisma()
    const asset = await prisma.resumeAsset.findUnique({ where: { id } })
    if (!asset) return null

    await prisma.resumeAsset.updateMany({
      where: { deletedAt: null, isCurrent: true },
      data: { isCurrent: false },
    })

    return prisma.resumeAsset.update({
      where: { id },
      data: { isCurrent: true },
    })
  },
  async softDelete(id: string) {
    const prisma = await getPrisma()
    return prisma.resumeAsset.update({
      where: { id },
      data: { deletedAt: new Date(), isCurrent: false },
    })
  },
  async pruneOld(limit = 5) {
    const prisma = await getPrisma()
    const assets = await prisma.resumeAsset.findMany({
      where: { deletedAt: null },
      orderBy: [{ isCurrent: 'desc' }, { createdAt: 'desc' }],
      skip: limit,
    })
    if (assets.length === 0) return []
    await prisma.resumeAsset.updateMany({
      where: { id: { in: assets.map((asset) => asset.id) } },
      data: { deletedAt: new Date(), isCurrent: false },
    })
    return assets
  },
}

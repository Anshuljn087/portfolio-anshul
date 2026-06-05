import { getPrisma } from '@/lib/prisma'
import type { BlogInput } from '@/services/repositories/types'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const blogRepository = {
  async findMany() {
    try {
      const prisma = await getPrisma()
      return prisma.blog.findMany({
        where: { deletedAt: null },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
        include: { categories: { include: { category: true } }, tags: { include: { tag: true } } },
      })
    } catch {
      return []
    }
  },
  async findPublished() {
    try {
      const prisma = await getPrisma()
      return prisma.blog.findMany({
        where: { deletedAt: null, status: 'PUBLISHED' },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
        include: { categories: { include: { category: true } }, tags: { include: { tag: true } } },
      })
    } catch {
      return []
    }
  },
  async findById(id: string) {
    try {
      const prisma = await getPrisma()
      return prisma.blog.findFirst({
        where: { id, deletedAt: null },
        include: { categories: { include: { category: true } }, tags: { include: { tag: true } } },
      })
    } catch {
      return null
    }
  },
  async findBySlug(slug: string) {
    try {
      const prisma = await getPrisma()
      return prisma.blog.findFirst({
        where: { slug, deletedAt: null, status: 'PUBLISHED' },
        include: { categories: { include: { category: true } }, tags: { include: { tag: true } } },
      })
    } catch {
      return null
    }
  },
  async create(data: BlogInput) {
    const prisma = await getPrisma()
    const { categoryIds = [], tags = [], ...rest } = data

    return prisma.blog.create({
      data: {
        ...rest,
        seo: rest.seo ?? undefined,
        tags: {
          create: await Promise.all(
            tags.map(async (name) => {
              const slug = slugify(name)
              const tag = await prisma.blogTag.upsert({
                where: { slug },
                update: { name },
                create: { name, slug },
              })
              return { tagId: tag.id }
            })
          ),
        },
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    })
  },
  async update(id: string, data: BlogInput) {
    const prisma = await getPrisma()
    const { categoryIds = [], tags = [], ...rest } = data
    await prisma.blogCategoryOnBlog.deleteMany({ where: { blogId: id } })
    await prisma.blogTagOnBlog.deleteMany({ where: { blogId: id } })

    return prisma.blog.update({
      where: { id },
      data: {
        ...rest,
        seo: rest.seo ?? undefined,
        tags: {
          create: await Promise.all(
            tags.map(async (name) => {
              const slug = slugify(name)
              const tag = await prisma.blogTag.upsert({
                where: { slug },
                update: { name },
                create: { name, slug },
              })
              return { tagId: tag.id }
            })
          ),
        },
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
      },
    })
  },
  async softDelete(id: string) {
    const prisma = await getPrisma()
    return prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  },
}

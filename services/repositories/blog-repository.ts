import { Prisma } from '@prisma/client'
import { getPrisma } from '@/lib/prisma'
import type { BlogInput } from '@/services/repositories/types'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const blogWithRelationsInclude = Prisma.validator<Prisma.BlogInclude>()({
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
})

export type BlogWithRelations = Prisma.BlogGetPayload<{
  include: typeof blogWithRelationsInclude
}>

export const blogRepository = {
  async findMany(): Promise<BlogWithRelations[]> {
    try {
      const prisma = await getPrisma()
      return prisma.blog.findMany({
        where: { deletedAt: null },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
        include: blogWithRelationsInclude,
      })
    } catch {
      return []
    }
  },
  async findPublished(): Promise<BlogWithRelations[]> {
    try {
      const prisma = await getPrisma()
      return prisma.blog.findMany({
        where: { deletedAt: null, status: 'PUBLISHED' },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }],
        include: blogWithRelationsInclude,
      })
    } catch {
      return []
    }
  },
  async findById(id: string): Promise<BlogWithRelations | null> {
    try {
      const prisma = await getPrisma()
      return prisma.blog.findFirst({
        where: { id, deletedAt: null },
        include: blogWithRelationsInclude,
      })
    } catch {
      return null
    }
  },
  async findBySlug(slug: string): Promise<BlogWithRelations | null> {
    try {
      const prisma = await getPrisma()
      return prisma.blog.findFirst({
        where: { slug, deletedAt: null, status: 'PUBLISHED' },
        include: blogWithRelationsInclude,
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

import { PrismaPg } from '@prisma/adapter-pg'
import type { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

let prismaPromise: Promise<PrismaClient> | null = null

function createAdapter(databaseUrl: string) {
  const url = new URL(databaseUrl)

  return new PrismaPg({
    host: url.hostname,
    port: Number(url.port || 5432),
    database: url.pathname.replace(/^\//, ''),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password || ''),
    ssl: url.searchParams.get('ssl') === 'true' ? { rejectUnauthorized: false } : undefined,
  })
}

export async function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  if (!prismaPromise) {
    prismaPromise = import('@prisma/client').then(({ PrismaClient }) => {
      const databaseUrl = process.env.DATABASE_URL?.trim()

      if (!databaseUrl) {
        throw new Error('DATABASE_URL is not configured')
      }

      const adapter = createAdapter(databaseUrl)

      const client = new PrismaClient({
        adapter,
      })

      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client
      }

      return client
    })
  }

  return prismaPromise
}

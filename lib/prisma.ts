import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient as PrismaClientCtor } from '@prisma/client'

type PrismaClient = InstanceType<typeof PrismaClientCtor>

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

let prismaPromise: Promise<PrismaClient> | null = null

function createAdapter(databaseUrl: string) {
  const url = new URL(databaseUrl)
  const sslMode = url.searchParams.get('sslmode')
  const sslEnabled = url.searchParams.get('ssl') === 'true' || sslMode === 'require'

  return new PrismaPg({
    host: url.hostname,
    port: Number(url.port || 5432),
    database: url.pathname.replace(/^\//, ''),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password || ''),
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
  })
}

function isLocalDatabaseUrl(databaseUrl: string) {
  try {
    const url = new URL(databaseUrl)
    return ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
  } catch {
    return false
  }
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

      if (isLocalDatabaseUrl(databaseUrl)) {
        throw new Error(
          'DATABASE_URL points to a local database. Set a production database URL in Vercel environment variables.',
        )
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

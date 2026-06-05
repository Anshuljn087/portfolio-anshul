import { getPrisma } from '@/lib/prisma'

export async function withDatabase<T>(operation: (client: Awaited<ReturnType<typeof getPrisma>>) => Promise<T>) {
  const prisma = await getPrisma()
  return operation(prisma)
}

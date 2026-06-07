import * as XLSX from 'xlsx'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { skillRepository } from '@/services/repositories/skill-repository'

const rowSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  level: z.coerce.number().int().min(0).max(5).default(0),
  sortBy: z.enum(['NAME', 'CATEGORY']).default('CATEGORY'),
  featured: z.union([z.boolean(), z.string(), z.number()]).optional().default(false),
})

function asBoolean(value: unknown) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return ['true', 'yes', 'y', '1', 'on'].includes(normalized)
  }
  return false
}

function asNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') return Number(value)
  return 0
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'Please upload an Excel file' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    return NextResponse.json({ message: 'The workbook does not contain any sheets' }, { status: 400 })
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  const seenSlugs = new Set<string>()
  const skippedSlugs = new Set<string>()
  const prepared: Array<{
    name: string
    slug: string
    category: string
    level?: number | null
    sortBy?: 'NAME' | 'CATEGORY'
    featured: boolean
  }> = []

  for (const [index, row] of rows.entries()) {
  const parsed = rowSchema.safeParse({
      name: row.name ?? row.Name,
      slug: row.slug ?? row.Slug,
      category: row.category ?? row.Category,
      level: asNumber(row.level ?? row.Level ?? 0),
      sortBy: ((row.sortBy ?? row.SortBy ?? row['Sort By'] ?? 'CATEGORY') as string).toUpperCase() as
        | 'NAME'
        | 'CATEGORY',
      featured: asBoolean(row.featured ?? row.Featured ?? false),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { message: `Invalid row ${index + 2}: ${parsed.error.issues[0]?.message ?? 'Invalid data'}` },
        { status: 400 }
      )
    }

    const slug = parsed.data.slug.trim().toLowerCase()
    if (seenSlugs.has(slug)) {
      skippedSlugs.add(slug)
      continue
    }

    seenSlugs.add(slug)
    prepared.push({
      ...parsed.data,
      slug,
      name: parsed.data.name.trim(),
      category: parsed.data.category.trim(),
      sortBy: parsed.data.sortBy,
      featured: asBoolean(parsed.data.featured),
    })
  }

  const databaseDuplicates = new Set((await skillRepository.findBySlugs(prepared.map((item) => item.slug))).map((item) => item.slug))
  const insertable = prepared.filter((item) => !databaseDuplicates.has(item.slug))
  databaseDuplicates.forEach((slug) => skippedSlugs.add(slug))

  if (insertable.length === 0) {
    return NextResponse.json(
      {
        message: 'No new skills were found in the file',
        imported: 0,
        skipped: skippedSlugs.size,
        skippedSlugs: Array.from(skippedSlugs).slice(0, 12),
      },
      { status: 200 }
    )
  }

  const created = await skillRepository.createMany(insertable)
  return NextResponse.json(
    {
      imported: created.count,
      skipped: skippedSlugs.size,
      skippedSlugs: Array.from(skippedSlugs).slice(0, 12),
    },
    { status: 201 }
  )
}

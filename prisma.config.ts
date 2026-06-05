import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, env } from 'prisma/config'

function loadLocalEnvFiles() {
  if (process.env.DATABASE_URL) {
    return
  }

  for (const fileName of ['.env.local', '.env']) {
    const filePath = resolve(process.cwd(), fileName)
    if (!existsSync(filePath)) {
      continue
    }

    const content = readFileSync(filePath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex <= 0) {
        continue
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      if (key === 'DATABASE_URL' && !process.env.DATABASE_URL) {
        const rawValue = trimmed.slice(separatorIndex + 1).trim()
        process.env.DATABASE_URL = rawValue.replace(/^['"]|['"]$/g, '')
        return
      }
    }
  }
}

loadLocalEnvFiles()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
})

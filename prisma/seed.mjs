import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 'default-site-settings' },
    update: {},
    create: {
      id: 'default-site-settings',
      siteName: 'Anshul Jain',
      siteDescription: 'Full Stack Engineer portfolio and admin platform.',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      email: 'hello@anshuljain.dev',
      socialLinks: {
        github: 'https://github.com/anshuljain',
        linkedin: 'https://linkedin.com/in/anshuljain',
      },
      metadata: {
        theme: 'dark',
      },
    },
  })

  const skills = [
    { name: 'React', slug: 'react', category: 'Frontend', level: 5, featured: true },
    { name: 'Next.js', slug: 'nextjs', category: 'Frontend', level: 5, featured: true },
    { name: 'TypeScript', slug: 'typescript', category: 'Frontend', level: 5, featured: true },
    { name: 'Node.js', slug: 'nodejs', category: 'Backend', level: 4, featured: true },
    { name: 'NestJS', slug: 'nestjs', category: 'Backend', level: 4, featured: true },
    { name: 'AWS', slug: 'aws', category: 'Cloud', level: 4, featured: true },
    { name: 'Docker', slug: 'docker', category: 'DevOps', level: 4, featured: true },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'DB', level: 4, featured: true },
    { name: 'MongoDB', slug: 'mongodb', category: 'DB', level: 4, featured: true },
    { name: 'RAG', slug: 'rag', category: 'Gen AI', level: 4, featured: true },
    { name: 'Vector Search', slug: 'vector-search', category: 'Gen AI', level: 4, featured: true },
    { name: 'WebSockets', slug: 'websockets', category: 'Realtime', level: 4, featured: true },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: skill,
      create: skill,
    })
  }

  const experiences = [
    {
      company: 'Engineering-focused product teams',
      role: 'Full Stack Engineer',
      slug: 'full-stack-engineer-current',
      summary: 'Building scalable web products and shipping end-to-end features.',
      startDate: new Date('2022-01-01'),
      featured: true,
    },
  ]

  for (const experience of experiences) {
    await prisma.experience.upsert({
      where: { slug: experience.slug },
      update: experience,
      create: experience,
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

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
    { name: 'React', slug: 'react', category: 'Frontend', featured: true },
    { name: 'Next.js', slug: 'nextjs', category: 'Frontend', featured: true },
    { name: 'TypeScript', slug: 'typescript', category: 'Frontend', featured: true },
    { name: 'Node.js', slug: 'nodejs', category: 'Backend', featured: true },
    { name: 'NestJS', slug: 'nestjs', category: 'Backend', featured: true },
    { name: 'PostgreSQL', slug: 'postgresql', category: 'Data', featured: true },
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

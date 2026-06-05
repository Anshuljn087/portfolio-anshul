import type { SkillGroup, TimelineEntry } from '@/types/home'

export const profile = {
  name: 'Anshul Jain',
  role: 'Full Stack Engineer',
  experience: '6+ years',
  frontend: ['React', 'Next.js', 'TypeScript'],
  backend: ['Node.js', 'NestJS'],
  database: ['MySQL', 'PostgreSQL', 'MongoDB'],
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'NestJS', 'REST APIs', 'Authentication', 'System Design'],
  },
  {
    title: 'Data',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Schema Design', 'Query Optimization'],
  },
]

export const experienceTimeline: TimelineEntry[] = [
  {
    period: '2022 - Present',
    title: 'Full Stack Engineer',
    company: 'Engineering-focused product teams',
    description:
      'Building scalable web products, translating product goals into resilient interfaces, and shipping end-to-end features with measurable performance and usability improvements.',
  },
  {
    period: '2019 - 2022',
    title: 'Senior Frontend / Full Stack Engineer',
    company: 'High-growth digital products',
    description:
      'Led front-end architecture decisions, improved maintainability across shared systems, and partnered with backend teams to deliver dependable user experiences.',
  },
  {
    period: 'Earlier',
    title: 'Software Engineer',
    company: 'Product and platform delivery',
    description:
      'Worked across application layers, strengthened engineering practices, and developed a strong foundation in product thinking, delivery discipline, and code quality.',
  },
]

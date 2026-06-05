import { cache } from 'react'
import { blogRepository } from '@/services/repositories/blog-repository'
import { experienceRepository } from '@/services/repositories/experience-repository'
import { projectRepository } from '@/services/repositories/project-repository'
import { siteSettingsRepository } from '@/services/repositories/site-settings-repository'
import { skillRepository } from '@/services/repositories/skill-repository'
import type { SiteContent } from '@/types/cms'

export const defaultContent: SiteContent = {
  profileImage: null,
  hero: {
    eyebrow: 'Engineering Platform',
    title: 'Building scalable full-stack platforms, real-time systems, and AI-integrated applications.',
    description:
      '7+ years of MERN stack delivery across React, Next.js, Node.js, NestJS, MongoDB, PostgreSQL, AWS, microservices, WebSockets, RAG workflows, semantic search, and enterprise dashboards.',
    primaryCtaLabel: 'View Projects',
    primaryCtaHref: '#projects',
    secondaryCtaLabel: 'Download Resume',
    secondaryCtaHref: '/resume.pdf',
    tertiaryCtaLabel: 'Contact Me',
    tertiaryCtaHref: '#contact',
    stats: [
      { label: 'Experience', value: '7+ years' },
      { label: 'Focus', value: 'Enterprise systems' },
      { label: 'AI', value: 'RAG + Search' },
    ],
  },
  about: {
    eyebrow: 'About',
    title: 'I design and ship product systems that feel premium, scale well, and remain maintainable.',
    description:
      'The work spans frontend product architecture, backend services, data modeling, asynchronous workflows, realtime experiences, and AI integrations built for teams that need more than a surface-level portfolio.',
    profileName: 'Anshul Jain',
    profileRole: 'Full Stack Engineer',
    body:
      'I focus on dependable delivery, strong engineering systems, and thoughtful UX. My default approach is to reduce complexity, keep boundaries clear, and build interfaces and services that can evolve with the product.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Open to engineering roles and high-quality product collaborations.',
    description:
      'Reach out for full-stack product work, platform engineering, enterprise dashboards, or AI-enabled application builds.',
    email: 'hello@anshuljain.dev',
    ctaLabel: 'hello@anshuljain.dev',
  },
  footer: {
    text: 'Built as a dynamic CMS-powered portfolio.',
  },
  seo: {
    title: 'Anshul Jain | Full Stack Engineer',
    description:
      'A premium CMS-powered portfolio for a full-stack engineer building enterprise dashboards, realtime systems, microservices, and AI-integrated applications.',
    keywords: ['Full Stack Engineer', 'MERN', 'Next.js', 'NestJS', 'AI integrations'],
  },
  socialLinks: [
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
}

export const loadSiteContent = cache(async function loadSiteContent() {
  if (!process.env.DATABASE_URL) {
    return {
      content: defaultContent,
      siteSettings: null,
    }
  }

  try {
    const siteSettings = await siteSettingsRepository.findLatest()
    const metadata = (siteSettings?.metadata as Partial<SiteContent> | null | undefined) ?? {}

    return {
      content: {
        profileImage: siteSettings?.profileImage
          ? {
              src: siteSettings.profileImage,
              alt: siteSettings.profileImageAlt ?? 'Profile portrait',
              width: siteSettings.profileImageWidth ?? undefined,
              height: siteSettings.profileImageHeight ?? undefined,
              blurDataUrl: siteSettings.profileImageBlurDataUrl ?? undefined,
            }
          : metadata.profileImage ?? null,
        hero: { ...defaultContent.hero, ...metadata.hero },
        about: { ...defaultContent.about, ...metadata.about },
        contact: { ...defaultContent.contact, ...metadata.contact },
        footer: { ...defaultContent.footer, ...metadata.footer },
        seo: { ...defaultContent.seo, ...metadata.seo },
        socialLinks: metadata.socialLinks ?? defaultContent.socialLinks,
      },
      siteSettings,
    }
  } catch {
    return {
      content: defaultContent,
      siteSettings: null,
    }
  }
})

export const loadPortfolioCMS = cache(async function loadPortfolioCMS() {
  if (!process.env.DATABASE_URL) {
    return {
      content: defaultContent,
      projects: [],
      blogs: [],
      experiences: [],
      skills: [],
      siteSettings: null,
    }
  }

  try {
    const [siteContent, projects, blogs, experiences, skills] = await Promise.all([
      loadSiteContent(),
      projectRepository.findMany(),
      blogRepository.findMany(),
      experienceRepository.findMany(),
      skillRepository.findMany(),
    ])

    return {
      content: siteContent.content,
      projects,
      blogs,
      experiences,
      skills,
      siteSettings: siteContent.siteSettings,
    }
  } catch {
    return {
      content: defaultContent,
      projects: [],
      blogs: [],
      experiences: [],
      skills: [],
      siteSettings: null,
    }
  }
})

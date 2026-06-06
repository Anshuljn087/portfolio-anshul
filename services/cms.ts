import { blogRepository } from '@/services/repositories/blog-repository'
import { experienceRepository } from '@/services/repositories/experience-repository'
import { projectRepository } from '@/services/repositories/project-repository'
import { siteSettingsRepository } from '@/services/repositories/site-settings-repository'
import { skillRepository } from '@/services/repositories/skill-repository'
import { siteConfig } from '@/constants/site'
import type { SiteContent } from '@/types/cms'

type JsonRecord = Record<string, unknown>

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
  navigation: [
    { label: 'Home', href: '/', enabled: true },
    { label: 'Architecture', href: '/architecture', enabled: true },
    { label: 'Projects', href: '/projects', enabled: true },
    { label: 'Blogs', href: '/blogs', enabled: true },
    { label: 'Experience', href: '/#experience', enabled: true },
    { label: 'About', href: '/#about', enabled: true },
    { label: 'Contact', href: '/#contact', enabled: true },
  ],
  sections: { about: true },
  homepage: {
    order: ['hero', 'about', 'skills', 'experience', 'projects', 'blogs', 'contact'],
    sections: {
      hero: true,
      about: true,
      skills: true,
      experience: true,
      projects: true,
      blogs: true,
      contact: true,
    },
    limits: {
      featuredProjects: 3,
      featuredBlogs: 3,
    },
    heroSection: {
      badge: 'Engineering Platform',
      shippingBadge: '7+ years of shipping software',
      title: 'Building scalable full-stack platforms, real-time systems, and AI-integrated applications.',
      description:
        '7+ years of MERN stack delivery across React, Next.js, Node.js, NestJS, MongoDB, PostgreSQL, AWS, microservices, WebSockets, RAG workflows, semantic search, and enterprise dashboards.',
      focus:
        'Full-stack product engineering with a premium systems mindset, pairing crisp user experiences with scalable backend architecture and AI-native workflows.',
      frontendLabel: 'Frontend',
      frontendValue: 'React / Next.js / TypeScript',
      backendLabel: 'Backend',
      backendValue: 'Node.js / NestJS / Express.js',
    },
    projectsSection: {
      eyebrow: 'Featured Projects',
      title: 'Selected work from the live project library.',
      description:
        'Projects are fetched dynamically from the database so the public portfolio always reflects the latest admin changes.',
    },
    blogsSection: {
      eyebrow: 'Latest Blogs',
      title: 'Recent engineering writing.',
      description:
        'Thoughtful breakdowns on MERN architecture, AI systems, RAG, performance, WebSockets, and scalable backend patterns.',
    },
    contactSection: {
      eyebrow: 'Contact',
      title: 'Open to engineering roles and high-quality product collaborations.',
      description:
        'Reach out for full-stack product work, platform engineering, enterprise dashboards, or AI-enabled application builds.',
    },
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

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {}
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function asStringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback
}

function asNavigation(value: unknown) {
  if (!Array.isArray(value)) return defaultContent.navigation
  return value
    .map((item) => {
      const record = asRecord(item)
      return {
        label: asString(record.label),
        href: asString(record.href),
        enabled: asBoolean(record.enabled, true),
      }
    })
    .filter((item) => item.label && item.href)
}

function asStats(value: unknown) {
  if (!Array.isArray(value)) return defaultContent.hero.stats
  return value
    .map((item) => {
      const record = asRecord(item)
      return {
        label: asString(record.label),
        value: asString(record.value),
      }
    })
    .filter((item) => item.label && item.value)
}

function normalizeContent(metadata: JsonRecord, siteSettings: JsonRecord | null | undefined): SiteContent {
  const direct = siteSettings ?? {}
  const hero = asRecord(metadata.hero)
  const about = asRecord(metadata.about)
  const contact = asRecord(metadata.contact)
  const footer = asRecord(metadata.footer)
  const seo = asRecord(metadata.seo)
  const sections = asRecord(metadata.sections)
  const homepage = asRecord(metadata.homepage)
  const homepageSections = asRecord(homepage.sections)
  const homepageLimits = asRecord(homepage.limits)
  const heroSection = asRecord(homepage.heroSection)
  const aboutSection = asRecord(homepage.aboutSection)
  const projectsSection = asRecord(homepage.projectsSection)
  const blogsSection = asRecord(homepage.blogsSection)
  const contactSection = asRecord(homepage.contactSection)

  return {
    profileImage:
      typeof direct.profileImage === 'string' && direct.profileImage
        ? {
            src: direct.profileImage,
            alt: asString(direct.profileImageAlt, 'Profile portrait'),
            width: typeof direct.profileImageWidth === 'number' ? direct.profileImageWidth : undefined,
            height: typeof direct.profileImageHeight === 'number' ? direct.profileImageHeight : undefined,
            blurDataUrl:
              typeof direct.profileImageBlurDataUrl === 'string' ? direct.profileImageBlurDataUrl : undefined,
          }
        : metadata.profileImage ?? null,
    hero: {
      ...defaultContent.hero,
      eyebrow: asString(hero.eyebrow, defaultContent.hero.eyebrow),
      title: asString(hero.title, siteConfig.hero.title),
      description: asString(hero.description, defaultContent.hero.description),
      primaryCtaLabel: asString(hero.primaryCtaLabel, defaultContent.hero.primaryCtaLabel),
      primaryCtaHref: asString(hero.primaryCtaHref, defaultContent.hero.primaryCtaHref),
      secondaryCtaLabel: asString(hero.secondaryCtaLabel, defaultContent.hero.secondaryCtaLabel),
      secondaryCtaHref: asString(hero.secondaryCtaHref, defaultContent.hero.secondaryCtaHref),
      tertiaryCtaLabel: asString(hero.tertiaryCtaLabel, defaultContent.hero.tertiaryCtaLabel),
      tertiaryCtaHref: asString(hero.tertiaryCtaHref, defaultContent.hero.tertiaryCtaHref),
      stats: asStats(hero.stats) ?? defaultContent.hero.stats,
    },
    about: {
      ...defaultContent.about,
      eyebrow: asString(about.eyebrow, defaultContent.about.eyebrow),
      title: asString(about.title, defaultContent.about.title),
      description: asString(about.description, defaultContent.about.description),
      profileName: asString(about.profileName, defaultContent.about.profileName),
      profileRole: asString(about.profileRole, defaultContent.about.profileRole),
      body: asString(about.body, defaultContent.about.body),
    },
    navigation: asNavigation(metadata.navigation),
    sections: {
      ...defaultContent.sections,
      about: asBoolean(sections.about, defaultContent.sections.about),
    },
    homepage: {
      order: Array.isArray(homepage.order)
        ? homepage.order.filter((item): item is NonNullable<SiteContent['homepage']>['order'][number] =>
            typeof item === 'string',
          )
        : defaultContent.homepage?.order,
      sections: {
        hero: asBoolean(homepageSections.hero, defaultContent.homepage?.sections?.hero),
        about: asBoolean(homepageSections.about, defaultContent.homepage?.sections?.about),
        skills: asBoolean(homepageSections.skills, defaultContent.homepage?.sections?.skills),
        experience: asBoolean(
          homepageSections.experience,
          defaultContent.homepage?.sections?.experience,
        ),
        projects: asBoolean(homepageSections.projects, defaultContent.homepage?.sections?.projects),
        blogs: asBoolean(homepageSections.blogs, defaultContent.homepage?.sections?.blogs),
        contact: asBoolean(homepageSections.contact, defaultContent.homepage?.sections?.contact),
      },
      limits: {
        featuredProjects:
          typeof homepageLimits.featuredProjects === 'number'
            ? homepageLimits.featuredProjects
            : defaultContent.homepage?.limits?.featuredProjects,
        featuredBlogs:
          typeof homepageLimits.featuredBlogs === 'number'
            ? homepageLimits.featuredBlogs
            : defaultContent.homepage?.limits?.featuredBlogs,
      },
      heroSection: {
        badge: asString(heroSection.badge, defaultContent.homepage?.heroSection?.badge),
        shippingBadge: asString(
          heroSection.shippingBadge,
          defaultContent.homepage?.heroSection?.shippingBadge,
        ),
        title: asString(heroSection.title, defaultContent.homepage?.heroSection?.title),
        description: asString(
          heroSection.description,
          defaultContent.homepage?.heroSection?.description,
        ),
        focus: asString(heroSection.focus, defaultContent.homepage?.heroSection?.focus),
        frontendLabel: asString(
          heroSection.frontendLabel,
          defaultContent.homepage?.heroSection?.frontendLabel,
        ),
        frontendValue: asString(
          heroSection.frontendValue,
          defaultContent.homepage?.heroSection?.frontendValue,
        ),
        backendLabel: asString(
          heroSection.backendLabel,
          defaultContent.homepage?.heroSection?.backendLabel,
        ),
        backendValue: asString(
          heroSection.backendValue,
          defaultContent.homepage?.heroSection?.backendValue,
        ),
        stats: asStats(heroSection.stats) ?? defaultContent.homepage?.heroSection?.stats,
      },
      aboutSection: {
        eyebrow: asString(aboutSection.eyebrow, defaultContent.homepage?.aboutSection?.eyebrow),
        title: asString(aboutSection.title, defaultContent.homepage?.aboutSection?.title),
        description: asString(
          aboutSection.description,
          defaultContent.homepage?.aboutSection?.description,
        ),
        profileName: asString(
          aboutSection.profileName,
          defaultContent.homepage?.aboutSection?.profileName,
        ),
        profileRole: asString(
          aboutSection.profileRole,
          defaultContent.homepage?.aboutSection?.profileRole,
        ),
        body: asString(aboutSection.body, defaultContent.homepage?.aboutSection?.body),
      },
      projectsSection: {
        eyebrow: asString(
          projectsSection.eyebrow,
          defaultContent.homepage?.projectsSection?.eyebrow,
        ),
        title: asString(projectsSection.title, defaultContent.homepage?.projectsSection?.title),
        description: asString(
          projectsSection.description,
          defaultContent.homepage?.projectsSection?.description,
        ),
      },
      blogsSection: {
        eyebrow: asString(blogsSection.eyebrow, defaultContent.homepage?.blogsSection?.eyebrow),
        title: asString(blogsSection.title, defaultContent.homepage?.blogsSection?.title),
        description: asString(
          blogsSection.description,
          defaultContent.homepage?.blogsSection?.description,
        ),
      },
      contactSection: {
        eyebrow: asString(
          contactSection.eyebrow,
          defaultContent.homepage?.contactSection?.eyebrow,
        ),
        title: asString(contactSection.title, defaultContent.homepage?.contactSection?.title),
        description: asString(
          contactSection.description,
          defaultContent.homepage?.contactSection?.description,
        ),
        ctaLabel: asString(contactSection.ctaLabel, defaultContent.homepage?.contactSection?.ctaLabel),
      },
    },
    contact: {
      ...defaultContent.contact,
      eyebrow: asString(contact.eyebrow, defaultContent.contact.eyebrow),
      title: asString(contact.title, defaultContent.contact.title),
      description: asString(contact.description, defaultContent.contact.description),
      email: asString(contact.email, defaultContent.contact.email),
      ctaLabel: asString(contact.ctaLabel, defaultContent.contact.ctaLabel),
    },
    footer: {
      ...defaultContent.footer,
      text: asString(footer.text, defaultContent.footer.text),
    },
    seo: {
      ...defaultContent.seo,
      title: asString(seo.title, defaultContent.seo.title),
      description: asString(seo.description, defaultContent.seo.description),
      keywords: asStringArray(seo.keywords, defaultContent.seo.keywords),
    },
    socialLinks: asNavigation(metadata.socialLinks).map(({ label, href }) => ({ label, href })),
  }
}

export async function loadSiteContent() {
  if (!process.env.DATABASE_URL) {
    return {
      content: defaultContent,
      siteSettings: null,
    }
  }

  try {
    const siteSettings = await siteSettingsRepository.findLatest()
    const metadata = asRecord(siteSettings?.metadata)
    const content = normalizeContent(metadata, siteSettings as JsonRecord | null | undefined)

    return {
      content,
      siteSettings,
    }
  } catch {
    return {
      content: defaultContent,
      siteSettings: null,
    }
  }
}

export async function loadPortfolioCMS() {
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
    const [siteContentResult, projectsResult, blogsResult, experiencesResult, skillsResult] =
      await Promise.allSettled([
        loadSiteContent(),
        projectRepository.findMany(),
        blogRepository.findMany(),
        experienceRepository.findMany(),
        skillRepository.findMany(),
      ])

    const siteContent =
      siteContentResult.status === 'fulfilled'
        ? siteContentResult.value
        : { content: defaultContent, siteSettings: null }
    const projects = projectsResult.status === 'fulfilled' ? projectsResult.value : []
    const blogs = blogsResult.status === 'fulfilled' ? blogsResult.value : []
    const experiences = experiencesResult.status === 'fulfilled' ? experiencesResult.value : []
    const skills = skillsResult.status === 'fulfilled' ? skillsResult.value : []

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
}

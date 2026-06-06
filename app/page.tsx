import { AboutSection } from '../sections/home/about-section'
import { ContactSection } from '../sections/home/contact-section'
import { ExperienceSection } from '../sections/home/experience-section'
import { HeroSection } from '../sections/home/hero-section'
import { ProjectsSection } from '../sections/home/projects-section'
import { SkillsSection } from '../sections/home/skills-section'
import { LatestBlogsSection } from '../sections/home/latest-blogs-section'
import { defaultContent, loadPortfolioCMS } from '@/services/cms'
import { buildBaseMetadata, structuredDataJson } from '@/services/seo'
import type { Metadata } from 'next'
import { listPublishedBlogs } from '@/services/blog-store'
import type { SocialLink } from '@/types/cms'
import type { PublicProject } from '@/types/project'

const HOME_SECTION_KEYS = ['hero', 'about', 'skills', 'experience', 'projects', 'blogs', 'contact'] as const

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await loadPortfolioCMS()
  return buildBaseMetadata({
    site: content,
    pathname: '/',
    seo: {
      title: content.seo.title,
      description: content.seo.description,
      keywords: content.seo.keywords,
      canonicalUrl: '/',
    },
  })
}

export default async function Home() {
  const [cmsResult, blogsResult] = await Promise.allSettled([loadPortfolioCMS(), listPublishedBlogs()])
  const { content, projects, experiences, skills } =
    cmsResult.status === 'fulfilled'
      ? cmsResult.value
      : {
          content: defaultContent,
          projects: [],
          experiences: [],
          skills: [],
        }

  const blogs = blogsResult.status === 'fulfilled' ? blogsResult.value : []
  const homepage = content.homepage ?? defaultContent.homepage
  const sectionVisibility = homepage?.sections ?? {}
  const sectionOrder = homepage?.order?.length ? homepage.order : HOME_SECTION_KEYS
  const featuredProjectLimit = homepage?.limits?.featuredProjects ?? 3
  const featuredBlogLimit = homepage?.limits?.featuredBlogs ?? 3
  const personJsonLd = structuredDataJson({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Anshul Jain',
    jobTitle: 'Full Stack Engineer',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    sameAs: content.socialLinks.map((link: SocialLink) => link.href),
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      {sectionOrder.map((sectionKey) => {
        if (sectionVisibility[sectionKey] === false) {
          return null
        }

        switch (sectionKey) {
          case 'hero':
            return <HeroSection key={sectionKey} content={{ ...content.hero, ...homepage?.heroSection }} />
          case 'about':
            return (
              <AboutSection
                key={sectionKey}
                content={{ ...content.about, ...homepage?.aboutSection }}
              />
            )
          case 'skills':
            return <SkillsSection key={sectionKey} skills={skills} />
          case 'experience':
            return <ExperienceSection key={sectionKey} experiences={experiences} />
          case 'projects':
            return (
              <ProjectsSection
                key={sectionKey}
                projects={projects.filter((project: PublicProject) => project.featured).slice(0, featuredProjectLimit)}
                content={homepage?.projectsSection ?? {}}
              />
            )
          case 'blogs':
            return (
              <LatestBlogsSection
                key={sectionKey}
                blogs={blogs.slice(0, featuredBlogLimit)}
                content={homepage?.blogsSection ?? {}}
              />
            )
          case 'contact':
            return (
              <ContactSection
                key={sectionKey}
                content={{ ...content.contact, ...homepage?.contactSection }}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}

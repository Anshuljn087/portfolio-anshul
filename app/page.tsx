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
      <HeroSection content={content.hero} />
      <AboutSection content={content.about} />
      <SkillsSection skills={skills} />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection
        projects={projects.filter((project: PublicProject) => project.featured).slice(0, 3)}
      />
      <LatestBlogsSection blogs={blogs.slice(0, 3)} />
      <ContactSection content={content.contact} />
    </>
  )
}

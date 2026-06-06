import { SiteSettingsForm } from '@/components/admin/site-settings-form'
import { loadSiteContent } from '@/services/cms'

export default async function SiteAdminPage() {
  const { content } = await loadSiteContent()

  return (
    <SiteSettingsForm
      initialValues={{
        siteName: content.seo.title ?? 'Anshul Portfolio',
        siteDescription:
          content.seo.description ??
          'A premium CMS-powered portfolio for a full-stack engineer building enterprise dashboards, realtime systems, microservices, and AI-integrated applications.',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
        email: content.contact.email ?? 'hello@anshuljain.dev',
        navigation: (content.navigation ?? []).map((item) => ({
          label: item.label,
          href: item.href,
          enabled: item.enabled ?? true,
        })),
        homepage: {
          order: (content.homepage?.order ?? []).join('\n'),
          sections: {
            hero: content.homepage?.sections?.hero ?? true,
            about: content.homepage?.sections?.about ?? true,
            skills: content.homepage?.sections?.skills ?? true,
            experience: content.homepage?.sections?.experience ?? true,
            projects: content.homepage?.sections?.projects ?? true,
            blogs: content.homepage?.sections?.blogs ?? true,
            contact: content.homepage?.sections?.contact ?? true,
          },
          limits: {
            featuredProjects: content.homepage?.limits?.featuredProjects ?? 3,
            featuredBlogs: content.homepage?.limits?.featuredBlogs ?? 3,
          },
          heroSection: {
            badge: content.homepage?.heroSection?.badge ?? 'Engineering Platform',
            shippingBadge:
              content.homepage?.heroSection?.shippingBadge ?? '7+ years of shipping software',
            title:
              content.homepage?.heroSection?.title ??
              'Building scalable full-stack platforms, real-time systems, and AI-integrated applications.',
            description:
              content.homepage?.heroSection?.description ??
              '7+ years of MERN stack delivery across React, Next.js, Node.js, NestJS, MongoDB, PostgreSQL, AWS, microservices, WebSockets, RAG workflows, semantic search, and enterprise dashboards.',
            focus:
              content.homepage?.heroSection?.focus ??
              'Full-stack product engineering with a premium systems mindset, pairing crisp user experiences with scalable backend architecture and AI-native workflows.',
            frontendLabel: content.homepage?.heroSection?.frontendLabel ?? 'Frontend',
            frontendValue:
              content.homepage?.heroSection?.frontendValue ?? 'React / Next.js / TypeScript',
            backendLabel: content.homepage?.heroSection?.backendLabel ?? 'Backend',
            backendValue:
              content.homepage?.heroSection?.backendValue ?? 'Node.js / NestJS / Express.js',
          },
          aboutSection: {
            eyebrow: content.homepage?.aboutSection?.eyebrow ?? 'About',
            title:
              content.homepage?.aboutSection?.title ??
              'I design and ship product systems that feel premium, scale well, and remain maintainable.',
            description:
              content.homepage?.aboutSection?.description ??
              'The work spans frontend product architecture, backend services, data modeling, asynchronous workflows, realtime experiences, and AI integrations built for teams that need more than a surface-level portfolio.',
            profileName: content.homepage?.aboutSection?.profileName ?? 'Anshul Jain',
            profileRole: content.homepage?.aboutSection?.profileRole ?? 'Full Stack Engineer',
            body:
              content.homepage?.aboutSection?.body ??
              'I focus on dependable delivery, strong engineering systems, and thoughtful UX. My default approach is to reduce complexity, keep boundaries clear, and build interfaces and services that can evolve with the product.',
          },
          projectsSection: {
            eyebrow: content.homepage?.projectsSection?.eyebrow ?? 'Featured Projects',
            title:
              content.homepage?.projectsSection?.title ??
              'Selected work from the live project library.',
            description:
              content.homepage?.projectsSection?.description ??
              'Projects are fetched dynamically from the database so the public portfolio always reflects the latest admin changes.',
          },
          blogsSection: {
            eyebrow: content.homepage?.blogsSection?.eyebrow ?? 'Latest Blogs',
            title: content.homepage?.blogsSection?.title ?? 'Recent engineering writing.',
            description:
              content.homepage?.blogsSection?.description ??
              'Thoughtful breakdowns on MERN architecture, AI systems, RAG, performance, WebSockets, and scalable backend patterns.',
          },
          contactSection: {
            eyebrow: content.homepage?.contactSection?.eyebrow ?? 'Contact',
            title:
              content.homepage?.contactSection?.title ??
              'Open to engineering roles and high-quality product collaborations.',
            description:
              content.homepage?.contactSection?.description ??
              'Reach out for full-stack product work, platform engineering, enterprise dashboards, or AI-enabled application builds.',
            ctaLabel: content.homepage?.contactSection?.ctaLabel ?? content.contact.ctaLabel ?? content.contact.email,
          },
        },
        socialLinks: content.socialLinks,
        profileImage: content.profileImage?.src ?? null,
        profileImageAlt: content.profileImage?.alt ?? null,
        profileImageBlurDataUrl: content.profileImage?.blurDataUrl ?? null,
      }}
    />
  )
}

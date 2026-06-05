import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { projectRepository } from '@/services/repositories/project-repository'
import { buildBaseMetadata, structuredDataJson, buildCanonicalUrl } from '@/services/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await projectRepository.findBySlug(slug)
  if (!project) return {}

  const seo = (project.seo as { title?: string; description?: string } | null) ?? {}
  return buildBaseMetadata({
    site: {
      seo: {
        title: seo.title ?? project.title,
        description: seo.description ?? project.summary,
        keywords: [],
      },
    },
    pathname: `/projects/${slug}`,
    seo: {
      title: seo.title ?? project.title,
      description: seo.description ?? project.summary,
      canonicalUrl: buildCanonicalUrl(`/projects/${slug}`),
      ogImage: project.previewImage ?? undefined,
    },
  })
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await projectRepository.findBySlug(slug)

  if (!project || project.deletedAt) {
    notFound()
  }
  const projectJsonLd = structuredDataJson({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: buildCanonicalUrl(`/projects/${slug}`),
    image: project.previewImage ? [project.previewImage] : undefined,
    author: {
      '@type': 'Person',
      name: 'Anshul Jain',
    },
  })

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: projectJsonLd }} />
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Project Preview</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{project.summary}</p>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-medium">Architecture Notes</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {project.architectureNotes ?? 'No architecture notes provided.'}
          </p>
          <h3 className="mt-8 text-lg font-medium">Challenges</h3>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {project.challenges ?? 'No challenges provided.'}
          </p>
          <h3 className="mt-8 text-lg font-medium">Solutions</h3>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {project.solutions ?? 'No solutions provided.'}
          </p>
        </section>
        <aside className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Technology</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(project.stack as string[]).map((item: string) => (
                <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Links</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {project.githubUrl ? <a href={project.githubUrl}>GitHub</a> : null}
              {project.liveUrl ? <a href={project.liveUrl}>Live</a> : null}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

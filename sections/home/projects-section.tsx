import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { AnimatedSection } from '@/sections/home/animated-section'
import type { PublicProject } from '@/types/project'

export function ProjectsSection({
  projects,
  content,
}: {
  projects: PublicProject[]
  content: {
    eyebrow?: string
    title?: string
    description?: string
  }
}) {
  const hasProjects = projects.length > 0

  return (
    <SectionWrapper
      eyebrow={content.eyebrow ?? 'Featured Projects'}
      title={content.title ?? 'Selected work from the live project library.'}
      description={
        content.description ??
        'Projects are fetched dynamically from the database so the public portfolio always reflects the latest admin changes.'
      }
      id="projects"
    >
      <AnimatedSection>
        {hasProjects ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/8 to-white/[0.03] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-white/10 bg-white/[0.03]">
                  {project.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-medium text-foreground">{project.title}</h3>
                    <ExternalLink className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.githubUrl ? (
                      <Link
                        href={project.githubUrl}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                      >
                        GitHub
                      </Link>
                    ) : null}
                    {project.liveUrl ? (
                      <Link
                        href={project.liveUrl}
                        className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background transition-transform hover:-translate-y-0.5"
                      >
                        Live
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-8 text-sm text-muted-foreground backdrop-blur-xl">
            No featured projects are available yet.
          </div>
        )}
      </AnimatedSection>
    </SectionWrapper>
  )
}

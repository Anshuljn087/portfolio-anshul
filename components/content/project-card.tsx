import Link from 'next/link'
import type { PublicProject } from '@/types/project'

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/8 to-white/[0.03] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
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
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {project.category ?? 'Project'}
            </p>
            <h3 className="mt-2 text-xl font-medium text-foreground">{project.title}</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            Case Study
          </span>
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
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background transition-transform hover:-translate-y-0.5"
          >
            View Case Study
          </Link>
        </div>
      </div>
    </article>
  )
}

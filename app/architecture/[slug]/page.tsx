import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArchitectureDiagram } from '@/components/architecture/architecture-diagram'
import { architectureCaseStudies } from '@/constants/architecture'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = architectureCaseStudies.find((item) => item.slug === slug)
  if (!study) return {}
  return {
    title: study.title,
    description: study.summary,
  }
}

export default async function ArchitectureCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = architectureCaseStudies.find((item) => item.slug === slug)
  if (!study) notFound()

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Architecture Case Study</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {study.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">{study.summary}</p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        {study.metrics.map((metric) => (
          <article key={metric.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
            <h2 className="mt-3 text-2xl font-semibold">{metric.value}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <ArchitectureDiagram study={study} />
      </section>

      <section className="mt-12 grid gap-6 xl:grid-cols-2">
        <Card title="Architecture Overview" items={study.overview} />
        <Card title="Engineering Challenges" items={study.challenges} />
        <Card title="Scaling Decisions" items={study.scaling} />
        <Card title="Lessons Learned" items={study.lessons} />
      </section>

      <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Technology Stack</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {study.stack.map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
              {tech}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-300">
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

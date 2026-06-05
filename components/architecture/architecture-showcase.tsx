import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { architectureCaseStudies } from '@/constants/architecture'

export function ArchitectureShowcase() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Architecture Case Studies</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Premium engineering systems, told visually.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Interactive case studies that focus on how systems work, scale, and recover.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {architectureCaseStudies.map((study) => (
          <article
            key={study.slug}
            className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_-48px_rgba(34,211,238,0.35)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">{study.chips.join(' · ')}</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">{study.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{study.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {study.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
            <Link
              href={`/architecture/${study.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-300 transition-colors group-hover:text-cyan-200"
            >
              View Architecture
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArchitectureShowcase } from '@/components/architecture/architecture-showcase'
import { architectureCaseStudies } from '@/constants/architecture'

export const metadata: Metadata = {
  title: 'Architecture Case Studies',
  description: 'Interactive engineering architecture showcases.',
}

export default function ArchitectureShowcasePage() {
  return (
    <main>
      <ArchitectureShowcase />
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-20 sm:px-6 lg:px-8 md:grid-cols-2 xl:grid-cols-4">
        {architectureCaseStudies[0]?.metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
            <h3 className="mt-3 text-2xl font-semibold">{metric.value}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-300">{metric.detail}</p>
          </article>
        ))}
      </section>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Link
          href={`/architecture/${architectureCaseStudies[0].slug}`}
          className="inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm text-cyan-200 transition-colors hover:bg-cyan-300/15"
        >
          Open Case Study
        </Link>
      </div>
    </main>
  )
}

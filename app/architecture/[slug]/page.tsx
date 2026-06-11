import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArchitectureMobileView } from '@/components/architecture/architecture-mobile-view'
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
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Architecture Case Study</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {study.title}
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{study.summary}</p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {study.metrics.map((metric) => (
          <article key={metric.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
            <h2 className="mt-3 text-xl font-semibold sm:text-2xl">{metric.value}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 md:hidden">
        <ArchitectureMobileView study={study} />
      </section>

      <section className="mt-12 hidden md:block">
        <ArchitectureDiagram study={study} />
      </section>

      {study.extraSections?.stateMachine ? (
        <section className="mt-12 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <StateMachineVisualization study={study} />
          <ConfigFlowCard study={study} />
        </section>
      ) : null}

      {study.extraSections?.monorepo ? (
        <section className="mt-12 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <MonorepoDiagram study={study} />
          <ImpactCards study={study} />
        </section>
      ) : null}

      <section className="mt-12 grid gap-6 xl:grid-cols-2">
        <Card title="Architecture Overview" items={study.overview} />
        <Card title="Engineering Challenges" items={study.challenges} />
        <Card title="Scaling Decisions" items={study.scaling} />
        <Card title="Lessons Learned" items={study.lessons} />
      </section>

      <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
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

function StateMachineVisualization({ study }: { study: (typeof architectureCaseStudies)[number] }) {
  const states = study.extraSections?.stateMachine?.states ?? []
  const transitions = study.extraSections?.stateMachine?.transitions ?? []
  const statePositions = Object.fromEntries(
    states.map((state, index) => [state.id, { x: 60 + index * 210, y: index % 2 === 0 ? 90 : 260 }])
  )

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">State Machine</p>
          <h2 className="mt-3 text-xl font-semibold text-slate-100">Journey flow at a glance</h2>
        </div>
        <p className="max-w-sm text-sm leading-7 text-slate-400">
          This canvas shows how a configuration-driven journey moves from start to fallback and retry states.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto overflow-y-hidden rounded-[1.5rem] border border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.88),rgba(11,16,32,0.98))]">
        <div className="relative min-h-[560px] min-w-[1460px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1460 560" fill="none" preserveAspectRatio="none">
          {transitions.map((transition) => {
            const from = statePositions[transition.from]
            const to = statePositions[transition.to]
            if (!from || !to) return null
            const stroke =
              transition.style === 'success'
                ? '#10B981'
                : transition.style === 'failure'
                  ? '#F59E0B'
                  : '#22D3EE'
            return (
              <g key={`${transition.from}-${transition.to}-${transition.label}`}>
                <path
                  d={`M ${from.x + 110} ${from.y + 32} C ${from.x + 180} ${from.y + 32}, ${to.x - 70} ${to.y + 32}, ${to.x} ${to.y + 32}`}
                  stroke={stroke}
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray={transition.style === 'failure' ? '8 6' : undefined}
                >
                  <animate attributeName="stroke-dashoffset" values="0;24" dur="1.4s" repeatCount="indefinite" />
                </path>
                <rect x={(from.x + to.x) / 2 - 36} y={(from.y + to.y) / 2 + 10} width="72" height="22" rx="999" fill="rgba(17,24,39,0.95)" stroke={stroke} />
                <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 + 25} textAnchor="middle" fill="#E2E8F0" fontSize="11">
                  {transition.label}
                </text>
              </g>
            )
          })}
          </svg>
          {states.map((state) => {
            const pos = statePositions[state.id]
            if (!pos) return null
            return (
              <div
                key={state.id}
                className="absolute w-[160px] rounded-[1.25rem] border border-white/10 bg-white/[0.07] p-4 shadow-[0_18px_50px_-30px_rgba(34,211,238,0.3)] backdrop-blur-md"
                style={{ left: pos.x, top: pos.y }}
              >
                <div className="h-1 w-10 rounded-full bg-cyan-300/80" />
                <p className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">{state.id}</p>
                <p className="mt-2 text-base font-semibold text-slate-100">{state.label}</p>
                {state.note ? <p className="mt-2 text-sm leading-6 text-slate-300">{state.note}</p> : null}
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Primary path</span>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-200">Success</span>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-amber-200">Failure</span>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-cyan-200">Retry / fallback</span>
      </div>
    </article>
  )
}

function ConfigFlowCard({ study }: { study: (typeof architectureCaseStudies)[number] }) {
  const config = study.extraSections?.configSample ?? '{}'
  const highlights = study.extraSections?.configHighlights ?? []
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">JSON Configuration</p>
      <pre className="mt-5 overflow-auto rounded-[1.5rem] border border-white/10 bg-black/40 p-5 text-sm leading-7 text-slate-200">
        {config}
      </pre>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {highlights.map((item) => (
          <div key={item.key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.key}</p>
            <p className="mt-2 text-sm text-slate-200">{item.value}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function MonorepoDiagram({ study }: { study: (typeof architectureCaseStudies)[number] }) {
  const modules = study.extraSections?.monorepo ?? []
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Monorepo</p>
      <div className="mt-5 grid gap-3">
        {modules.map((module, index) => (
          <div
            key={module.label}
            className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4"
            style={{ opacity: 1 - index * 0.05 }}
          >
            <p className="text-sm font-semibold text-slate-100">{module.label}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{module.detail}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

function ImpactCards({ study }: { study: (typeof architectureCaseStudies)[number] }) {
  const metrics = study.extraSections?.impactMetrics ?? []
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Business Impact</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[1.25rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold text-cyan-200">{metric.value}</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{metric.detail}</p>
          </div>
        ))}
      </div>
    </article>
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

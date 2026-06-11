import type { ArchitectureCaseStudy } from '@/types/architecture'
import { ArrowDown, ArrowRight } from 'lucide-react'

const layerStyles = {
  client: 'border-cyan-400/70 bg-cyan-400/10 text-cyan-100',
  api: 'border-violet-400/70 bg-violet-400/10 text-violet-100',
  event: 'border-cyan-300/70 bg-cyan-300/10 text-cyan-100',
  service: 'border-indigo-400/70 bg-indigo-400/10 text-indigo-100',
  database: 'border-slate-500/70 bg-slate-500/10 text-slate-100',
  external: 'border-amber-400/70 bg-amber-400/10 text-amber-100',
  monitoring: 'border-emerald-400/70 bg-emerald-400/10 text-emerald-100',
} as const

export function ArchitectureMobileView({ study }: { study: ArchitectureCaseStudy }) {
  const nodesById = Object.fromEntries(study.nodes.map((node) => [node.id, node]))
  const primaryPath = buildPrimaryPath(study)

  return (
    <div className="space-y-4 md:hidden">
      <article className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Mobile Architecture</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-50">Delivery Sequence</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">{study.summary}</p>
      </article>

      <section className="grid gap-4">
        {study.nodes.map((node, index) => (
          <div key={node.id} className="grid gap-3">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={[
                    'inline-flex items-center rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em]',
                    layerStyles[node.layer],
                  ].join(' ')}
                >
                  {node.subtitle}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-slate-300">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-50">{node.label}</h3>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                {node.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            </article>
            {index < study.nodes.length - 1 ? (
              <div className="flex items-center justify-center">
                <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] p-2 text-cyan-200">
                  <ArrowDown className="h-4 w-4" />
                </span>
              </div>
            ) : null}
          </div>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Primary Flow</p>
        <div className="mt-4 flex flex-col gap-2">
          {primaryPath.map((step, index) => {
            const node = nodesById[step]
            return node ? (
              <div key={step} className="flex items-center gap-2">
                <span className="inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-200">
                  <span className="mr-2 text-slate-400">{index + 1}.</span>
                  {node.label}
                </span>
                {index < primaryPath.length - 1 ? (
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-cyan-200">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                ) : null}
              </div>
            ) : null
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {study.metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{metric.label}</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-50">{metric.value}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Architecture Notes</p>
        <div className="mt-4 space-y-3">
          {study.overview.slice(0, 3).map((item) => (
            <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-slate-300">
              {item}
            </p>
          ))}
        </div>
      </section>
    </div>
  )
}

function buildPrimaryPath(study: ArchitectureCaseStudy) {
  const nodeIds = new Set(study.nodes.map((node) => node.id))
  const outgoing = new Map<string, string[]>()
  const incoming = new Map<string, number>()

  for (const edge of study.edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue
    outgoing.set(edge.source, [...(outgoing.get(edge.source) ?? []), edge.target])
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1)
    if (!incoming.has(edge.source)) incoming.set(edge.source, incoming.get(edge.source) ?? 0)
  }

  const start = study.nodes.find((node) => (incoming.get(node.id) ?? 0) === 0) ?? study.nodes[0]
  if (!start) return []

  const path = [start.id]
  const visited = new Set(path)
  let current = start.id

  while (true) {
    const next = (outgoing.get(current) ?? []).find((id) => !visited.has(id))
    if (!next) break
    path.push(next)
    visited.add(next)
    current = next
    if (path.length >= 6) break
  }

  return path
}

'use client'

import type { Skill } from '@prisma/client'
import { motion } from 'framer-motion'
import { Cpu, Cloud, Database, Workflow, Zap, Braces } from 'lucide-react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { AnimatedSection } from '@/sections/home/animated-section'

type SkillSectionProps = {
  skills: Skill[]
}

const categoryMeta: Record<
  string,
  {
    title: string
    description: string
    icon: typeof Cpu
    accent: string
  }
> = {
  frontend: {
    title: 'Product Interface Layer',
    description: 'Premium React and Next.js delivery with strong UX, performance, and motion.',
    icon: Braces,
    accent: 'from-cyan-400/20 to-sky-400/10',
  },
  backend: {
    title: 'Service Orchestration Layer',
    description: 'API design, modular services, queues, workflows, and backend systems that scale.',
    icon: Workflow,
    accent: 'from-indigo-400/20 to-violet-400/10',
  },
  'gen ai': {
    title: 'Gen AI Layer',
    description: 'RAG, semantic search, retrieval pipelines, and AI integrations built for production.',
    icon: Cpu,
    accent: 'from-emerald-400/20 to-teal-400/10',
  },
  cloud: {
    title: 'Cloud & DevOps Layer',
    description: 'AWS-first thinking with deployment, observability, data flows, and reliability.',
    icon: Cloud,
    accent: 'from-amber-400/20 to-orange-400/10',
  },
  db: {
    title: 'Database Layer',
    description: 'MongoDB, PostgreSQL, schema design, indexing, and platform-ready data modeling.',
    icon: Database,
    accent: 'from-slate-300/20 to-slate-500/10',
  },
  devops: {
    title: 'DevOps Layer',
    description: 'Deployment, CI/CD, monitoring, and release automation.',
    icon: Cloud,
    accent: 'from-amber-400/20 to-orange-400/10',
  },
  realtime: {
    title: 'Realtime Systems Layer',
    description: 'WebSockets, live updates, event-driven interactions, and responsive data sync.',
    icon: Zap,
    accent: 'from-fuchsia-400/20 to-pink-400/10',
  },
  mobile: {
    title: 'Mobile Layer',
    description: 'App experiences, device-aware flows, and cross-platform delivery.',
    icon: Braces,
    accent: 'from-fuchsia-400/20 to-pink-400/10',
  },
}

export function SkillsSection({ skills }: SkillSectionProps) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category.toLowerCase()
    acc[key] ??= []
    acc[key].push(skill)
    return acc
  }, {})

  const orderedCategories = ['frontend', 'backend', 'gen ai', 'cloud', 'db', 'devops', 'realtime', 'mobile']
  const hasSkills = skills.length > 0

  return (
    <SectionWrapper
      eyebrow="Skills"
      title="An architecture-first skill matrix for product, platform, AI, and cloud delivery."
      description="The goal here is not to present a list of tools. It is to show the layers you can operate across in a real engineering organization."
      id="skills"
    >
      <AnimatedSection>
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-5 lg:grid-cols-2">
            {hasSkills ? (
              orderedCategories
                .filter((category) => (grouped[category] ?? []).length > 0)
                .map((category, index) => {
                  const meta = categoryMeta[category] ?? {
                    title: category,
                    description: 'Capability layer',
                    icon: Cpu,
                    accent: 'from-white/10 to-white/[0.03]',
                  }
                  const Icon = meta.icon
                  const items = grouped[category]

                  return (
                    <motion.article
                      key={category}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-120px' }}
                      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -4 }}
                      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_80px_-40px_rgba(56,189,248,0.3)] backdrop-blur-2xl"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
                      <div className="relative flex items-start gap-4">
                        <div className="rounded-2xl border border-white/10 bg-background/40 p-3">
                          <Icon className="h-5 w-5 text-cyan-200" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xl font-semibold tracking-tight text-foreground">
                            {meta.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-300">{meta.description}</p>
                        </div>
                      </div>

                      <div className="relative mt-6 flex flex-wrap gap-2">
                        {items.slice(0, 8).map((item, itemIndex) => (
                          <motion.span
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: itemIndex * 0.03 }}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground"
                          >
                            {item.name}
                          </motion.span>
                        ))}
                      </div>

                      <div className="relative mt-5 space-y-3">
                        {items.slice(0, 6).map((item) => {
                          const rating = Math.max(0, Math.min(5, item.level ?? 0))
                          return (
                            <div key={item.id} className="space-y-2">
                              <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                                <span>{item.name}</span>
                                <span>{rating}/5</span>
                              </div>
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, starIndex) => (
                                  <span
                                    key={starIndex}
                                    className={[
                                      'h-2.5 w-6 rounded-full transition-colors',
                                      starIndex < rating
                                        ? 'bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-100'
                                        : 'bg-white/[0.08]',
                                    ].join(' ')}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        <span>{items.length} capabilities</span>
                        <span>{category}</span>
                      </div>
                    </motion.article>
                  )
                })
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-sm text-muted-foreground backdrop-blur-xl lg:col-span-2">
                No skills have been added yet.
              </div>
            )}
          </div>

          <div className="grid gap-5">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-6 backdrop-blur-2xl"
            >
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">
                Architecture Highlights
              </p>
              <div className="mt-5 grid gap-3">
                {[
                  'Layered system design across product, services, data, and AI.',
                  'Event-driven coordination with queues and realtime delivery.',
                  'Enterprise-grade patterns for maintainability and scale.',
                ].map((item) => (
                  <HighlightRow key={item} text={item} />
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
            >
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">
                Platform View
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <MiniPanel label="AI Systems" value="RAG, semantic search, embeddings, orchestration" />
                <MiniPanel label="Cloud & DevOps" value="AWS, deploy pipelines, observability, scale" />
                <MiniPanel label="Realtime" value="WebSockets, event streams, live dashboards" />
                <MiniPanel label="Backend" value="MERN, NestJS, microservices, RabbitMQ" />
              </div>
            </motion.section>
          </div>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

function HighlightRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,0.8)]" />
      <p className="text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function MiniPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-7 text-slate-200">{value}</p>
    </div>
  )
}

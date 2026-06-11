'use client'

import { useMemo, useState } from 'react'
import type { Skill } from '@prisma/client'
import { motion } from 'framer-motion'
import { BadgeCheck, Braces, Cloud, Cpu, Database, Workflow, Zap, ChevronDown, Star } from 'lucide-react'
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
    title: 'Product Interface',
    description: 'React, Next.js, UX systems, and polished motion.',
    icon: Braces,
    accent: 'from-cyan-400/18 via-sky-400/8 to-transparent',
  },
  backend: {
    title: 'Service Orchestration',
    description: 'APIs, modular services, workflows, and backend systems.',
    icon: Workflow,
    accent: 'from-indigo-400/18 via-violet-400/8 to-transparent',
  },
  'gen ai': {
    title: 'Gen AI',
    description: 'RAG, semantic search, embeddings, and AI integrations.',
    icon: Cpu,
    accent: 'from-emerald-400/18 via-teal-400/8 to-transparent',
  },
  cloud: {
    title: 'Cloud & DevOps',
    description: 'Deployments, observability, release automation, and reliability.',
    icon: Cloud,
    accent: 'from-amber-400/18 via-orange-400/8 to-transparent',
  },
  db: {
    title: 'Database Design',
    description: 'MongoDB, PostgreSQL, indexing, and scalable data modeling.',
    icon: Database,
    accent: 'from-slate-300/20 via-slate-500/8 to-transparent',
  },
  devops: {
    title: 'Delivery Operations',
    description: 'CI/CD, monitoring, and release automation.',
    icon: Cloud,
    accent: 'from-amber-400/18 via-orange-400/8 to-transparent',
  },
  realtime: {
    title: 'Realtime Systems',
    description: 'WebSockets, live updates, and event-driven data sync.',
    icon: Zap,
    accent: 'from-fuchsia-400/18 via-pink-400/8 to-transparent',
  },
  mobile: {
    title: 'Mobile Experience',
    description: 'App flows, device-aware UX, and cross-platform delivery.',
    icon: Braces,
    accent: 'from-fuchsia-400/18 via-pink-400/8 to-transparent',
  },
}

export function SkillsSection({ skills }: SkillSectionProps) {
  const grouped = useMemo(() => {
    return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
      const key = skill.category.toLowerCase()
      acc[key] ??= []
      acc[key].push(skill)
      return acc
    }, {})
  }, [skills])

  const orderedCategories = ['frontend', 'backend', 'gen ai', 'cloud', 'db', 'devops', 'realtime', 'mobile']
  const categories = orderedCategories.filter((category) => (grouped[category] ?? []).length > 0)
  const totalFeatured = skills.filter((skill) => skill.featured).length

  return (
    <SectionWrapper
      eyebrow="Skills"
      title="A layered capability map across product, platform, AI, and cloud delivery."
      description="Open any category to inspect the skills tied to it in a responsive grid."
      id="skills"
    >
      <AnimatedSection>
        <div className="grid gap-4">
          <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_90px_-48px_rgba(34,211,238,0.5)] backdrop-blur-2xl md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-cyan-100">
                Skills overview
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">
                <BadgeCheck className="h-3.5 w-3.5 text-cyan-200" />
                {skills.length} skills total
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-[1.25fr_0.75fr] md:items-end">
              <div>
                <p className="max-w-2xl text-sm leading-7 text-slate-300">
                  Each category expands as an accordion, and the skills inside are displayed in a responsive grid.
                </p>
              </div>
              <div className="grid min-w-0 w-full grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                <HeroStat label="Layers" value={categories.length} />
                <HeroStat label="Skills" value={skills.length} />
                <HeroStat label="Featured" value={totalFeatured} />
              </div>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="grid gap-4">
              {categories.map((category, index) => {
                const meta = categoryMeta[category] ?? {
                  title: category,
                  description: 'Capability layer',
                  icon: Cpu,
                  accent: 'from-white/10 to-white/[0.03]',
                }

                return (
                  <SkillAccordion key={category} meta={meta} skills={grouped[category]} index={index} />
                )
              })}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-sm text-muted-foreground backdrop-blur-xl">
              No skills have been added yet.
            </div>
          )}
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

function HeroStat({ label, value }: { label: string | number; value: string | number }) {
  return (
    <div className="min-w-0 w-full px-1 py-1 text-center">
      <p className="text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground sm:text-[0.62rem] sm:tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold leading-none text-foreground sm:text-xl">{value}</p>
    </div>
  )
}

function SkillAccordion({
  meta,
  skills,
  index,
}: {
  meta: {
    title: string
    description: string
    icon: typeof Cpu
  }
  skills: Skill[]
  index: number
}) {
  const [expanded, setExpanded] = useState(false)
  const visibleSkills = expanded ? skills : skills.slice(0, 8)
  const hiddenCount = Math.max(0, skills.length - visibleSkills.length)
  const featuredInCategory = skills.filter((item) => item.featured).length
  const Icon = meta.icon

  return (
    <motion.details
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.05] backdrop-blur-2xl"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-2xl border border-white/10 bg-background/40 p-3">
            <Icon className="h-5 w-5 text-cyan-100" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight text-foreground md:text-lg">{meta.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{meta.description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
            {skills.length} skills
          </span>
          <ChevronDown className="h-4 w-4 text-white/45 transition-transform duration-300 group-open:rotate-180 group-open:text-cyan-100" />
        </div>
      </summary>
      <div className="border-t border-white/10 p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          <span>{skills.length} skills</span>
          <span>{featuredInCategory} featured</span>
        </div>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
          {visibleSkills.map((item) => {
            const rating = Math.max(0, Math.min(5, item.level ?? 0))
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-background/20 p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-cyan-50">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </span>
                      ) : null}
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">
                        {item.slug}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-muted-foreground">
                    {rating}/5
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span
                      key={starIndex}
                      className={[
                        'h-2.5 flex-1 rounded-full transition-colors',
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
        {hiddenCount > 0 ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              setExpanded((value) => !value)
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.08]"
          >
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          </button>
        ) : null}
      </div>
    </motion.details>
  )
}

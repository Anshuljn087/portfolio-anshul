'use client'

import { useMemo, useState } from 'react'
import type { Skill } from '@prisma/client'
import { motion } from 'framer-motion'
import { BadgeCheck, Braces, Cloud, Cpu, Database, Workflow, Zap, ArrowRight, Star } from 'lucide-react'
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
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? '')

  const activeCategory = selectedCategory && grouped[selectedCategory] ? selectedCategory : categories[0] ?? ''
  const selectedMeta = categoryMeta[activeCategory] ?? {
    title: 'Select a category',
    description: 'Pick a category on the left to view its skills.',
    icon: Cpu,
    accent: 'from-white/10 to-white/[0.03]',
  }
  const selectedItems = grouped[activeCategory] ?? []
  const featuredCount = selectedItems.filter((item) => item.featured).length

  return (
    <SectionWrapper
      eyebrow="Skills"
      title="A layered capability map across product, platform, AI, and cloud delivery."
      description="Select a category on the left to inspect the skills tied to it."
      id="skills"
    >
      <AnimatedSection>
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_90px_-48px_rgba(34,211,238,0.5)] backdrop-blur-2xl md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-cyan-100">
                  Skills overview
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">
                  <BadgeCheck className="h-3.5 w-3.5 text-cyan-200" />
                  Production ready
                </span>
              </div>
              <div className="grid gap-5 md:grid-cols-[1.25fr_0.75fr] md:items-end">
                <div>
                  <p className="max-w-2xl text-sm leading-7 text-slate-300">
                    The left side works like a category navigator. Choose a capability group, and the right
                    panel will show the exact skills inside it.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <HeroStat label="Layers" value={categories.length} />
                  <HeroStat label="Skills" value={skills.length} />
                  <HeroStat label="Featured" value={skills.filter((skill) => skill.featured).length} />
                </div>
              </div>
            </div>

            {categories.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                {categories.map((category, index) => {
                  const meta = categoryMeta[category] ?? {
                    title: category,
                    description: 'Capability layer',
                    icon: Cpu,
                    accent: 'from-white/10 to-white/[0.03]',
                  }
                  const Icon = meta.icon
                  const isActive = category === activeCategory
                  const count = grouped[category].length

                  return (
                    <motion.button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-120px' }}
                      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className={[
                        'group relative overflow-hidden rounded-[1.6rem] border p-5 text-left backdrop-blur-2xl transition-all duration-300',
                        isActive
                          ? 'border-cyan-300/35 bg-white/[0.09] shadow-[0_22px_70px_-40px_rgba(34,211,238,0.55)]'
                          : 'border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]',
                      ].join(' ')}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />
                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-2xl border border-white/10 bg-background/40 p-3">
                            <Icon className="h-5 w-5 text-cyan-100" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                              {meta.title}
                            </h3>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
                              {meta.description}
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          className={[
                            'h-4 w-4 shrink-0 transition-transform duration-300',
                            isActive ? 'translate-x-1 text-cyan-100' : 'text-white/35 group-hover:translate-x-1',
                          ].join(' ')}
                        />
                      </div>
                      <div className="relative mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
                        <span>{count} skills</span>
                        <span>{isActive ? 'Selected' : 'View'}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-sm text-muted-foreground backdrop-blur-xl">
                No skills have been added yet.
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl md:p-7 xl:sticky xl:top-24">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">Selected category</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  {selectedMeta.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{selectedMeta.description}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <selectedMeta.icon className="h-5 w-5 text-cyan-100" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <MiniStat label="Skills" value={selectedItems.length} />
              <MiniStat label="Featured" value={featuredCount} />
              <MiniStat label="Category" value={activeCategory || '--'} />
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Skills in this group</p>
              <div className="mt-4 max-h-[36rem] overflow-y-auto pr-2">
                <div className="grid gap-3">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => {
                    const rating = Math.max(0, Math.min(5, item.level ?? 0))
                    return (
                      <div key={item.id} className="rounded-2xl border border-white/10 bg-background/20 p-4">
                        <div className="flex items-center justify-between gap-4">
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
                  })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-muted-foreground">
                      Select a category to see its skills.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

function HeroStat({ label, value }: { label: string | number; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}

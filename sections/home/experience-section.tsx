'use client'

import { useMemo, useState } from 'react'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { AnimatedSection } from '@/sections/home/animated-section'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles, BriefcaseBusiness, MapPin } from 'lucide-react'
import type { Experience } from '@prisma/client'

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const hasItems = experiences.length > 0
  const [showAll, setShowAll] = useState(false)
  const visibleExperiences = useMemo(
    () => (showAll ? experiences : experiences.slice(0, 2)),
    [experiences, showAll]
  )
  const remainingCount = Math.max(0, experiences.length - visibleExperiences.length)

  return (
    <SectionWrapper
      eyebrow="Experience"
      title="A cinematic record of enterprise delivery, scalable systems, and AI-first engineering."
      description="This timeline is designed to read like a product architecture journey, showing how the work evolved across full-stack delivery, microservices, real-time systems, and AI integrations."
      id="experience"
    >
      <AnimatedSection>
        <div className="relative">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-cyan-300/50 via-white/10 to-transparent md:left-1/2 md:-translate-x-1/2" />

          {hasItems ? (
            <>
              <ol className="space-y-8 md:space-y-12">
                {visibleExperiences.map((entry, index) => {
                  const isEven = index % 2 === 0
                  const period = `${new Date(entry.startDate).getFullYear()} - ${
                    entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'
                  }`

                  return (
                    <motion.li
                      key={entry.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-120px' }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="relative grid gap-4 pl-9 md:grid-cols-2 md:gap-10 md:pl-0"
                    >
                      <div
                        className={[
                          'md:pt-3',
                          isEven ? 'md:pr-10 md:text-right' : 'md:col-start-2 md:pl-10',
                        ].join(' ')}
                      >
                        <div
                          className={[
                            'inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100 backdrop-blur-md sm:tracking-[0.28em]',
                            isEven ? 'md:ml-auto' : '',
                          ].join(' ')}
                        >
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{period}</span>
                        </div>

                        <div className="relative mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-[0_24px_60px_-28px_rgba(56,189,248,0.35)] backdrop-blur-2xl">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_35%)]" />
                          <div className="relative p-5 sm:p-6 md:p-7">
                            <div className="flex items-start gap-3">
                              <div className="rounded-2xl border border-white/10 bg-background/40 p-3">
                                <BriefcaseBusiness className="h-5 w-5 text-cyan-100" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                  {entry.role}
                                </h3>
                                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground sm:tracking-[0.24em]">
                                  {entry.company}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 text-cyan-200" />
                                {entry.location ?? 'Remote / Flexible'}
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground">
                                {period}
                              </span>
                            </div>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                              {entry.summary}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={isEven ? 'md:col-start-2 md:pl-10' : 'md:pr-10 md:text-right'}>
                        <div className="md:pt-3">
                          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                              Engineering Focus
                            </p>
                            <div
                              className={[
                                'mt-4 flex flex-wrap gap-2',
                                isEven ? '' : 'md:justify-end',
                              ].join(' ')}
                            >
                              {buildFocusTags(entry).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div
                              className={[
                                'mt-5 flex items-center gap-2 text-sm text-cyan-200',
                                isEven ? '' : 'md:justify-end',
                              ].join(' ')}
                            >
                              <span>CMS-driven content</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <span className="absolute left-3 top-8 z-10 h-5 w-5 -translate-x-1/2 rounded-full border border-cyan-200/50 bg-cyan-200/20 shadow-[0_0_24px_rgba(103,232,249,0.55)] md:left-1/2 md:-translate-x-1/2" />
                    </motion.li>
                  )
                })}
              </ol>

              {remainingCount > 0 ? (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAll((current) => !current)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-foreground transition hover:bg-white/[0.07]"
                  >
                    <span>{showAll ? 'Show less' : `Show ${remainingCount} more`}</span>
                    <ChevronDown className={showAll ? 'h-4 w-4 rotate-180 transition-transform' : 'h-4 w-4 transition-transform'} />
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 text-sm text-muted-foreground backdrop-blur-xl">
              No experience entries are published yet.
            </div>
          )}
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

function buildFocusTags(entry: Experience) {
  const text = `${entry.role} ${entry.company ?? ''} ${entry.summary}`.toLowerCase()
  const tags = [
    ['microservices', 'Microservices'],
    ['real-time', 'Realtime Systems'],
    ['websocket', 'WebSockets'],
    ['ai', 'AI Integrations'],
    ['enterprise', 'Enterprise Delivery'],
    ['scalable', 'Scalable Architecture'],
    ['dashboard', 'Dashboards'],
  ] as const

  const inferred = tags.filter(([needle]) => text.includes(needle)).map(([, label]) => label)
  return inferred.length > 0 ? inferred.slice(0, 4) : ['Platform Engineering', 'Product Delivery', 'Systems Design']
}

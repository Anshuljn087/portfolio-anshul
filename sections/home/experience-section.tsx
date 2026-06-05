'use client'

import { SectionWrapper } from '@/components/layout/section-wrapper'
import { AnimatedSection } from '@/sections/home/animated-section'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { Experience } from '@prisma/client'

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  const hasItems = experiences.length > 0

  return (
    <SectionWrapper
      eyebrow="Experience"
      title="A cinematic record of enterprise delivery, scalable systems, and AI-first engineering."
      description="This timeline is designed to read like a product architecture journey, showing how the work evolved across full-stack delivery, microservices, real-time systems, and AI integrations."
      id="experience"
    >
      <AnimatedSection>
        <div className="relative">
          <div className="absolute left-[1.1rem] top-0 h-full w-px bg-gradient-to-b from-cyan-300/50 via-white/10 to-transparent md:left-1/2 md:-translate-x-1/2" />

          {hasItems ? (
            <ol className="space-y-8 md:space-y-12">
              {experiences.map((entry, index) => {
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
                    className="relative grid gap-4 md:grid-cols-2 md:gap-10"
                  >
                    <div
                      className={[
                        'md:pt-3',
                        isEven ? 'md:pr-10 md:text-right' : 'md:col-start-2 md:pl-10',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan-100 backdrop-blur-md',
                          isEven ? 'md:ml-auto' : '',
                        ].join(' ')}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {period}
                      </div>

                      <div className="relative mt-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_60px_-28px_rgba(56,189,248,0.35)] backdrop-blur-2xl md:p-7">
                        <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_35%)]" />
                        <div className="relative">
                          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                            {entry.role}
                          </h3>
                          {entry.company ? (
                            <p className="mt-2 text-sm uppercase tracking-[0.24em] text-muted-foreground">
                              {entry.company}
                            </p>
                          ) : null}
                          {entry.location ? (
                            <p className="mt-1 text-sm text-muted-foreground">{entry.location}</p>
                          ) : null}
                          <p className="mt-5 text-base leading-8 text-slate-300">{entry.summary}</p>
                        </div>
                      </div>
                    </div>

                    <div className={isEven ? 'md:col-start-2 md:pl-10' : 'md:pr-10 md:text-right'}>
                      <div className="md:pt-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                          Engineering Focus
                        </div>
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
                            'mt-6 flex items-center gap-2 text-sm text-cyan-200',
                            isEven ? '' : 'md:justify-end',
                          ].join(' ')}
                        >
                          <span>CMS-driven content</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <span className="absolute left-[1.1rem] top-8 z-10 h-5 w-5 -translate-x-1/2 rounded-full border border-cyan-200/50 bg-cyan-200/20 shadow-[0_0_24px_rgba(103,232,249,0.55)] md:left-1/2" />
                  </motion.li>
                )
              })}
            </ol>
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

'use client'

import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Download, Sparkles } from 'lucide-react'
import { AnimatedSection } from '@/sections/home/animated-section'
import { fadeInStagger, textReveal } from '@/lib/motion'
import { ProfileAvatar } from '@/components/media/profile-avatar'

export function HeroSection({
  content,
}: {
  content: {
    eyebrow?: string
    title: string
    description: string
    profileImage?: {
      src: string
      alt: string
      width?: number
      height?: number
      blurDataUrl?: string
    } | null
    primaryCtaLabel?: string
    primaryCtaHref?: string
    secondaryCtaLabel?: string
    secondaryCtaHref?: string
    tertiaryCtaLabel?: string
    tertiaryCtaHref?: string
    stats?: Array<{ label: string; value: string }>
  }
}) {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : 80])
  const glowY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : -40])
  const gridY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : 140])

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: heroY }}
          className="absolute left-1/2 top-[-8rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        />
        <motion.div
          style={{ y: glowY }}
          className="absolute right-[-10rem] top-[9rem] h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl"
        />
        <motion.div
          style={{ y: gridY }}
          className="absolute bottom-[-10rem] left-[-8rem] h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/10 blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.18] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_88%)]" />
      </div>

      <AnimatedSection>
        <motion.div
          variants={fadeInStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-5xl"
        >
          <motion.div variants={textReveal} custom={0} className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.32em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              {content.eyebrow ?? 'Engineering Platform'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {content.stats?.[0]?.value ?? '7+ years'} of shipping software
            </span>
          </motion.div>
          <motion.h1
            variants={textReveal}
            custom={0.08}
            className="mt-7 max-w-4xl text-balance text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]"
          >
            {content.title}
          </motion.h1>
          <motion.p
            variants={textReveal}
            custom={0.14}
            className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-slate-300 sm:text-xl"
          >
            {content.description}
          </motion.p>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <motion.div
          style={{ y: glowY }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.28)] backdrop-blur-2xl sm:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(129,140,248,0.12),transparent_28%)]" />
          <div className="relative grid gap-8 sm:grid-cols-[auto_1fr_1fr]">
            <div className="flex items-center justify-center">
              <ProfileAvatar image={content.profileImage} size="lg" className="ring-8 ring-background/60" />
            </div>
            <InfoBlock label="Frontend" value="React / Next.js / TypeScript" />
            <InfoBlock label="Backend" value="Node.js / NestJS / Express.js" />
          </div>
          <div className="relative mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
            {(content.stats ?? []).map((stat) => (
              <Metric key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid gap-5 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-8 backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
          <div className="relative">
            <p className="text-sm font-medium uppercase tracking-[0.34em] text-cyan-200/80">
              Focus
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-200">
              Full-stack product engineering with a premium systems mindset, pairing crisp user
              experiences with scalable backend architecture and AI-native workflows.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Link
              href={content.primaryCtaHref ?? '#contact'}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              {content.primaryCtaLabel ?? 'Contact'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={content.secondaryCtaHref ?? '/resume.pdf'}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-white/[0.08]"
              download
            >
              {content.secondaryCtaLabel ?? 'Download Resume'}
              <Download className="h-4 w-4" />
            </Link>
            <Link
              href={content.tertiaryCtaHref ?? '#projects'}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 transition-colors duration-300 hover:bg-cyan-400/15"
            >
              {content.tertiaryCtaLabel ?? 'View Projects'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/architecture"
              className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-5 py-3 text-sm font-medium text-violet-100 transition-colors duration-300 hover:bg-violet-400/15"
            >
              Architecture Cases
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="flex justify-center pt-2">
          <motion.a
            href="#about"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="group inline-flex flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>Scroll</span>
            <span className="relative flex h-14 w-8 items-start justify-center rounded-full border border-white/15 bg-white/[0.03] p-2">
              <motion.span
                animate={reduceMotion ? undefined : { y: [0, 16, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.75)]"
              />
            </span>
          </motion.a>
        </div>
      </AnimatedSection>
    </section>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-200/70">{label}</p>
      <p className="mt-3 text-lg font-medium text-foreground">{value}</p>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-100">{value}</p>
    </div>
  )
}

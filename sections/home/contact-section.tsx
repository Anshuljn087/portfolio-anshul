import Link from 'next/link'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { AnimatedSection } from '@/sections/home/animated-section'

export function ContactSection({
  content,
}: {
  content: {
    eyebrow?: string
    title: string
    description: string
    email: string
    ctaLabel?: string
  }
}) {
  return (
    <SectionWrapper
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      id="contact"
    >
      <AnimatedSection>
        <div className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-muted-foreground">{content.description}</p>
          </div>
          <Link
            href={`mailto:${content.email}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 md:w-auto"
          >
            {content.ctaLabel ?? content.email}
          </Link>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

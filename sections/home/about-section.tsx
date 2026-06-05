import { SectionWrapper } from '@/components/layout/section-wrapper'
import { AnimatedSection } from '@/sections/home/animated-section'
import { ProfileAvatar } from '@/components/media/profile-avatar'

export function AboutSection({
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
    profileName?: string
    profileRole?: string
    body: string
  }
}) {
  return (
    <SectionWrapper
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      id="about"
    >
      <AnimatedSection>
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Profile</p>
            <div className="mt-4 flex items-center gap-4">
              <ProfileAvatar image={content.profileImage} size="lg" />
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {content.profileName ?? 'Profile'}
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">{content.profileRole}</p>
              </div>
            </div>
          </div>
          <p className="text-base leading-8 text-muted-foreground sm:text-lg">
            {content.body}
          </p>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

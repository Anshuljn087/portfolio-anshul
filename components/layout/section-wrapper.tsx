import { cn } from '@/lib/utils'
import type { SectionWrapperProps } from '@/types/site'

export function SectionWrapper({
  eyebrow,
  title,
  description,
  className,
  children,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      className={cn('mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8', className)}
      {...props}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {description}
        </p>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  )
}

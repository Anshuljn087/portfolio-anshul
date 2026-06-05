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
      className={cn('mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8', className)}
      {...props}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  )
}

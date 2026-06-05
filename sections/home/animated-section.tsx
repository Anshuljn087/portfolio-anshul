'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { revealFromBottom } from '@/lib/motion'

type AnimatedSectionProps = {
  children: ReactNode
  className?: string
}

export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={revealFromBottom.initial}
      whileInView={revealFromBottom.whileInView}
      viewport={revealFromBottom.viewport}
      transition={revealFromBottom.transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

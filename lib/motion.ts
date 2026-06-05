export const motionEasing = [0.22, 1, 0.36, 1] as const

export const revealFromBottom = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-120px' },
  transition: { duration: 0.7, ease: motionEasing },
}

export const textReveal = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      delay,
      ease: motionEasing,
    },
  }),
}

export const fadeInStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

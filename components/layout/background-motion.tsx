'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export function BackgroundMotion() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1200], [0, reduceMotion ? 0 : 120])
  const y2 = useTransform(scrollY, [0, 1200], [0, reduceMotion ? 0 : -80])
  const opacity = useTransform(scrollY, [0, 900], [0.9, 0.55])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute left-[-12%] top-[-10%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute right-[-10%] top-[18%] h-[28rem] w-[28rem] rounded-full bg-indigo-400/10 blur-3xl"
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute bottom-[-14%] left-[28%] h-[24rem] w-[24rem] rounded-full bg-fuchsia-400/10 blur-3xl"
      />
    </div>
  )
}

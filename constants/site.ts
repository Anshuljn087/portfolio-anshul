import type { SiteConfig } from '@/types/site'

export const siteConfig: SiteConfig = {
  name: 'Anshul Portfolio',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  description:
    'A modern portfolio platform built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.',
  tagline: 'Portfolio platform',
  author: {
    name: 'Anshul',
  },
  keywords: ['portfolio', 'next.js', 'typescript', 'tailwind css', 'framer motion'],
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Architecture', href: '/architecture' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Experience', href: '/#experience' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ],
  hero: {
    title: 'Production-ready portfolio architecture for modern personal brands.',
    description:
      'A scalable App Router foundation with reusable layout primitives, SEO-ready metadata, and a dark-first visual system.',
  },
  highlights: [
    {
      title: 'Reusable structure',
      description:
        'Shared layout primitives keep the codebase consistent as sections, pages, and features grow.',
    },
    {
      title: 'SEO-aware by default',
      description:
        'Metadata, viewport configuration, and semantic content are organized for search and sharing.',
    },
    {
      title: 'Performance-minded',
      description:
        'Local font loading, minimal client-side surface area, and a clean styling foundation reduce overhead.',
    },
  ],
}

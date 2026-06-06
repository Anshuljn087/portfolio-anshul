import type { ComponentPropsWithoutRef } from 'react'

export type NavigationItem = {
  label: string
  href: string
  enabled?: boolean
}

export type SiteConfig = {
  name: string
  url: string
  description: string
  tagline: string
  author: {
    name: string
  }
  keywords: string[]
  navigation: NavigationItem[]
  hero: {
    title: string
    description: string
  }
  highlights: Array<{
    title: string
    description: string
  }>
}

export type SectionWrapperProps = ComponentPropsWithoutRef<'section'> & {
  eyebrow?: string
  title: string
  description: string
}

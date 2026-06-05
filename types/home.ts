export type SkillGroup = {
  title: string
  items: string[]
}

export type TimelineEntry = {
  period: string
  title: string
  company?: string
  description: string
}

export type ProjectCard = {
  name: string
  description: string
  stack: string[]
  impact: string
}

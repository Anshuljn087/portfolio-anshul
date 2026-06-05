export type ArchitectureNode = {
  id: string
  label: string
  subtitle: string
  layer: 'client' | 'api' | 'event' | 'service' | 'database' | 'external' | 'monitoring'
  x: number
  y: number
  details: string[]
}

export type ArchitectureEdge = {
  id: string
  source: string
  target: string
  label: string
  style: 'primary' | 'retry' | 'bidirectional' | 'observability' | 'event'
}

export type ArchitectureCaseStudy = {
  slug: string
  title: string
  summary: string
  chips: string[]
  outcome: string
  stack: string[]
  metrics: Array<{ label: string; value: string; detail: string }>
  overview: string[]
  challenges: string[]
  scaling: string[]
  lessons: string[]
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
}

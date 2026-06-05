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
  style: 'primary' | 'retry' | 'bidirectional' | 'observability' | 'event' | 'success'
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
  extraSections?: {
    architectureDiagramTitle?: string
    stateMachine?: {
      states: Array<{ id: string; label: string; note?: string }>
      transitions: Array<{ from: string; to: string; label: string; style?: 'primary' | 'success' | 'failure' }>
    }
    configSample?: string
    configHighlights?: Array<{ key: string; value: string }>
    monorepo?: Array<{ label: string; detail: string }>
    impactMetrics?: Array<{ label: string; value: string; detail: string }>
  }
}

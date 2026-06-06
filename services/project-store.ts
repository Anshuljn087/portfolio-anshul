import type { ProjectFormValues } from '@/types/admin'
import { projectRepository } from '@/services/repositories/project-repository'

export type ProjectRecord = Awaited<ReturnType<typeof projectRepository.findMany>>[number]

function toProjectInput(values: ProjectFormValues) {
  const parseList = (value?: string) =>
    (value ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

  const parseJson = (value?: string) => {
    if (!value?.trim()) {
      return null
    }

    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }

  return {
    title: values.title.trim(),
    slug: values.slug.trim().toLowerCase(),
    projectType: values.projectType,
    isConfidential: values.isConfidential,
    summary: values.summary.trim(),
    duration: values.duration.trim(),
    category: values.category?.trim() || null,
    businessDomain: values.businessDomain?.trim() || null,
    responsibilities: values.responsibilities?.trim() || null,
    myContributions: values.myContributions?.trim() || null,
    keyAchievements: values.keyAchievements?.trim() || null,
    teamSize: values.teamSize?.trim() || null,
    content: values.summary.trim(),
    coverImage: values.coverImage?.trim() || null,
    galleryImages: parseList(values.galleryImages),
    stack: parseList(values.stack),
    status: values.status === 'published' ? 'PUBLISHED' : 'DRAFT',
    featured: values.featured,
    sortOrder: values.sortOrder,
    githubUrl: values.githubUrl?.trim() || null,
    liveUrl: values.liveUrl?.trim() || null,
    architectureNotes: values.architectureNotes?.trim() || null,
    challenges: values.challenges?.trim() || null,
    solutions: values.solutions?.trim() || null,
    metrics: parseJson(values.metrics),
    seo: parseJson(values.seo),
    previewImage: values.previewImage?.trim() || null,
    showGithub: values.showGithub ?? values.projectType === 'PERSONAL',
    showLiveUrl: values.showLiveUrl ?? values.projectType === 'PERSONAL',
    showScreenshots: values.showScreenshots ?? values.projectType === 'PERSONAL',
    showMetrics: values.showMetrics ?? true,
    showArchitecture: values.showArchitecture ?? values.projectType === 'PERSONAL',
    showChallenges: values.showChallenges ?? values.projectType === 'PERSONAL',
    showSolutions: values.showSolutions ?? values.projectType === 'PERSONAL',
    publishedAt: values.status === 'published' ? new Date() : null,
  } as const
}

export async function listProjects(): Promise<ProjectRecord[]> {
  return projectRepository.findMany()
}

export async function getProject(id: string): Promise<ProjectRecord | null> {
  return projectRepository.findById(id)
}

export async function createProject(values: ProjectFormValues): Promise<ProjectRecord> {
  return projectRepository.create(toProjectInput(values))
}

export async function updateProject(id: string, values: ProjectFormValues): Promise<ProjectRecord> {
  return projectRepository.update(id, toProjectInput(values))
}

export async function deleteProject(id: string): Promise<ProjectRecord> {
  return projectRepository.softDelete(id)
}

export async function reorderProjects(ids: string[]) {
  return projectRepository.reorder(ids)
}

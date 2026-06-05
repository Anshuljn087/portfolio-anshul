import type { ProjectFormValues } from '@/types/admin'
import { projectRepository } from '@/services/repositories/project-repository'

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
    summary: values.summary.trim(),
    category: values.category?.trim() || null,
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
    publishedAt: values.status === 'published' ? new Date() : null,
  } as const
}

export async function listProjects() {
  return projectRepository.findMany()
}

export async function getProject(id: string) {
  return projectRepository.findById(id)
}

export async function createProject(values: ProjectFormValues) {
  return projectRepository.create(toProjectInput(values))
}

export async function updateProject(id: string, values: ProjectFormValues) {
  return projectRepository.update(id, toProjectInput(values))
}

export async function deleteProject(id: string) {
  return projectRepository.softDelete(id)
}

export async function reorderProjects(ids: string[]) {
  return projectRepository.reorder(ids)
}

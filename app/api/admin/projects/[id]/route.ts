import { NextResponse } from 'next/server'
import { z } from 'zod'
import { deleteProject, getProject, updateProject } from '@/services/project-store'

const projectSchema = z.object({
  title: z.string().min(2).max(120),
  projectType: z.enum(['PERSONAL', 'PROFESSIONAL']),
  isConfidential: z.coerce.boolean(),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, 'Use a URL-friendly slug'),
  summary: z.string().min(20).max(400),
  duration: z.string().min(2).max(120),
  category: z.string().optional(),
  businessDomain: z.string().optional(),
  responsibilities: z.string().optional(),
  myContributions: z.string().optional(),
  keyAchievements: z.string().optional(),
  teamSize: z.string().optional(),
  stack: z.string().min(2),
  status: z.enum(['published', 'draft']),
  featured: z.coerce.boolean(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  coverImage: z.string().url().optional().or(z.literal('')),
  galleryImages: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  architectureNotes: z.string().optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  metrics: z.string().optional(),
  seo: z.string().optional(),
  previewImage: z.string().url().optional().or(z.literal('')),
  showGithub: z.coerce.boolean().optional(),
  showLiveUrl: z.coerce.boolean().optional(),
  showScreenshots: z.coerce.boolean().optional(),
  showMetrics: z.coerce.boolean().optional(),
  showArchitecture: z.coerce.boolean().optional(),
  showChallenges: z.coerce.boolean().optional(),
  showSolutions: z.coerce.boolean().optional(),
})

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)
  if (!project) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(project)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const formData = await request.formData()
  const parsed = projectSchema.safeParse({
    title: formData.get('title'),
    projectType: formData.get('projectType'),
    isConfidential: formData.get('isConfidential') === 'on',
    slug: formData.get('slug'),
    summary: formData.get('summary'),
    duration: formData.get('duration'),
    category: formData.get('category') ?? '',
    businessDomain: formData.get('businessDomain') ?? '',
    responsibilities: formData.get('responsibilities') ?? '',
    myContributions: formData.get('myContributions') ?? '',
    keyAchievements: formData.get('keyAchievements') ?? '',
    teamSize: formData.get('teamSize') ?? '',
    stack: formData.get('stack'),
    status: formData.get('status'),
    featured: formData.get('featured') === 'on',
    sortOrder: formData.get('sortOrder') ?? '0',
    coverImage: formData.get('coverImage') ?? '',
    galleryImages: formData.get('galleryImages') ?? '',
    githubUrl: formData.get('githubUrl') ?? '',
    liveUrl: formData.get('liveUrl') ?? '',
    architectureNotes: formData.get('architectureNotes') ?? '',
    challenges: formData.get('challenges') ?? '',
    solutions: formData.get('solutions') ?? '',
    metrics: formData.get('metrics') ?? '',
    seo: formData.get('seo') ?? '',
    previewImage: formData.get('previewImage') ?? '',
    showGithub: formData.get('showGithub') === 'on',
    showLiveUrl: formData.get('showLiveUrl') === 'on',
    showScreenshots: formData.get('showScreenshots') === 'on',
    showMetrics: formData.get('showMetrics') === 'on',
    showArchitecture: formData.get('showArchitecture') === 'on',
    showChallenges: formData.get('showChallenges') === 'on',
    showSolutions: formData.get('showSolutions') === 'on',
  })

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? 'Invalid data' },
      { status: 400 }
    )
  }

  const project = await updateProject(id, parsed.data)
  if (!project) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(project)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteProject(id)
  return NextResponse.json({ ok: true })
}

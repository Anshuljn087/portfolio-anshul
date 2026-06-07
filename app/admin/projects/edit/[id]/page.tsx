import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/project-form'
import { getProject } from '@/services/project-store'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Projects</p>
        <h2 className="mt-3 text-3xl font-semibold">Edit project</h2>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <ProjectForm
          mode="edit"
          projectId={project.id}
          defaultValues={{
            title: project.title,
            slug: project.slug,
            projectType: project.projectType,
            isConfidential: project.isConfidential,
            summary: project.summary,
            duration: project.duration,
            category: project.category ?? '',
            businessDomain: project.businessDomain ?? '',
            responsibilities: project.responsibilities ?? '',
            myContributions: project.myContributions ?? '',
            keyAchievements: project.keyAchievements ?? '',
            teamSize: project.teamSize ?? '',
            content: project.content ?? project.summary,
            stack: project.stack.join(', '),
            status: project.status.toLowerCase() as 'draft' | 'published',
            featured: project.featured,
            sortOrder: project.sortOrder,
            coverImage: project.coverImage ?? '',
            galleryImages: project.galleryImages.join(', '),
            githubUrl: project.githubUrl ?? '',
            liveUrl: project.liveUrl ?? '',
            architectureNotes: project.architectureNotes ?? '',
            challenges: project.challenges ?? '',
            solutions: project.solutions ?? '',
            metrics: project.metrics ? JSON.stringify(project.metrics, null, 2) : '',
            seo: project.seo ? JSON.stringify(project.seo, null, 2) : '',
            previewImage: project.previewImage ?? '',
            showGithub: project.showGithub,
            showLiveUrl: project.showLiveUrl,
            showScreenshots: project.showScreenshots,
            showMetrics: project.showMetrics,
            showArchitecture: project.showArchitecture,
            showChallenges: project.showChallenges,
            showSolutions: project.showSolutions,
          }}
        />
      </div>
    </div>
  )
}

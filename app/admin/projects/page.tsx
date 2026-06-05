import Link from 'next/link'
import { listProjects } from '@/services/project-store'
import { DeleteProjectButton } from '@/components/admin/delete-project-button'
import { ToggleFeaturedButton } from '@/components/admin/toggle-featured-button'
import { ProjectOrderControls } from '@/components/admin/project-order-controls'

export default async function ProjectsPage() {
  const projects = await listProjects().catch(() => [])
  const ids = projects.map((project) => project.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Projects</p>
          <h2 className="mt-3 text-3xl font-semibold">Manage projects</h2>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
        >
          Add project
        </Link>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-white/10">
        <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.6fr_0.7fr_0.8fr] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-muted-foreground">
          <span>Title</span>
          <span>Status</span>
          <span>Stack</span>
          <span>Featured</span>
          <span>Order</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-white/10">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.6fr_0.7fr_0.8fr] gap-4 px-5 py-4">
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-muted-foreground">{project.summary}</p>
                </div>
                <p className="text-sm text-muted-foreground">{project.status}</p>
                <p className="text-sm text-muted-foreground">{project.stack.join(', ')}</p>
                <ToggleFeaturedButton id={project.id} featured={project.featured} />
                <ProjectOrderControls ids={ids} activeId={project.id} />
                <div className="flex justify-end gap-3 text-sm">
                  <Link href={`/projects/${project.slug}`} className="hover:text-cyan-300">
                    Preview
                  </Link>
                  <Link href={`/admin/projects/edit/${project.id}`} className="hover:text-cyan-300">
                    Edit
                  </Link>
                  <DeleteProjectButton id={project.id} />
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-8 text-sm text-muted-foreground">No projects available yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

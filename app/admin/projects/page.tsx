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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Projects</p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Manage projects</h2>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 sm:w-auto"
        >
          Add project
        </Link>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-white/10">
        <div className="hidden gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-muted-foreground lg:grid lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.6fr_0.7fr_0.8fr]">
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
              <div key={project.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.6fr_0.7fr_0.8fr]">
                <div className="min-w-0">
                  <p className="font-medium">{project.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{project.summary}</p>
                </div>
                <RowItem label="Status" value={project.status} />
                <RowItem label="Stack" value={project.stack.join(', ')} />
                <div className="flex items-start lg:items-center">
                  <ToggleFeaturedButton id={project.id} featured={project.featured} />
                </div>
                <div className="flex items-start lg:items-center">
                  <ProjectOrderControls ids={ids} activeId={project.id} />
                </div>
                <div className="flex flex-wrap gap-3 text-sm lg:justify-end">
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

function RowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground lg:hidden">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

import { ProjectForm } from '@/components/admin/project-form'

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Projects</p>
        <h2 className="mt-3 text-3xl font-semibold">Create project</h2>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <ProjectForm mode="create" />
      </div>
    </div>
  )
}

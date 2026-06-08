import { ExperienceForm } from '@/components/admin/experience-form'

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Experience</p>
        <h2 className="mt-3 text-3xl font-semibold">Add experience</h2>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <ExperienceForm mode="create" />
      </div>
    </div>
  )
}

import { SkillForm } from '@/components/admin/skill-form'

export default function NewSkillPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Skills</p>
        <h2 className="mt-3 text-3xl font-semibold">Add skill</h2>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <SkillForm mode="create" />
      </div>
    </div>
  )
}

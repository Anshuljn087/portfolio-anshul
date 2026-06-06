import { notFound } from 'next/navigation'
import { SkillForm } from '@/components/admin/skill-form'
import { skillRepository } from '@/services/repositories/skill-repository'

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const skill = await skillRepository.findById(id)
  if (!skill) notFound()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Skills</p>
        <h2 className="mt-3 text-3xl font-semibold">Edit skill</h2>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <SkillForm
          mode="edit"
          skillId={skill.id}
          initialValues={{
            name: skill.name,
            slug: skill.slug,
            category: skill.category,
            level: skill.level ?? 0,
            featured: skill.featured,
          }}
        />
      </div>
    </div>
  )
}

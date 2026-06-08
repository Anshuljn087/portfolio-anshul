import { notFound } from 'next/navigation'
import { ExperienceForm } from '@/components/admin/experience-form'
import { experienceRepository } from '@/services/repositories/experience-repository'

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const experience = await experienceRepository.findById(id)

  if (!experience) notFound()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Experience</p>
        <h2 className="mt-3 text-3xl font-semibold">Edit experience</h2>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <ExperienceForm
          mode="edit"
          experienceId={experience.id}
          defaultValues={{
            company: experience.company,
            role: experience.role,
            slug: experience.slug,
            location: experience.location ?? '',
            summary: experience.summary,
            startDate: experience.startDate.toISOString().slice(0, 10),
            endDate: experience.endDate ? experience.endDate.toISOString().slice(0, 10) : '',
            featured: experience.featured,
          }}
        />
      </div>
    </div>
  )
}

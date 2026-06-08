import Link from 'next/link'
import { experienceRepository } from '@/services/repositories/experience-repository'
import { DeleteExperienceButton } from '@/components/admin/delete-experience-button'

export default async function ExperiencesPage() {
  const experiences = await experienceRepository.findMany().catch(() => [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Experience</p>
          <h2 className="mt-3 text-3xl font-semibold">Manage experience</h2>
        </div>
        <Link href="/admin/experience/new" className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
          Add experience
        </Link>
      </div>
      <div className="grid gap-4">
        {experiences.length > 0 ? (
          experiences.map((experience) => (
            <article key={experience.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                    {experience.role} · {experience.featured ? 'Featured' : 'Normal'}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{experience.company}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{experience.summary}</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {experience.location ?? 'Remote'} · {experience.startDate.toLocaleDateString()} - {experience.endDate ? experience.endDate.toLocaleDateString() : 'Present'}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <Link href={`/admin/experience/edit/${experience.id}`} className="hover:text-cyan-300">
                    Edit
                  </Link>
                  <DeleteExperienceButton id={experience.id} />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-sm text-muted-foreground">
            No experience added yet.
          </div>
        )}
      </div>
    </div>
  )
}

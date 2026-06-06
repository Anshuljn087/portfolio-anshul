import Link from 'next/link'
import { skillRepository } from '@/services/repositories/skill-repository'
import { DeleteEntityButton } from '@/components/admin/delete-entity-button'

export default async function SkillsPage() {
  const skills = await skillRepository.findMany().catch(() => [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Skills</p>
          <h2 className="mt-3 text-3xl font-semibold">Manage skills</h2>
        </div>
        <Link href="/admin/skills/new" className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
          Add skill
        </Link>
      </div>
      <div className="grid gap-4">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <article key={skill.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                    {skill.category} · {skill.featured ? 'Featured' : 'Normal'}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{skill.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Rating: {skill.level ?? 0} / 5</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <Link href={`/admin/skills/edit/${skill.id}`} className="hover:text-cyan-300">
                    Edit
                  </Link>
                  <DeleteEntityButton endpoint={`/api/admin/skills/${skill.id}`} />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-sm text-muted-foreground">
            No skills available yet.
          </div>
        )}
      </div>
    </div>
  )
}

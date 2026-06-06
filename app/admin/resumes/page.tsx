import { ResumeManager } from '@/components/admin/resume-manager'
import { resumeRepository } from '@/services/repositories/resume-repository'

export default async function ResumesPage() {
  const resumes = await resumeRepository.list().catch(() => [])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin Assets</p>
        <h2 className="mt-3 text-3xl font-semibold">Resume Library</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Upload a new resume to replace the current one, keep a rolling history of the latest
          five versions, or delete any older copy from the list below.
        </p>
      </div>
      <ResumeManager initialResumes={resumes} />
    </div>
  )
}

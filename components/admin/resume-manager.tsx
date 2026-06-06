'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ResumeRecord } from '@/services/repositories/resume-repository'

export function ResumeManager({ initialResumes }: { initialResumes: ResumeRecord[] }) {
  const router = useRouter()
  const [resumes, setResumes] = useState(initialResumes)
  const [status, setStatus] = useState<string>('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function refresh() {
    const response = await fetch('/api/admin/resumes')
    if (!response.ok) return
    const payload = (await response.json()) as { resumes: ResumeRecord[] }
    setResumes(payload.resumes)
    router.refresh()
  }

  async function uploadResume(formData: FormData) {
    setStatus('')
    const response = await fetch('/api/admin/resumes', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null
      setStatus(payload?.message ?? 'Unable to upload resume')
      return
    }

    setStatus('Resume uploaded successfully.')
    await refresh()
  }

  async function makeCurrent(id: string) {
    setBusyId(id)
    const formData = new FormData()
    formData.append('id', id)
    const response = await fetch('/api/admin/resumes', { method: 'PATCH', body: formData })
    setBusyId(null)
    if (!response.ok) {
      setStatus('Unable to update current resume')
      return
    }
    setStatus('Current resume updated.')
    await refresh()
  }

  async function deleteResume(id: string) {
    setBusyId(id)
    const formData = new FormData()
    formData.append('id', id)
    const response = await fetch('/api/admin/resumes', { method: 'DELETE', body: formData })
    setBusyId(null)
    if (!response.ok) {
      setStatus('Unable to delete resume')
      return
    }
    setStatus('Resume deleted.')
    await refresh()
  }

  return (
    <div className="grid gap-6">
      {status ? <p className="text-sm text-cyan-200">{status}</p> : null}
      <form
        className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
        onSubmit={async (event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          await uploadResume(formData)
          event.currentTarget.reset()
        }}
      >
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Resume file</span>
            <input
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Display name</span>
            <input
              name="name"
              placeholder="Resume 2026"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-fit items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background"
          >
            Upload and replace current
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        {resumes.map((resume) => (
          <article
            key={resume.id}
            className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{resume.originalName}</h3>
                {resume.isCurrent ? (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
                    Current
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{resume.filePath}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {Math.round(resume.size / 1024)} KB
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {!resume.isCurrent ? (
                <button
                  type="button"
                  disabled={busyId === resume.id}
                  onClick={() => makeCurrent(resume.id)}
                  className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-foreground disabled:opacity-60"
                >
                  Make current
                </button>
              ) : null}
              <button
                type="button"
                disabled={busyId === resume.id}
                onClick={() => deleteResume(resume.id)}
                className="rounded-2xl border border-red-400/30 px-4 py-2 text-sm text-red-200 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {resumes.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-sm text-muted-foreground">
            No resumes uploaded yet.
          </div>
        ) : null}
      </div>
    </div>
  )
}

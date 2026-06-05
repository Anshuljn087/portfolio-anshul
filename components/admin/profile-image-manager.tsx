'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function ProfileImageManager({
  current,
}: {
  current: {
    src: string | null
    alt: string | null
    blurDataUrl?: string | null
  }
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<string | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Current Image</p>
        <div className="mt-6 flex items-center gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
            {current.src ? (
              <Image
                src={current.src}
                alt={current.alt ?? 'Profile image'}
                fill
                sizes="96px"
                placeholder={current.blurDataUrl ? 'blur' : 'empty'}
                blurDataURL={current.blurDataUrl ?? undefined}
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
                None
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              {current.alt ?? 'No profile image'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Uploading a new image replaces the global image used across the site.
            </p>
          </div>
        </div>
        {status ? <p className="mt-4 text-sm text-cyan-200">{status}</p> : null}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Manage</p>
        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            startTransition(async () => {
              const response = await fetch('/api/admin/profile-image', {
                method: 'POST',
                body: formData,
              })

              if (!response.ok) {
                const payload = (await response.json()) as { message?: string }
                setStatus(payload.message ?? 'Unable to upload image')
                return
              }

              setStatus('Profile image updated successfully.')
              router.refresh()
            })
          }}
        >
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Upload Image</span>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-muted-foreground">Alt Text</span>
            <input
              name="alt"
              defaultValue={current.alt ?? ''}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">Crop Left</span>
              <input name="cropLeft" type="number" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">Crop Top</span>
              <input name="cropTop" type="number" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">Crop Width</span>
              <input name="cropWidth" type="number" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">Crop Height</span>
              <input name="cropHeight" type="number" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm" />
            </label>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-fit items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-60"
          >
            {pending ? 'Processing...' : current.src ? 'Replace Image' : 'Upload Image'}
          </button>
        </form>
        <button
          type="button"
          disabled={pending || !current.src}
          onClick={() => {
            startTransition(async () => {
              await fetch('/api/admin/profile-image', { method: 'DELETE' })
              setStatus('Profile image removed.')
              router.refresh()
            })
          }}
          className="mt-4 inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-muted-foreground disabled:opacity-60"
        >
          Remove Image
        </button>
      </section>
    </div>
  )
}

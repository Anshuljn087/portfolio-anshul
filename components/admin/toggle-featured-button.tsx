'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function ToggleFeaturedButton({
  id,
  featured,
}: {
  id: string
  featured: boolean
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await fetch(`/api/admin/projects/${id}/featured`, { method: 'PATCH' })
          router.refresh()
        })
      }}
      className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-60"
    >
      {featured ? 'Featured' : 'Feature'}
    </button>
  )
}

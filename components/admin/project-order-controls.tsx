'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function ProjectOrderControls({
  ids,
  activeId,
}: {
  ids: string[]
  activeId: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const index = ids.indexOf(activeId)

  const move = (direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= ids.length) return

    const nextIds = [...ids]
    ;[nextIds[index], nextIds[nextIndex]] = [nextIds[nextIndex], nextIds[index]]

    startTransition(async () => {
      await fetch('/api/admin/projects/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: nextIds }),
      })
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending || index <= 0}
        onClick={() => move(-1)}
        className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-40"
      >
        Up
      </button>
      <button
        type="button"
        disabled={isPending || index >= ids.length - 1}
        onClick={() => move(1)}
        className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-40"
      >
        Down
      </button>
    </div>
  )
}

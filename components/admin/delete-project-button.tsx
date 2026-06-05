'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
          router.refresh()
        })
      }}
      className="hover:text-red-300 disabled:opacity-60"
    >
      Delete
    </button>
  )
}

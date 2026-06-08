'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import type { ExperienceFormValues } from '@/types/admin'
import { z } from 'zod'

const schema = z.object({
  company: z.string().min(2, 'Company is required'),
  role: z.string().min(2, 'Role is required'),
  slug: z.string().min(2, 'Slug is required'),
  location: z.string().optional(),
  summary: z.string().min(20, 'Write a stronger summary'),
  startDate: z.string().min(4, 'Start date is required'),
  endDate: z.string().optional(),
  featured: z.boolean(),
})

type FormSchema = z.infer<typeof schema>

const defaultValues: FormSchema = {
  company: '',
  role: '',
  slug: '',
  location: '',
  summary: '',
  startDate: '',
  endDate: '',
  featured: false,
}

export function ExperienceForm({
  mode,
  experienceId,
  defaultValues: initialValues,
}: {
  mode: 'create' | 'edit'
  experienceId?: string
  defaultValues?: Partial<ExperienceFormValues>
}) {
  const router = useRouter()
  const form = useForm<FormSchema>({
    defaultValues: { ...defaultValues, ...initialValues },
  })

  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit(async (values) => {
        const parsed = schema.safeParse(values)
        if (!parsed.success) {
          parsed.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof FormSchema | undefined
            if (field) form.setError(field, { message: issue.message })
          })
          return
        }

        const formData = new FormData()
        Object.entries(parsed.data).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            if (value) formData.append(key, 'on')
            return
          }
          formData.append(key, String(value ?? ''))
        })

        const response = await fetch(
          mode === 'create' ? '/api/admin/experience' : `/api/admin/experience/${experienceId}`,
          { method: mode === 'create' ? 'POST' : 'PUT', body: formData }
        )

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string }
          form.setError('root', { message: payload.message ?? 'Unable to save experience' })
          return
        }

        router.push('/admin/experience')
        router.refresh()
      })}
    >
      {form.formState.errors.root ? (
        <p className="text-sm text-red-300">{form.formState.errors.root.message}</p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Company" error={form.formState.errors.company?.message}>
          <input {...form.register('company')} className={inputClass} />
        </Field>
        <Field label="Role" error={form.formState.errors.role?.message}>
          <input {...form.register('role')} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Slug" error={form.formState.errors.slug?.message}>
          <input {...form.register('slug')} className={inputClass} />
        </Field>
        <Field label="Location" error={form.formState.errors.location?.message}>
          <input {...form.register('location')} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Start Date" error={form.formState.errors.startDate?.message}>
          <input type="date" {...form.register('startDate')} className={inputClass} />
        </Field>
        <Field label="End Date" hint="Leave blank if current" error={form.formState.errors.endDate?.message}>
          <input type="date" {...form.register('endDate')} className={inputClass} />
        </Field>
      </div>

      <Field label="Summary" error={form.formState.errors.summary?.message}>
        <textarea {...form.register('summary')} rows={4} className={inputClass} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" {...form.register('featured')} className="h-4 w-4 rounded border-white/20 bg-transparent" />
        Featured
      </label>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex w-fit items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:opacity-70"
      >
        {form.formState.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create experience' : 'Update experience'}
      </button>
    </form>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-end justify-between gap-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        {hint ? <span className="text-xs text-muted-foreground/70">{hint}</span> : null}
      </div>
      {children}
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  )
}

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-cyan-300/40'

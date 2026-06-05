'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import type { ProjectFormValues } from '@/types/admin'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  summary: z.string().min(20, 'Write a stronger summary'),
  category: z.string().optional(),
  stack: z.string().min(2, 'Add at least one technology'),
  status: z.enum(['published', 'draft']),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  galleryImages: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  architectureNotes: z.string().optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  metrics: z.string().optional(),
  seo: z.string().optional(),
  previewImage: z.string().url().optional().or(z.literal('')),
})

type FormSchema = z.infer<typeof schema>

const defaultValues: FormSchema = {
  title: '',
  slug: '',
  summary: '',
  category: '',
  stack: '',
  status: 'draft',
  featured: false,
  sortOrder: 0,
  coverImage: '',
  galleryImages: '',
  githubUrl: '',
  liveUrl: '',
  architectureNotes: '',
  challenges: '',
  solutions: '',
  metrics: '',
  seo: '',
  previewImage: '',
}

export function ProjectForm({
  mode,
  projectId,
  defaultValues: initialValues,
}: {
  mode: 'create' | 'edit'
  projectId?: string
  defaultValues?: Partial<ProjectFormValues>
}) {
  const router = useRouter()
  const form = useForm<FormSchema>({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      stack: initialValues?.stack ?? '',
    },
  })

  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit(async (values) => {
        const parsed = schema.safeParse(values)
        if (!parsed.success) {
          parsed.error.issues.forEach((issue) => {
            const field = issue.path[0] as keyof FormSchema | undefined
            if (field) {
              form.setError(field, { message: issue.message })
            }
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
          mode === 'create' ? '/api/admin/projects' : `/api/admin/projects/${projectId}`,
          {
            method: mode === 'create' ? 'POST' : 'PUT',
            body: formData,
          }
        )

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string }
          form.setError('root', { message: payload.message ?? 'Unable to save project' })
          return
        }

        router.push('/admin/projects')
        router.refresh()
      })}
    >
      {form.formState.errors.root ? (
        <p className="text-sm text-red-300">{form.formState.errors.root.message}</p>
      ) : null}
      <Field label="Title" error={form.formState.errors.title?.message}>
        <input {...form.register('title')} className={inputClass} />
      </Field>
      <Field label="Slug" error={form.formState.errors.slug?.message}>
        <input {...form.register('slug')} className={inputClass} />
      </Field>
      <Field label="Summary" error={form.formState.errors.summary?.message}>
        <textarea {...form.register('summary')} rows={5} className={inputClass} />
      </Field>
      <Field label="Category" hint="Example: Enterprise / AI / Realtime" error={form.formState.errors.category?.message}>
        <input {...form.register('category')} className={inputClass} />
      </Field>
      <Field label="Sort Order" hint="Lower appears first" error={form.formState.errors.sortOrder?.message}>
        <input type="number" min={0} {...form.register('sortOrder', { valueAsNumber: true })} className={inputClass} />
      </Field>
      <Field label="Stack" hint="Comma separated" error={form.formState.errors.stack?.message}>
        <input {...form.register('stack')} className={inputClass} />
      </Field>
      <Field label="Cover Image" hint="Absolute image URL" error={form.formState.errors.coverImage?.message}>
        <input {...form.register('coverImage')} className={inputClass} />
      </Field>
      <Field
        label="Gallery Images"
        hint="Comma separated image URLs"
        error={form.formState.errors.galleryImages?.message}
      >
        <input {...form.register('galleryImages')} className={inputClass} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Github URL" error={form.formState.errors.githubUrl?.message}>
          <input {...form.register('githubUrl')} className={inputClass} />
        </Field>
        <Field label="Live URL" error={form.formState.errors.liveUrl?.message}>
          <input {...form.register('liveUrl')} className={inputClass} />
        </Field>
      </div>
      <Field label="Architecture Notes" error={form.formState.errors.architectureNotes?.message}>
        <textarea {...form.register('architectureNotes')} rows={4} className={inputClass} />
      </Field>
      <Field label="Challenges" error={form.formState.errors.challenges?.message}>
        <textarea {...form.register('challenges')} rows={4} className={inputClass} />
      </Field>
      <Field label="Solutions" error={form.formState.errors.solutions?.message}>
        <textarea {...form.register('solutions')} rows={4} className={inputClass} />
      </Field>
      <Field label="Metrics" hint="JSON string" error={form.formState.errors.metrics?.message}>
        <textarea {...form.register('metrics')} rows={4} className={inputClass} />
      </Field>
      <Field label="SEO Metadata" hint="JSON string" error={form.formState.errors.seo?.message}>
        <textarea {...form.register('seo')} rows={4} className={inputClass} />
      </Field>
      <Field label="Preview Image" hint="Absolute image URL" error={form.formState.errors.previewImage?.message}>
        <input {...form.register('previewImage')} className={inputClass} />
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" {...form.register('featured')} className="h-4 w-4 rounded border-white/20 bg-transparent" />
          Featured
        </label>
        <select {...form.register('status')} className={inputClass}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex w-fit items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:opacity-70"
      >
        {form.formState.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create project' : 'Update project'}
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

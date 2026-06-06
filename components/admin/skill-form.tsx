'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  category: z.string().min(2, 'Category is required'),
  level: z.coerce.number().int().min(0).max(5),
  featured: z.boolean(),
})

const categoryOptions = [
  'Frontend',
  'Backend',
  'Cloud',
  'DB',
  'Gen AI',
  'Realtime',
  'Mobile',
  'DevOps',
] as const

type FormSchema = z.infer<typeof schema>

const defaultValues: FormSchema = {
  name: '',
  slug: '',
  category: '',
  level: 0,
  featured: false,
}

export function SkillForm({
  mode,
  skillId,
  initialValues,
}: {
  mode: 'create' | 'edit'
  skillId?: string
  initialValues?: Partial<FormSchema>
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
          formData.append(key, String(value))
        })

        const response = await fetch(
          mode === 'create' ? '/api/admin/skills' : `/api/admin/skills/${skillId}`,
          { method: mode === 'create' ? 'POST' : 'PUT', body: formData }
        )

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string }
          form.setError('root', { message: payload.message ?? 'Unable to save skill' })
          return
        }

        router.push('/admin/skills')
        router.refresh()
      })}
    >
      {form.formState.errors.root ? (
        <p className="text-sm text-red-300">{form.formState.errors.root.message}</p>
      ) : null}
      <Field label="Name" error={form.formState.errors.name?.message}>
        <input {...form.register('name')} className={inputClass} />
      </Field>
      <Field label="Slug" error={form.formState.errors.slug?.message}>
        <input {...form.register('slug')} className={inputClass} />
      </Field>
      <Field label="Category" error={form.formState.errors.category?.message}>
        <select {...form.register('category')} className={`${inputClass} bg-background text-foreground`}>
          <option value="" className="bg-background text-foreground">
            Select a category
          </option>
          {categoryOptions.map((category) => (
            <option key={category} value={category} className="bg-background text-foreground">
              {category}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Rating" hint="0-5" error={form.formState.errors.level?.message}>
        <input type="number" min={0} max={5} {...form.register('level', { valueAsNumber: true })} className={inputClass} />
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
        {form.formState.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create skill' : 'Update skill'}
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

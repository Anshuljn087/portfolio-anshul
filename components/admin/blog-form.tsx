'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { BlogEditor } from '@/components/admin/blog-editor'
import type { BlogFormValues } from '@/types/admin-blog'

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(20),
  contentHtml: z.string().min(20),
  contentMarkdown: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['published', 'draft']),
  featured: z.boolean(),
  tags: z.string().optional(),
  seo: z.string().optional(),
})

type FormSchema = z.infer<typeof schema>

export function BlogForm({
  mode,
  blogId,
  defaultValues: initialValues,
}: {
  mode: 'create' | 'edit'
  blogId?: string
  defaultValues?: Partial<BlogFormValues>
}) {
  const router = useRouter()
  const [html, setHtml] = useState(initialValues?.contentHtml ?? '<p></p>')
  const form = useForm<FormSchema>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      contentHtml: '',
      contentMarkdown: '',
      coverImage: '',
      status: 'draft',
      featured: false,
      tags: '',
      seo: '',
      ...initialValues,
    },
  })

  useEffect(() => {
    form.setValue('contentHtml', html)
  }, [html, form])

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
          mode === 'create' ? '/api/admin/blogs' : `/api/admin/blogs/${blogId}`,
          {
            method: mode === 'create' ? 'POST' : 'PUT',
            body: formData,
          }
        )

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string }
          form.setError('root', { message: payload.message ?? 'Unable to save blog' })
          return
        }

        router.push('/admin/blogs')
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
      <Field label="Excerpt" error={form.formState.errors.excerpt?.message}>
        <textarea {...form.register('excerpt')} rows={3} className={inputClass} />
      </Field>
      <Field label="Tags" hint="Comma separated" error={form.formState.errors.tags?.message}>
        <input {...form.register('tags')} className={inputClass} />
      </Field>
      <Field label="Cover Image" error={form.formState.errors.coverImage?.message}>
        <input {...form.register('coverImage')} className={inputClass} />
      </Field>
      <Field label="SEO Metadata" hint="JSON string" error={form.formState.errors.seo?.message}>
        <textarea {...form.register('seo')} rows={3} className={inputClass} />
      </Field>
      <Field label="Content">
        <BlogEditor
          value={html}
          onChange={(nextHtml) => {
            setHtml(nextHtml)
            form.setValue('contentHtml', nextHtml, { shouldValidate: true })
          }}
        />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Markdown Source">
          <textarea {...form.register('contentMarkdown')} rows={10} className={inputClass} />
        </Field>
        <div className="grid gap-4">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" {...form.register('featured')} className="h-4 w-4 rounded border-white/20 bg-transparent" />
            Featured
          </label>
          <select {...form.register('status')} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="inline-flex w-fit items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:opacity-70"
          >
            {form.formState.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create blog' : 'Update blog'}
          </button>
        </div>
      </div>
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

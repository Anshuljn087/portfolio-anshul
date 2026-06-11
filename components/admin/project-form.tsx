'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ProjectFormValues } from '@/types/admin'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  projectType: z.enum(['PERSONAL', 'PROFESSIONAL']),
  isConfidential: z.boolean(),
  slug: z.string().min(2, 'Slug is required'),
  summary: z.string().min(20, 'Write a stronger summary'),
  duration: z.string().min(2, 'Duration is required'),
  category: z.string().optional(),
  businessDomain: z.string().optional(),
  responsibilities: z.string().optional(),
  myContributions: z.string().optional(),
  keyAchievements: z.string().optional(),
  teamSize: z.string().optional(),
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
  showGithub: z.boolean(),
  showLiveUrl: z.boolean(),
  showScreenshots: z.boolean(),
  showMetrics: z.boolean(),
  showArchitecture: z.boolean(),
  showChallenges: z.boolean(),
  showSolutions: z.boolean(),
})

type FormSchema = z.infer<typeof schema>

const defaultValues: FormSchema = {
  title: '',
  projectType: 'PROFESSIONAL',
  isConfidential: true,
  slug: '',
  summary: '',
  duration: '',
  category: '',
  businessDomain: '',
  responsibilities: '',
  myContributions: '',
  keyAchievements: '',
  teamSize: '',
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
  showGithub: false,
  showLiveUrl: false,
  showScreenshots: false,
  showMetrics: false,
  showArchitecture: false,
  showChallenges: false,
  showSolutions: false,
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
      projectType: initialValues?.projectType ?? 'PROFESSIONAL',
      isConfidential: initialValues?.isConfidential ?? true,
      stack: initialValues?.stack ?? '',
      duration: initialValues?.duration ?? '',
      businessDomain: initialValues?.businessDomain ?? '',
      responsibilities: initialValues?.responsibilities ?? '',
      myContributions: initialValues?.myContributions ?? '',
      keyAchievements: initialValues?.keyAchievements ?? '',
      teamSize: initialValues?.teamSize ?? '',
      showGithub: initialValues?.showGithub ?? false,
      showLiveUrl: initialValues?.showLiveUrl ?? false,
      showScreenshots: initialValues?.showScreenshots ?? false,
      showMetrics: initialValues?.showMetrics ?? false,
      showArchitecture: initialValues?.showArchitecture ?? false,
      showChallenges: initialValues?.showChallenges ?? false,
      showSolutions: initialValues?.showSolutions ?? false,
    },
  })

  const projectType = form.watch('projectType')
  const isPersonal = projectType === 'PERSONAL'

  const visibilityDefaults = useMemo(
    () => ({
      showGithub: isPersonal,
      showLiveUrl: isPersonal,
      showScreenshots: isPersonal,
      showMetrics: true,
      showArchitecture: isPersonal,
      showChallenges: isPersonal,
      showSolutions: isPersonal,
    }),
    [isPersonal]
  )

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

        const nextValues = {
          ...parsed.data,
          showGithub: parsed.data.showGithub ?? visibilityDefaults.showGithub,
          showLiveUrl: parsed.data.showLiveUrl ?? visibilityDefaults.showLiveUrl,
          showScreenshots: parsed.data.showScreenshots ?? visibilityDefaults.showScreenshots,
          showMetrics: parsed.data.showMetrics ?? visibilityDefaults.showMetrics,
          showArchitecture: parsed.data.showArchitecture ?? visibilityDefaults.showArchitecture,
          showChallenges: parsed.data.showChallenges ?? visibilityDefaults.showChallenges,
          showSolutions: parsed.data.showSolutions ?? visibilityDefaults.showSolutions,
        }

        const formData = new FormData()
        Object.entries(nextValues).forEach(([key, value]) => {
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

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" error={form.formState.errors.title?.message}>
          <input {...form.register('title')} className={inputClass} />
        </Field>
        <Field label="Project Type" error={form.formState.errors.projectType?.message}>
          <select {...form.register('projectType')} className={inputClass}>
            <option value="PROFESSIONAL">Professional</option>
            <option value="PERSONAL">Personal</option>
          </select>
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" {...form.register('isConfidential')} className="h-4 w-4 rounded border-white/20 bg-transparent" />
          Confidential project
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" {...form.register('featured')} className="h-4 w-4 rounded border-white/20 bg-transparent" />
          Featured
        </label>
        <select {...form.register('status')} className={inputClass}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Slug" error={form.formState.errors.slug?.message}>
          <input {...form.register('slug')} className={inputClass} />
        </Field>
        <Field label="Duration" hint="Example: 6 months / 2024 / Ongoing" error={form.formState.errors.duration?.message}>
          <input {...form.register('duration')} className={inputClass} />
        </Field>
      </div>

      <Field label="Short Description" error={form.formState.errors.summary?.message}>
        <textarea {...form.register('summary')} rows={4} className={inputClass} />
      </Field>

      <Field label="Technologies" hint="Comma separated" error={form.formState.errors.stack?.message}>
        <input {...form.register('stack')} className={inputClass} />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Category" hint="Example: Enterprise / AI / Realtime" error={form.formState.errors.category?.message}>
          <input {...form.register('category')} className={inputClass} />
        </Field>
        <Field label="Sort Order" hint="Lower appears first" error={form.formState.errors.sortOrder?.message}>
          <input type="number" min={0} {...form.register('sortOrder', { valueAsNumber: true })} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Business Domain" error={form.formState.errors.businessDomain?.message}>
          <input {...form.register('businessDomain')} className={inputClass} />
        </Field>
        <Field label="Team Size" error={form.formState.errors.teamSize?.message}>
          <input {...form.register('teamSize')} className={inputClass} />
        </Field>
      </div>

      <Field label="Responsibilities" error={form.formState.errors.responsibilities?.message}>
        <textarea {...form.register('responsibilities')} rows={4} className={inputClass} />
      </Field>
      <Field label="My Contributions" error={form.formState.errors.myContributions?.message}>
        <textarea {...form.register('myContributions')} rows={4} className={inputClass} />
      </Field>
      <Field label="Key Achievements" error={form.formState.errors.keyAchievements?.message}>
        <textarea {...form.register('keyAchievements')} rows={4} className={inputClass} />
      </Field>

      <Field label="Cover Image" hint="Absolute image URL" error={form.formState.errors.coverImage?.message}>
        <input {...form.register('coverImage')} className={inputClass} />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Gallery Images"
          hint="Comma separated image URLs"
          error={form.formState.errors.galleryImages?.message}
        >
          <input {...form.register('galleryImages')} className={inputClass} />
        </Field>
        <Field label="Preview Image" hint="Absolute image URL" error={form.formState.errors.previewImage?.message}>
          <input {...form.register('previewImage')} className={inputClass} />
        </Field>
      </div>

      <VisibilitySection
        form={form}
        projectType={projectType}
        isPersonal={isPersonal}
        visibilityDefaults={visibilityDefaults}
      />

      {isPersonal ? (
        <>
          <Field label="Github URL" error={form.formState.errors.githubUrl?.message}>
            <input {...form.register('githubUrl')} className={inputClass} />
          </Field>
          <Field label="Live URL" error={form.formState.errors.liveUrl?.message}>
            <input {...form.register('liveUrl')} className={inputClass} />
          </Field>
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
        </>
      ) : (
        <>
          <Field label="GitHub URL" hint="Optional for professional work" error={form.formState.errors.githubUrl?.message}>
            <input {...form.register('githubUrl')} className={inputClass} />
          </Field>
          <Field label="Live URL" hint="Optional for professional work" error={form.formState.errors.liveUrl?.message}>
            <input {...form.register('liveUrl')} className={inputClass} />
          </Field>
          <Field label="Summary / Case Study Notes" error={form.formState.errors.architectureNotes?.message}>
            <textarea
              {...form.register('architectureNotes')}
              rows={4}
              className={inputClass}
              placeholder="Use this for business context, responsibilities, and outcomes without exposing confidential details."
            />
          </Field>
          <Field label="SEO Metadata" hint="JSON string" error={form.formState.errors.seo?.message}>
            <textarea {...form.register('seo')} rows={4} className={inputClass} />
          </Field>
        </>
      )}

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:opacity-70 sm:w-fit"
      >
        {form.formState.isSubmitting ? 'Saving...' : mode === 'create' ? 'Create project' : 'Update project'}
      </button>
    </form>
  )
}

function VisibilitySection({
  form,
  projectType,
  isPersonal,
  visibilityDefaults,
}: {
  form: ReturnType<typeof useForm<FormSchema>>
  projectType: FormSchema['projectType']
  isPersonal: boolean
  visibilityDefaults: {
    showGithub: boolean
    showLiveUrl: boolean
    showScreenshots: boolean
    showMetrics: boolean
    showArchitecture: boolean
    showChallenges: boolean
    showSolutions: boolean
  }
}) {
  const label = projectType === 'PERSONAL' ? 'Personal Project Controls' : 'Professional Project Controls'
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">{label}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ToggleField form={form} name="showGithub" label="Show GitHub" defaultChecked={visibilityDefaults.showGithub} />
        <ToggleField form={form} name="showLiveUrl" label="Show Live URL" defaultChecked={visibilityDefaults.showLiveUrl} />
        <ToggleField form={form} name="showScreenshots" label="Show Screenshots" defaultChecked={visibilityDefaults.showScreenshots} />
        <ToggleField form={form} name="showMetrics" label="Show Metrics" defaultChecked={visibilityDefaults.showMetrics} />
        <ToggleField form={form} name="showArchitecture" label="Show Architecture Section" defaultChecked={visibilityDefaults.showArchitecture} />
        <ToggleField form={form} name="showChallenges" label="Show Challenges Section" defaultChecked={visibilityDefaults.showChallenges} />
        <ToggleField form={form} name="showSolutions" label="Show Solutions Section" defaultChecked={visibilityDefaults.showSolutions} />
      </div>
      {!isPersonal ? (
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Professional projects can stay confidential while still showing the business outcome and your contributions.
        </p>
      ) : null}
    </div>
  )
}

function ToggleField({
  form,
  name,
  label,
  defaultChecked,
}: {
  form: ReturnType<typeof useForm<FormSchema>>
  name: keyof Pick<
    FormSchema,
    'showGithub' | 'showLiveUrl' | 'showScreenshots' | 'showMetrics' | 'showArchitecture' | 'showChallenges' | 'showSolutions'
  >
  label: string
  defaultChecked: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <input type="checkbox" defaultChecked={defaultChecked} {...form.register(name)} className="h-4 w-4 rounded border-white/20 bg-transparent" />
      {label}
    </label>
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

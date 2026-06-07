'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const skillSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  category: z.string().min(2, 'Category is required'),
  level: z.coerce.number().int().min(0).max(5),
  sortBy: z.enum(['NAME', 'CATEGORY']),
  featured: z.boolean(),
})

const createSchema = z.object({
  skills: z.array(skillSchema).min(1, 'Add at least one skill'),
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

type SkillSchema = z.infer<typeof skillSchema>
type CreateFormSchema = z.infer<typeof createSchema>
type EditFormSchema = SkillSchema

const defaultSkillValues: SkillSchema = {
  name: '',
  slug: '',
  category: '',
  level: 0,
  sortBy: 'CATEGORY',
  featured: false,
}

export function SkillForm({
  mode,
  skillId,
  initialValues,
}: {
  mode: 'create' | 'edit'
  skillId?: string
  initialValues?: Partial<SkillSchema>
}) {
  const router = useRouter()
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const createForm = useForm<CreateFormSchema>({
    defaultValues:
      mode === 'create'
        ? {
            skills: [defaultSkillValues],
          }
        : undefined,
  })
  const editForm = useForm<EditFormSchema>({
    defaultValues: { ...defaultSkillValues, ...initialValues },
  })
  const form = mode === 'create' ? createForm : editForm
  const fieldArray = useFieldArray({
    control: createForm.control,
    name: 'skills',
  })
  const canImport = mode === 'create'

  const submitButtonLabel = useMemo(() => {
    if (form.formState.isSubmitting) return 'Saving...'
    return mode === 'create' ? 'Create skills' : 'Update skill'
  }, [form.formState.isSubmitting, mode])

  async function handleExcelImport(file: File) {
    setImportStatus(null)
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/admin/skills/import', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json()) as {
        message?: string
        imported?: number
        skipped?: number
        skippedSlugs?: string[]
      }

      if (!response.ok) {
        throw new Error(payload.message ?? 'Unable to import skills')
      }

      const skippedNote = payload.skippedSlugs?.length
        ? ` Skipped: ${payload.skippedSlugs.join(', ')}.`
        : ''
      setImportStatus(
        `Imported ${payload.imported ?? 0} skills. Skipped ${payload.skipped ?? 0} existing duplicates.${skippedNote}`
      )
      router.refresh()
    } catch (error) {
      setImportStatus(error instanceof Error ? error.message : 'Unable to import skills')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="grid gap-6">
      {canImport ? (
        <div className="rounded-[1.5rem] border border-dashed border-cyan-300/30 bg-cyan-300/5 p-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Import from Excel</p>
            <p className="text-sm text-muted-foreground">
        Upload an `.xlsx` file with columns: `name`, `slug`, `category`, `level`, `sortBy`, `featured`.
        Existing skills are skipped by `slug`.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void handleExcelImport(file)
                event.currentTarget.value = ''
              }}
              disabled={importing}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-2xl file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-medium file:text-background hover:file:cursor-pointer"
            />
            {importing ? (
              <span className="text-sm text-cyan-300">Importing...</span>
            ) : null}
          </div>
          {importStatus ? <p className="mt-3 text-sm text-muted-foreground">{importStatus}</p> : null}
        </div>
      ) : null}
      <form
        className="grid gap-5"
        onSubmit={form.handleSubmit(async (values) => {
          const parsed = mode === 'create' ? createSchema.safeParse(values) : skillSchema.safeParse(values)
          if (!parsed.success) {
            parsed.error.issues.forEach((issue) => {
              const path = issue.path[0]
              if (typeof path === 'string' && path in form.formState.errors) {
                form.setError(path as keyof typeof form.formState.errors, { message: issue.message })
              }
            })
            return
          }

          const response = await fetch(
            mode === 'create' ? '/api/admin/skills' : `/api/admin/skills/${skillId}`,
            {
              method: mode === 'create' ? 'POST' : 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsed.data),
            }
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
      {mode === 'create' ? (
        <div className="grid gap-4">
          {fieldArray.fields.map((field, index) => (
            <div key={field.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-foreground">Skill {index + 1}</p>
                {fieldArray.fields.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => fieldArray.remove(index)}
                    className="text-sm text-red-300 hover:text-red-200"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Name" error={createForm.formState.errors.skills?.[index]?.name?.message}>
                  <input
                    {...createForm.register(`skills.${index}.name`)}
                    className={inputClass}
                    placeholder="React"
                  />
                </Field>
                <Field label="Slug" error={createForm.formState.errors.skills?.[index]?.slug?.message}>
                  <input
                    {...createForm.register(`skills.${index}.slug`)}
                    className={inputClass}
                    placeholder="react"
                  />
                </Field>
                <Field label="Category" error={createForm.formState.errors.skills?.[index]?.category?.message}>
                  <select
                    {...createForm.register(`skills.${index}.category`)}
                    className={`${inputClass} bg-background text-foreground`}
                  >
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
                <Field label="Rating" hint="0-5" error={createForm.formState.errors.skills?.[index]?.level?.message}>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    inputMode="numeric"
                    {...createForm.register(`skills.${index}.level`, {
                      valueAsNumber: false,
                      setValueAs: (value) => {
                        if (value === '') return 0
                        const parsed = Number(value)
                        return Number.isFinite(parsed) ? parsed : 0
                      },
                    })}
                    onWheel={(event) => event.currentTarget.blur()}
                    className={inputClass}
                  />
                </Field>
                <Field label="Sort By" error={createForm.formState.errors.skills?.[index]?.sortBy?.message}>
                  <select
                    {...createForm.register(`skills.${index}.sortBy`)}
                    className={`${inputClass} bg-background text-foreground`}
                  >
                    <option value="CATEGORY" className="bg-background text-foreground">
                      Category
                    </option>
                    <option value="NAME" className="bg-background text-foreground">
                      Name
                    </option>
                  </select>
                </Field>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  {...createForm.register(`skills.${index}.featured`)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                Featured
              </label>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fieldArray.append(defaultSkillValues)}
              className="inline-flex w-fit items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-foreground transition hover:bg-white/5"
            >
              Add another skill
            </button>
          </div>
        </div>
      ) : (
        <>
          <Field label="Name" error={editForm.formState.errors.name?.message}>
            <input {...editForm.register('name')} className={inputClass} />
          </Field>
          <Field label="Slug" error={editForm.formState.errors.slug?.message}>
            <input {...editForm.register('slug')} className={inputClass} />
          </Field>
          <Field label="Category" error={editForm.formState.errors.category?.message}>
            <select {...editForm.register('category')} className={`${inputClass} bg-background text-foreground`}>
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
          <Field label="Rating" hint="0-5" error={editForm.formState.errors.level?.message}>
            <input
              type="number"
              min={0}
              max={5}
              step={1}
              inputMode="numeric"
              {...editForm.register('level', {
                valueAsNumber: false,
                setValueAs: (value) => {
                  if (value === '') return 0
                  const parsed = Number(value)
                  return Number.isFinite(parsed) ? parsed : 0
                },
              })}
              onWheel={(event) => event.currentTarget.blur()}
              className={inputClass}
            />
          </Field>
          <Field label="Sort By" error={editForm.formState.errors.sortBy?.message}>
            <select {...editForm.register('sortBy')} className={`${inputClass} bg-background text-foreground`}>
              <option value="CATEGORY" className="bg-background text-foreground">
                Category
              </option>
              <option value="NAME" className="bg-background text-foreground">
                Name
              </option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" {...editForm.register('featured')} className="h-4 w-4 rounded border-white/20 bg-transparent" />
            Featured
          </label>
        </>
      )}
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="inline-flex w-fit items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {submitButtonLabel}
        </button>
      </form>
    </div>
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

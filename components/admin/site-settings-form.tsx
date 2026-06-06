'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export type FormSchema = {
  homepage: {
    order: string
    sections: {
      hero: boolean
      about: boolean
      skills: boolean
      experience: boolean
      projects: boolean
      blogs: boolean
      contact: boolean
    }
    limits: {
      featuredProjects: number
      featuredBlogs: number
    }
    heroSection: {
      badge: string
      shippingBadge: string
      title: string
      description: string
      focus: string
      frontendLabel: string
      frontendValue: string
      backendLabel: string
      backendValue: string
    }
    aboutSection: {
      eyebrow: string
      title: string
      description: string
      profileName: string
      profileRole: string
      body: string
    }
    projectsSection: {
      eyebrow: string
      title: string
      description: string
    }
    blogsSection: {
      eyebrow: string
      title: string
      description: string
    }
    contactSection: {
      eyebrow: string
      title: string
      description: string
      ctaLabel: string
    }
  }
  socialLinks?: Array<{
    label: string
    href: string
    enabled?: boolean
  }>
  profileImage?: string | null
  profileImageAlt?: string | null
  profileImageBlurDataUrl?: string | null
}

export function SiteSettingsForm({ initialValues }: { initialValues: FormSchema }) {
  const router = useRouter()
  const form = useForm<FormSchema>({ defaultValues: initialValues })
  const [savingSection, setSavingSection] = useState<string | null>(null)

  useEffect(() => {
    form.reset(initialValues)
  }, [form, initialValues])

  return (
    <div className="grid gap-6">
      {form.formState.errors.root ? (
        <p className="text-sm text-red-300">{form.formState.errors.root.message}</p>
      ) : null}

      <Accordion
        title="Homepage layout"
        description="Show, hide, and reorder the homepage sections."
        defaultOpen
        onSave={() => saveHomepageLayout(form.getValues(), form.setError, router, setSavingSection)}
        saving={savingSection === 'homepage'}
      >
        <Field label="Section order" error={form.formState.errors.homepage?.order?.message}>
          <textarea {...form.register('homepage.order')} rows={3} className={inputClass} />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          {sectionToggleFields.map((sectionKey) => (
            <label key={sectionKey} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                {...form.register(`homepage.sections.${sectionKey}` as const)}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              Show {sectionKey}
            </label>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Featured projects shown">
            <input
              type="number"
              min={0}
              max={12}
              {...form.register('homepage.limits.featuredProjects')}
              className={inputClass}
            />
          </Field>
          <Field label="Featured blogs shown">
            <input
              type="number"
              min={0}
              max={12}
              {...form.register('homepage.limits.featuredBlogs')}
              className={inputClass}
            />
          </Field>
        </div>
      </Accordion>

      <Accordion
        title="Hero section"
        description="Manage the top of the homepage."
        onSave={() => saveHeroSection(form.getValues(), form.setError, router, setSavingSection)}
        saving={savingSection === 'hero'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Badge">
            <input {...form.register('homepage.heroSection.badge')} className={inputClass} />
          </Field>
          <Field label="Shipping badge">
            <input {...form.register('homepage.heroSection.shippingBadge')} className={inputClass} />
          </Field>
          <Field label="Hero title">
            <input {...form.register('homepage.heroSection.title')} className={inputClass} />
          </Field>
          <Field label="Hero description">
            <textarea {...form.register('homepage.heroSection.description')} rows={4} className={inputClass} />
          </Field>
          <Field label="Focus line">
            <input {...form.register('homepage.heroSection.focus')} className={inputClass} />
          </Field>
          <Field label="Frontend label">
            <input {...form.register('homepage.heroSection.frontendLabel')} className={inputClass} />
          </Field>
          <Field label="Frontend value">
            <input {...form.register('homepage.heroSection.frontendValue')} className={inputClass} />
          </Field>
          <Field label="Backend label">
            <input {...form.register('homepage.heroSection.backendLabel')} className={inputClass} />
          </Field>
          <Field label="Backend value">
            <input {...form.register('homepage.heroSection.backendValue')} className={inputClass} />
          </Field>
        </div>
      </Accordion>

      <Accordion
        title="About section"
        description="Editable copy for the about block."
        onSave={() => saveAboutSection(form.getValues(), form.setError, router, setSavingSection)}
        saving={savingSection === 'about'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input {...form.register('homepage.aboutSection.eyebrow')} className={inputClass} />
          </Field>
          <Field label="Title">
            <input {...form.register('homepage.aboutSection.title')} className={inputClass} />
          </Field>
          <Field label="Profile name">
            <input {...form.register('homepage.aboutSection.profileName')} className={inputClass} />
          </Field>
          <Field label="Profile role">
            <input {...form.register('homepage.aboutSection.profileRole')} className={inputClass} />
          </Field>
        </div>
        <Field label="Description">
          <textarea {...form.register('homepage.aboutSection.description')} rows={4} className={inputClass} />
        </Field>
        <Field label="Body">
          <textarea {...form.register('homepage.aboutSection.body')} rows={6} className={inputClass} />
        </Field>
      </Accordion>

      <Accordion
        title="Projects section"
        description="Headline and summary for featured projects."
        onSave={() => saveProjectsSection(form.getValues(), form.setError, router, setSavingSection)}
        saving={savingSection === 'projects'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input {...form.register('homepage.projectsSection.eyebrow')} className={inputClass} />
          </Field>
          <Field label="Title">
            <input {...form.register('homepage.projectsSection.title')} className={inputClass} />
          </Field>
        </div>
        <Field label="Description">
          <textarea {...form.register('homepage.projectsSection.description')} rows={4} className={inputClass} />
        </Field>
      </Accordion>

      <Accordion
        title="Blogs section"
        description="Headline and summary for featured blogs."
        onSave={() => saveBlogsSection(form.getValues(), form.setError, router, setSavingSection)}
        saving={savingSection === 'blogs'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input {...form.register('homepage.blogsSection.eyebrow')} className={inputClass} />
          </Field>
          <Field label="Title">
            <input {...form.register('homepage.blogsSection.title')} className={inputClass} />
          </Field>
        </div>
        <Field label="Description">
          <textarea {...form.register('homepage.blogsSection.description')} rows={4} className={inputClass} />
        </Field>
      </Accordion>

      <Accordion
        title="Contact section"
        description="Editable copy for the contact callout."
        onSave={() => saveContactSection(form.getValues(), form.setError, router, setSavingSection)}
        saving={savingSection === 'contact'}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow">
            <input {...form.register('homepage.contactSection.eyebrow')} className={inputClass} />
          </Field>
          <Field label="Title">
            <input {...form.register('homepage.contactSection.title')} className={inputClass} />
          </Field>
        </div>
        <Field label="Description">
          <textarea {...form.register('homepage.contactSection.description')} rows={4} className={inputClass} />
        </Field>
        <Field label="CTA label">
          <input {...form.register('homepage.contactSection.ctaLabel')} className={inputClass} />
        </Field>
      </Accordion>
    </div>
  )
}

function Accordion({
  title,
  description,
  defaultOpen,
  onSave,
  saving,
  children,
}: {
  title: string
  description: string
  defaultOpen?: boolean
  onSave: () => void | Promise<void>
  saving?: boolean
  children: React.ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="mt-1 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-muted-foreground transition group-open:bg-white/10 group-open:text-foreground">
          Toggle
        </span>
      </summary>
      <div className="mt-5 grid gap-5">{children}</div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="mt-2 inline-flex w-fit items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 disabled:opacity-70"
      >
        {saving ? 'Saving...' : 'Save section'}
      </button>
    </details>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  )
}

function parseOrder(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const sectionToggleFields = ['hero', 'about', 'skills', 'experience', 'projects', 'blogs', 'contact'] as const

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-cyan-300/40'

async function submitSettings(
  router: ReturnType<typeof useRouter>,
  setSavingSection: React.Dispatch<React.SetStateAction<string | null>>,
  section: string,
  payload: Record<string, unknown>,
  setError: (name: 'root', error: { message?: string }) => void,
) {
  setSavingSection(section)

  try {
    const response = await fetch('/api/admin/site-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let message = 'Unable to save settings'

      try {
        const payload = (await response.json()) as { message?: string }
        message = payload.message ?? message
      } catch {
        message = response.statusText || message
      }

      setError('root', { message })
      return
    }

    router.refresh()
  } finally {
    setSavingSection(null)
  }
}

function buildHomepagePayload(values: FormSchema['homepage']) {
  return {
    homepage: {
      ...values,
      order: parseOrder(values.order),
    },
  }
}

function saveHomepageLayout(
  values: FormSchema,
  setError: (name: 'root', error: { message?: string }) => void,
  router: ReturnType<typeof useRouter>,
  setSavingSection: React.Dispatch<React.SetStateAction<string | null>>,
) {
  const payload = buildHomepagePayload({
    ...values.homepage,
    heroSection: values.homepage.heroSection,
    aboutSection: values.homepage.aboutSection,
    projectsSection: values.homepage.projectsSection,
    blogsSection: values.homepage.blogsSection,
    contactSection: values.homepage.contactSection,
  })
  return submitSettings(router, setSavingSection, 'homepage', payload, setError)
}

function saveHeroSection(
  values: FormSchema,
  setError: (name: 'root', error: { message?: string }) => void,
  router: ReturnType<typeof useRouter>,
  setSavingSection: React.Dispatch<React.SetStateAction<string | null>>,
) {
  return submitSettings(
    router,
    setSavingSection,
    'hero',
    { homepage: { heroSection: values.homepage.heroSection } },
    setError,
  )
}

function saveAboutSection(
  values: FormSchema,
  setError: (name: 'root', error: { message?: string }) => void,
  router: ReturnType<typeof useRouter>,
  setSavingSection: React.Dispatch<React.SetStateAction<string | null>>,
) {
  return submitSettings(
    router,
    setSavingSection,
    'about',
    { homepage: { aboutSection: values.homepage.aboutSection } },
    setError,
  )
}

function saveProjectsSection(
  values: FormSchema,
  setError: (name: 'root', error: { message?: string }) => void,
  router: ReturnType<typeof useRouter>,
  setSavingSection: React.Dispatch<React.SetStateAction<string | null>>,
) {
  return submitSettings(
    router,
    setSavingSection,
    'projects',
    { homepage: { projectsSection: values.homepage.projectsSection } },
    setError,
  )
}

function saveBlogsSection(
  values: FormSchema,
  setError: (name: 'root', error: { message?: string }) => void,
  router: ReturnType<typeof useRouter>,
  setSavingSection: React.Dispatch<React.SetStateAction<string | null>>,
) {
  return submitSettings(
    router,
    setSavingSection,
    'blogs',
    { homepage: { blogsSection: values.homepage.blogsSection } },
    setError,
  )
}

function saveContactSection(
  values: FormSchema,
  setError: (name: 'root', error: { message?: string }) => void,
  router: ReturnType<typeof useRouter>,
  setSavingSection: React.Dispatch<React.SetStateAction<string | null>>,
) {
  return submitSettings(
    router,
    setSavingSection,
    'contact',
    { homepage: { contactSection: values.homepage.contactSection } },
    setError,
  )
}

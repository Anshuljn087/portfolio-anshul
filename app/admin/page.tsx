import Link from 'next/link'
import { listProjects } from '@/services/project-store'
import { siteSettingsRepository } from '@/services/repositories/site-settings-repository'
import { ProfileAvatar } from '@/components/media/profile-avatar'

export default async function AdminDashboardPage() {
  const [projects, settings] = await Promise.all([
    listProjects(),
    siteSettingsRepository.findLatest(),
  ])
  const featuredCount = projects.filter((project) => project.featured).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Overview</p>
          <h2 className="mt-3 text-3xl font-semibold">Dashboard</h2>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex w-fit items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background"
        >
          New project
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Projects" value={projects.length} />
        <Stat label="Featured" value={featuredCount} />
        <Stat label="Pluggable modules" value="Ready" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Admin Profile</p>
          <div className="mt-5 flex items-center gap-4">
            <ProfileAvatar
              image={
                settings?.profileImage
                  ? {
                      src: settings.profileImage,
                      alt: settings.profileImageAlt ?? 'Profile portrait',
                      blurDataUrl: settings.profileImageBlurDataUrl ?? undefined,
                    }
                  : null
              }
              size="lg"
            />
            <div>
              <p className="text-lg font-medium text-foreground">
                {settings?.siteName ?? 'Portfolio Admin'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                One global image powers the public and admin experience.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-muted-foreground">
            The dashboard is intentionally slim and modular. Add new modules by extending the admin
            navigation and creating a new route folder.
          </p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  )
}

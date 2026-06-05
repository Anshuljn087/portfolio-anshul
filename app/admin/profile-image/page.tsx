import { ProfileImageManager } from '@/components/admin/profile-image-manager'
import { siteSettingsRepository } from '@/services/repositories/site-settings-repository'

export default async function ProfileImagePage() {
  const settings = await siteSettingsRepository.findLatest().catch(() => null)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin Profile</p>
        <h2 className="mt-3 text-3xl font-semibold">Global Profile Image</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          This single image powers the hero, about, navbar avatar, and admin profile. Uploading a
          new file replaces the existing one globally.
        </p>
      </div>
      <ProfileImageManager
        current={{
          src: settings?.profileImage ?? null,
          alt: settings?.profileImageAlt ?? null,
          blurDataUrl: settings?.profileImageBlurDataUrl ?? null,
        }}
      />
    </div>
  )
}

import Link from 'next/link'
import { siteConfig } from '@/constants/site'
import { ProfileAvatar } from '@/components/media/profile-avatar'
import { loadSiteContent } from '@/services/cms'

export async function Navbar() {
  const { content } = await loadSiteContent()
  const siteName = content.siteName ?? siteConfig.name
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <ProfileAvatar image={content.profileImage} size="sm" />
          <span className="text-sm font-semibold tracking-[0.2em] uppercase">{siteName}</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {(content.navigation ?? siteConfig.navigation)
              .filter((item) => item.enabled !== false)
              .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
              ))}
          </nav>
          <ProfileAvatar image={content.profileImage} size="sm" className="md:hidden" />
        </div>
      </div>
    </header>
  )
}

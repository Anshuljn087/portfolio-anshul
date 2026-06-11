import Link from 'next/link'
import { siteConfig } from '@/constants/site'
import { ProfileAvatar } from '@/components/media/profile-avatar'
import { loadSiteContent } from '@/services/cms'

export async function Navbar() {
  const { content } = await loadSiteContent()
  const siteName = content.siteName ?? siteConfig.name
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <ProfileAvatar image={content.profileImage} size="sm" />
          <span className="max-w-[12rem] truncate text-sm font-semibold tracking-[0.16em] uppercase sm:max-w-none sm:tracking-[0.2em]">
            {siteName}
          </span>
        </Link>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
          <nav
            aria-label="Primary"
            className="flex w-full items-center gap-3 overflow-x-auto pb-1 pr-1 md:w-auto md:gap-6 md:overflow-visible md:pb-0"
          >
            {(content.navigation ?? siteConfig.navigation)
              .filter((item) => item.enabled !== false)
              .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
              >
                {item.label}
              </Link>
              ))}
          </nav>
          <ProfileAvatar image={content.profileImage} size="sm" className="shrink-0 md:hidden" />
        </div>
      </div>
    </header>
  )
}

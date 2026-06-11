import Link from 'next/link'
import { adminNavigation } from '@/constants/admin'
import { cn } from '@/lib/utils'

export function AdminShell({
  children,
  currentPath,
}: {
  children: React.ReactNode
  currentPath: string
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-white/[0.03] lg:min-h-screen lg:border-r lg:border-b-0">
          <div className="flex flex-col gap-6 p-4 sm:p-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Admin</p>
              <h1 className="mt-3 text-xl font-semibold sm:text-2xl">Portfolio Dashboard</h1>
            </div>
            <nav className="flex flex-wrap gap-2 lg:flex-col" aria-label="Admin navigation">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                const active = currentPath === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex min-w-[calc(50%-0.25rem)] items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors lg:min-w-0',
                      active
                        ? 'border-white/15 bg-white/10 text-foreground'
                        : 'border-transparent text-muted-foreground hover:border-white/10 hover:bg-white/5 hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}

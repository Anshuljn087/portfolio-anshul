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
          <div className="sticky top-0 flex h-full flex-col gap-8 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Admin</p>
              <h1 className="mt-3 text-2xl font-semibold">Portfolio Dashboard</h1>
            </div>
            <nav className="flex flex-col gap-2" aria-label="Admin navigation">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                const active = currentPath === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors',
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
        <main className="p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  )
}

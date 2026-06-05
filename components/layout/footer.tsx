import Link from 'next/link'

export function Footer({
  text,
  socialLinks,
}: {
  text?: string
  socialLinks: Array<{ label: string; href: string }>
}) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {text ?? 'Portfolio CMS'}</p>
        <div className="flex items-center gap-4">
          {socialLinks.map((item) => (
            <Link key={item.label} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

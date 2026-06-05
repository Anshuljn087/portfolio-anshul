import type { Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { BackgroundMotion } from '@/components/layout/background-motion'
import { cn } from '@/lib/utils'
import { loadSiteContent } from '@/services/cms'
import { buildBaseMetadata } from '@/services/seo'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata() {
  const { content } = await loadSiteContent()
  return buildBaseMetadata({ site: content, pathname: '/' })
}

export const viewport: Viewport = {
  themeColor: '#050816',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(
        geistSans.variable,
        geistMono.variable,
        'h-full scroll-smooth antialiased'
      )}
    >
      <body className="min-h-screen bg-background text-foreground">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.14),_transparent_24%)]" />
          <BackgroundMotion />
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <CmsFooter />
          </div>
        </div>
      </body>
    </html>
  )
}

async function CmsFooter() {
  const { content } = await loadSiteContent()
  return <Footer text={content.footer.text} socialLinks={content.socialLinks} />
}

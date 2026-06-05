import Link from 'next/link'
import type { Metadata } from 'next'
import { listPublishedBlogs } from '@/services/blog-store'
import type { BlogWithRelations } from '@/services/repositories/blog-repository'
import { buildBaseMetadata, buildCanonicalUrl, structuredDataJson } from '@/services/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildBaseMetadata({
    site: {
      seo: {
        title: 'Engineering Blog',
        description: 'Thoughtful engineering writing on MERN architecture, AI systems, RAG, and scale.',
        keywords: ['MERN architecture', 'AI systems', 'RAG', 'Semantic Search', 'React architecture'],
      },
    },
    pathname: '/blogs',
    seo: {
      canonicalUrl: buildCanonicalUrl('/blogs'),
    },
  })
}

export default async function BlogsIndexPage() {
  const blogs: BlogWithRelations[] = await listPublishedBlogs().catch(() => [])
  const collectionJsonLd = structuredDataJson({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Engineering Blog',
    url: buildCanonicalUrl('/blogs'),
  })

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: collectionJsonLd }} />
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Blog</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Engineering writing on systems, architecture, and performance.
      </h1>
      <div className="mt-10 grid gap-6">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/[0.07]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {blog.readingTime} min read
                </p>
                <h2 className="mt-3 text-2xl font-semibold">{blog.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{blog.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((item: BlogWithRelations['tags'][number]) => (
                    <span
                      key={item.tagId}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {item.tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <Link href={`/blogs/${blog.slug}`} className="text-sm text-cyan-300">
                Read article
              </Link>
            </div>
          </article>
        ))}
      </div>
      {blogs.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No published blog posts yet.</p>
      ) : null}
    </main>
  )
}

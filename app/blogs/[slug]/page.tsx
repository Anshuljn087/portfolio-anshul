import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogBySlug } from '@/services/blog-store'
import { buildBaseMetadata, structuredDataJson, buildCanonicalUrl } from '@/services/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug).catch(() => null)
  if (!blog) return {}
  const seo = (blog.seo as { title?: string; description?: string } | null) ?? {}
  return buildBaseMetadata({
    site: {
      seo: {
        title: seo.title ?? blog.title,
        description: seo.description ?? blog.excerpt,
        keywords: [],
      },
    },
    pathname: `/blogs/${slug}`,
    seo: {
      title: seo.title ?? blog.title,
      description: seo.description ?? blog.excerpt,
      canonicalUrl: buildCanonicalUrl(`/blogs/${slug}`),
      ogImage: blog.coverImage ?? undefined,
    },
  })
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug).catch(() => null)
  if (!blog) notFound()
  const articleJsonLd = structuredDataJson({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt?.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Anshul Jain',
    },
    mainEntityOfPage: buildCanonicalUrl(`/blogs/${slug}`),
  })

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Blog</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {blog.title}
      </h1>
      <p className="mt-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">
        {blog.readingTime} min read
      </p>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">{blog.excerpt}</p>
      <div className="prose prose-invert mt-10 max-w-none prose-headings:tracking-tight prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-code:text-cyan-200">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      <div className="mt-10 flex flex-wrap gap-2">
        {blog.tags?.map((item) => (
          <span
            key={item.tagId}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground"
          >
            {item.tag.name}
          </span>
        ))}
      </div>
    </main>
  )
}

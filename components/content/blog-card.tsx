import Link from 'next/link'
import type { BlogWithRelations } from '@/services/repositories/blog-repository'

export function BlogCard({
  blog,
}: {
  blog: Pick<BlogWithRelations, 'title' | 'slug' | 'excerpt' | 'readingTime' | 'tags' | 'categories'>
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:bg-white/[0.07]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {blog.readingTime} min read
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{blog.title}</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            Article
          </span>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{blog.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {blog.categories.map((item: BlogWithRelations['categories'][number]) => (
            <span
              key={item.categoryId}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground"
            >
              {item.category.name}
            </span>
          ))}
          {blog.tags.map((item: BlogWithRelations['tags'][number]) => (
            <span
              key={item.tagId}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground"
            >
              #{item.tag.name}
            </span>
          ))}
        </div>
        <div className="pt-2">
          <Link href={`/blogs/${blog.slug}`} className="text-sm text-cyan-300">
            Read article
          </Link>
        </div>
      </div>
    </article>
  )
}

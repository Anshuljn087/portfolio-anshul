import Link from 'next/link'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { AnimatedSection } from '@/sections/home/animated-section'
import { BlogCard } from '@/components/content/blog-card'
import type { BlogWithRelations } from '@/services/repositories/blog-repository'

export function LatestBlogsSection({
  blogs,
}: {
  blogs: Array<Pick<BlogWithRelations, 'title' | 'slug' | 'excerpt' | 'readingTime' | 'tags' | 'categories'>>
}) {
  const hasBlogs = blogs.length > 0

  return (
    <SectionWrapper
      eyebrow="Latest Blogs"
      title="Recent engineering writing."
      description="Thoughtful breakdowns on MERN architecture, AI systems, RAG, performance, WebSockets, and scalable backend patterns."
      id="blogs"
    >
      <AnimatedSection>
        {hasBlogs ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-8 text-sm text-muted-foreground backdrop-blur-xl">
            No published blog posts yet.
          </div>
        )}
        <div className="mt-8">
          <Link href="/blogs" className="text-sm text-cyan-300">
            View all blogs
          </Link>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

import { notFound } from 'next/navigation'
import { BlogForm } from '@/components/admin/blog-form'
import { getBlog } from '@/services/blog-store'

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const blog = await getBlog(id)

  if (!blog) notFound()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Blogs</p>
        <h2 className="mt-3 text-3xl font-semibold">Edit blog</h2>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <BlogForm
          mode="edit"
          blogId={blog.id}
          defaultValues={{
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            contentHtml: blog.content,
            contentMarkdown: blog.markdown ?? '',
            coverImage: blog.coverImage ?? '',
            status: blog.status.toLowerCase() as 'draft' | 'published',
            featured: blog.featured,
            tags: blog.tags?.map((item) => item.tag.name).join(', '),
            seo: blog.seo ? JSON.stringify(blog.seo, null, 2) : '',
          }}
        />
      </div>
    </div>
  )
}

import Link from 'next/link'
import { listBlogs } from '@/services/blog-store'
import { DeleteEntityButton } from '@/components/admin/delete-entity-button'

export default async function BlogsPage() {
  const blogs = await listBlogs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Blogs</p>
          <h2 className="mt-3 text-3xl font-semibold">Manage blogs</h2>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-2xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
        >
          New blog
        </Link>
      </div>
      <div className="grid gap-4">
        {blogs.map((blog) => (
          <article key={blog.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                  {blog.status} · {blog.featured ? 'Featured' : 'Normal'}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{blog.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{blog.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags?.map((item) => (
                    <span key={item.tagId} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                      {item.tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href={`/blogs/${blog.slug}`} className="hover:text-cyan-300">
                  Preview
                </Link>
                <Link href={`/admin/blogs/edit/${blog.id}`} className="hover:text-cyan-300">
                  Edit
                </Link>
                <DeleteEntityButton endpoint={`/api/admin/blogs/${blog.id}`} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

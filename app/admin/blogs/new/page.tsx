import { BlogForm } from '@/components/admin/blog-form'

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Blogs</p>
        <h2 className="mt-3 text-3xl font-semibold">Create blog</h2>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <BlogForm mode="create" />
      </div>
    </div>
  )
}

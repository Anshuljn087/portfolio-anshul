import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, FolderKanban, PlusCircle, BookOpenText, UserCircle2 } from 'lucide-react'

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const adminNavigation: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'New Project', href: '/admin/projects/new', icon: PlusCircle },
  { label: 'Blogs', href: '/admin/blogs', icon: BookOpenText },
  { label: 'New Blog', href: '/admin/blogs/new', icon: PlusCircle },
  { label: 'Profile Image', href: '/admin/profile-image', icon: UserCircle2 },
]

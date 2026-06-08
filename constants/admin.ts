import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, FolderKanban, PlusCircle, BookOpenText, UserCircle2, Sparkles, Settings2, FileText, BriefcaseBusiness } from 'lucide-react'

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
  { label: 'Experience', href: '/admin/experience', icon: BriefcaseBusiness },
  { label: 'New Experience', href: '/admin/experience/new', icon: PlusCircle },
  { label: 'Skills', href: '/admin/skills', icon: Sparkles },
  { label: 'Site Settings', href: '/admin/site', icon: Settings2 },
  { label: 'Profile Image', href: '/admin/profile-image', icon: UserCircle2 },
  { label: 'Resumes', href: '/admin/resumes', icon: FileText },
]

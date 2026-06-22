'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Users,
  Newspaper,
  Award,
  ImageIcon,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 py-4 px-2 space-y-0.5">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
            style={
              isActive
                ? {
                    backgroundColor: 'var(--admin-sidebar-active-bg)',
                    color: 'var(--admin-sidebar-active-text)',
                  }
                : { color: 'var(--admin-sidebar-text)' }
            }
          >
            <Icon size={15} strokeWidth={1.8} style={{ opacity: isActive ? 1 : 0.7 }} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

import Link from 'next/link'
import { logout } from './login/actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/certifications', label: 'Certifications' },
  { href: '/admin/gallery', label: 'Gallery' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-56 shrink-0 bg-white border-r border-neutral-200 flex flex-col">
        <div className="px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Myra Admin</p>
        </div>
        <Separator />
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 rounded text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="p-3">
          <form action={logout}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-500" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}

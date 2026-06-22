import { logout } from './login/actions'
import { AdminNav } from './_components/AdminNav'
import { LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--admin-bg)' }}>
      <aside
        className="w-56 shrink-0 flex flex-col"
        style={{ backgroundColor: 'var(--admin-sidebar)' }}
      >
        <div className="px-5 py-6">
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--admin-sidebar-text)' }}
          >
            Myra
          </p>
          <p className="text-sm font-medium mt-0.5" style={{ color: 'rgba(250,246,238,0.5)' }}>
            Admin Console
          </p>
        </div>

        <div className="mx-4 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

        <AdminNav />

        <div className="mx-4 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

        <div className="p-3">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: 'rgba(250,246,238,0.5)' }}
            >
              <LogOut size={15} strokeWidth={1.8} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}

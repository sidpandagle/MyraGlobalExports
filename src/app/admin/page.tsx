import { createAdminClient } from '@/lib/supabase/admin'
import { Package, Users, UserCheck, Newspaper } from 'lucide-react'

const STAT_ICONS = [Package, Users, UserCheck, Newspaper]
const STAT_COLORS = ['#0D3B1A', '#C8882A', '#8B4A1A', '#1A3B2A']

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: productCount },
    { count: leadCount },
    { count: newLeadCount },
    { count: newsCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true).eq('is_future', false),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('news').select('*', { count: 'exact', head: true }).eq('is_published', true),
  ])

  const stats = [
    { label: 'Published Products', value: productCount ?? 0 },
    { label: 'Total Leads', value: leadCount ?? 0 },
    { label: 'New Leads', value: newLeadCount ?? 0 },
    { label: 'Published Posts', value: newsCount ?? 0 },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold"
          style={{ color: 'var(--admin-text)' }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--admin-muted)' }}>
          Overview of your content and leads
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value }, i) => {
          const Icon = STAT_ICONS[i]
          const color = STAT_COLORS[i]
          return (
            <div
              key={label}
              className="bg-white rounded-lg p-5"
              style={{ border: '1px solid var(--admin-border)' }}
            >
              <div
                className="inline-flex items-center justify-center w-8 h-8 rounded-md mb-3"
                style={{ backgroundColor: `${color}14` }}
              >
                <Icon size={15} strokeWidth={1.8} style={{ color }} />
              </div>
              <p
                className="text-3xl font-bold tracking-tight"
                style={{ color: 'var(--admin-text)' }}
              >
                {value}
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'var(--admin-muted)' }}>
                {label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

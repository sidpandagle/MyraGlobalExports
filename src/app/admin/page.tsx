import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neutral-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

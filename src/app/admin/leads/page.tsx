import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { updateLeadStatus } from './actions'

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-green-100 text-green-800',
} as const

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = createAdminClient()

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && ['new', 'contacted', 'closed'].includes(status)) {
    query = query.eq('status', status as 'new' | 'contacted' | 'closed')
  }

  const { data: leads } = await query

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Leads</h1>

      <div className="flex gap-2 mb-6">
        {[undefined, 'new', 'contacted', 'closed'].map((s) => (
          <a
            key={s ?? 'all'}
            href={s ? `/admin/leads?status=${s}` : '/admin/leads'}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              status === s || (!status && !s)
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {s ?? 'All'}
          </a>
        ))}
      </div>

      <div className="space-y-3">
        {leads?.map((lead) => (
          <div key={lead.id} className="bg-white border border-neutral-200 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-neutral-900">{lead.full_name}</span>
                  {lead.company && <span className="text-sm text-neutral-500">· {lead.company}</span>}
                  <Badge className={`text-xs ${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]}`}>
                    {lead.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 text-sm text-neutral-600 mb-2">
                  <span><span className="text-neutral-400">Country:</span> {lead.country}</span>
                  <span><span className="text-neutral-400">Product:</span> {lead.product_required}</span>
                  {lead.quantity && <span><span className="text-neutral-400">Qty:</span> {lead.quantity}</span>}
                  <span><span className="text-neutral-400">Email:</span> {lead.email}</span>
                  {lead.whatsapp && <span><span className="text-neutral-400">WA:</span> {lead.whatsapp}</span>}
                  {lead.source && <span><span className="text-neutral-400">From:</span> {lead.source}</span>}
                </div>
                {lead.message && (
                  <p className="text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded">{lead.message}</p>
                )}
                <p className="text-xs text-neutral-400 mt-2">
                  {new Date(lead.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {(['new', 'contacted', 'closed'] as const).map((s) => (
                  <form key={s} action={updateLeadStatus.bind(null, lead.id, s)}>
                    <Button
                      variant={lead.status === s ? 'default' : 'outline'}
                      size="sm"
                      type="submit"
                      className="w-full text-xs"
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  </form>
                ))}
              </div>
            </div>
          </div>
        ))}
        {!leads?.length && (
          <p className="text-neutral-400 text-center py-12">No leads {status ? `with status "${status}"` : 'yet'}.</p>
        )}
      </div>
    </div>
  )
}

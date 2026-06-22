import { createAdminClient } from '@/lib/supabase/admin'
import { updateLeadStatus } from './actions'

const STATUS_STYLES = {
  new: { bg: 'rgba(200,136,42,0.12)', text: '#8B5E1A', label: 'New' },
  contacted: { bg: 'rgba(13,59,26,0.1)', text: '#0D3B1A', label: 'Contacted' },
  closed: { bg: 'rgba(42,28,12,0.08)', text: '#5A3E25', label: 'Closed' },
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

  const filters = [
    { value: undefined, label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'closed', label: 'Closed' },
  ]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>
          Leads
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--admin-muted)' }}>
          {leads?.length ?? 0} {status ? `"${status}"` : 'total'} inquiries
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {filters.map(({ value, label }) => {
          const isActive = status === value || (!status && !value)
          return (
            <a
              key={label}
              href={value ? `/admin/leads?status=${value}` : '/admin/leads'}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={
                isActive
                  ? { backgroundColor: 'var(--admin-text)', color: 'var(--cream)' }
                  : {
                      backgroundColor: 'white',
                      color: 'var(--admin-muted)',
                      border: '1px solid var(--admin-border)',
                    }
              }
            >
              {label}
            </a>
          )
        })}
      </div>

      <div className="space-y-2.5">
        {leads?.map((lead) => {
          const st = STATUS_STYLES[lead.status as keyof typeof STATUS_STYLES]
          return (
            <div
              key={lead.id}
              className="bg-white rounded-lg p-5"
              style={{ border: '1px solid var(--admin-border)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: 'var(--admin-text)' }}>
                      {lead.full_name}
                    </span>
                    {lead.company && (
                      <span className="text-sm" style={{ color: 'var(--admin-muted)' }}>
                        {lead.company}
                      </span>
                    )}
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: st?.bg, color: st?.text }}
                    >
                      {st?.label ?? lead.status}
                    </span>
                  </div>
                  <div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 text-xs mb-2"
                    style={{ color: 'var(--admin-text)' }}
                  >
                    <span>
                      <span style={{ color: 'var(--admin-muted)' }}>Country: </span>
                      {lead.country}
                    </span>
                    <span>
                      <span style={{ color: 'var(--admin-muted)' }}>Product: </span>
                      {lead.product_required}
                    </span>
                    {lead.quantity && (
                      <span>
                        <span style={{ color: 'var(--admin-muted)' }}>Qty: </span>
                        {lead.quantity}
                      </span>
                    )}
                    <span>
                      <span style={{ color: 'var(--admin-muted)' }}>Email: </span>
                      {lead.email}
                    </span>
                    {lead.whatsapp && (
                      <span>
                        <span style={{ color: 'var(--admin-muted)' }}>WA: </span>
                        {lead.whatsapp}
                      </span>
                    )}
                    {lead.source && (
                      <span>
                        <span style={{ color: 'var(--admin-muted)' }}>From: </span>
                        {lead.source}
                      </span>
                    )}
                  </div>
                  {lead.message && (
                    <p
                      className="text-xs px-3 py-2 rounded-md"
                      style={{
                        backgroundColor: 'var(--admin-bg)',
                        color: 'var(--admin-text)',
                      }}
                    >
                      {lead.message}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: 'var(--admin-muted)' }}>
                    {new Date(lead.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  {(['new', 'contacted', 'closed'] as const).map((s) => {
                    const isCurrentStatus = lead.status === s
                    return (
                      <form key={s} action={updateLeadStatus.bind(null, lead.id, s)}>
                        <button
                          type="submit"
                          className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors w-full"
                          style={
                            isCurrentStatus
                              ? {
                                  backgroundColor: 'var(--admin-text)',
                                  color: 'var(--cream)',
                                }
                              : {
                                  backgroundColor: 'white',
                                  color: 'var(--admin-muted)',
                                  border: '1px solid var(--admin-border)',
                                }
                          }
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      </form>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
        {!leads?.length && (
          <p className="text-center py-16 text-sm" style={{ color: 'var(--admin-muted)' }}>
            No leads {status ? `with status "${status}"` : 'yet'}.
          </p>
        )}
      </div>
    </div>
  )
}

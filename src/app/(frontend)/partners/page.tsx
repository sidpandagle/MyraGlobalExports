import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Partners & Suppliers',
  description: 'Our trusted network of suppliers, partners, and buyers.',
}

type Partner = {
  id: string
  name: string
  description?: string | null
  logo?: { url?: string | null; alt?: string | null } | null
  type?: string | null
  country?: string | null
}

async function getPartnersData(): Promise<{
  partners: Partner[]
  show: boolean
}> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const [result, settings] = await Promise.all([
      payload.find({
        collection: 'partners',
        where: { visible: { equals: true } },
        sort: 'sortOrder',
        limit: 200,
        depth: 1,
      }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])
    return {
      partners: result.docs as unknown as Partner[],
      show: settings.sections?.showPartners !== false,
    }
  } catch {
    return { partners: [], show: true }
  }
}

function PartnerGrid({
  items,
  title,
}: {
  items: Partner[]
  title: string
}) {
  if (items.length === 0) return null
  return (
    <div className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-brand-green">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center rounded-xl border bg-white p-4 text-center shadow-sm"
          >
            {p.logo?.url ? (
              <Image
                src={p.logo.url}
                alt={p.logo.alt ?? p.name}
                width={80}
                height={60}
                className="mb-3 object-contain"
              />
            ) : (
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-2xl font-bold text-brand-green">
                {p.name.charAt(0)}
              </div>
            )}
            <p className="text-sm font-medium text-gray-800">{p.name}</p>
            {p.country && <p className="mt-0.5 text-xs text-gray-500">{p.country}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function PartnersPage() {
  const { partners, show } = await getPartnersData()

  if (!show) {
    return (
      <div className="py-32 text-center text-gray-400">Partners section coming soon.</div>
    )
  }

  const suppliers = partners.filter((p) => p.type === 'supplier')
  const buyers = partners.filter((p) => p.type === 'buyer')
  const others = partners.filter((p) => p.type === 'partner' || p.type === 'future')

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          Partners &amp; Suppliers
        </h1>
        <p className="text-gray-500">Our trusted network built on quality and reliability</p>
      </div>
      <PartnerGrid items={suppliers} title="Our Suppliers" />
      <PartnerGrid items={buyers} title="Our Buyers" />
      <PartnerGrid items={others} title="Our Partners" />
      {partners.length === 0 && (
        <p className="text-center text-gray-400">Partner information coming soon.</p>
      )}
    </div>
  )
}

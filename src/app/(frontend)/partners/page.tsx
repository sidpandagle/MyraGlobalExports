import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partners & Suppliers',
  description: 'Our trusted network of suppliers, partners, and buyers.',
}

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          Partners &amp; Suppliers
        </h1>
        <p className="text-gray-500">Our trusted network built on quality and reliability</p>
      </div>
      <p className="text-center text-gray-400">Partner information coming soon.</p>
    </div>
  )
}

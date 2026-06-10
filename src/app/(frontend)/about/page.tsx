import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Myra Global Exports — our mission, vision, and commitment to quality agricultural exports.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          About Myra Global Exports
        </h1>
        <p className="text-lg text-gray-500">Connecting the World. Empowering Futures.</p>
      </div>

      <div className="mx-auto max-w-4xl space-y-12">
        {/* Story */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-4 font-heading text-2xl font-bold text-brand-green">Our Story</h2>
            <p className="text-gray-600">
              Myra Global Exports was founded with a clear purpose — to bring India&apos;s finest
              agricultural produce to international markets. We are a dedicated export company
              committed to quality, transparency, and building long-term partnerships with buyers
              and suppliers across the globe.
            </p>
          </div>
          <div className="flex items-center justify-center rounded-2xl bg-brand-green/5 p-8">
            <div className="text-center">
              <div className="mb-3 text-5xl" aria-hidden="true">🤝</div>
              <p className="font-semibold text-brand-green">Built on Trust</p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-brand-green p-8 text-white">
            <h2 className="mb-3 font-heading text-xl font-bold">Our Mission</h2>
            <p className="text-green-100">
              To deliver premium quality agricultural commodities to international markets while
              supporting Indian farmers and promoting sustainable trade practices.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-brand-green p-8">
            <h2 className="mb-3 font-heading text-xl font-bold text-brand-green">Our Vision</h2>
            <p className="text-gray-600">
              To become a globally recognised name in agricultural exports, known for consistent
              quality, reliable supply chains, and exceptional buyer service.
            </p>
          </div>
        </div>

        {/* Why Work With Us */}
        <div>
          <h2 className="mb-6 font-heading text-2xl font-bold text-brand-green">
            Why Work With Us?
          </h2>
          <ul className="space-y-3">
            {[
              'Direct sourcing from verified Indian farms and suppliers',
              'Strict quality checks at every stage — farm to shipment',
              'All regulatory compliances: GST, IEC, APEDA, FSSAI',
              'Flexible packaging and documentation for all buyer requirements',
              'Dedicated account manager for every buyer',
              'Transparent pricing with no hidden charges',
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 text-brand-green" aria-hidden="true">✓</span>
                <span className="text-gray-600">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-brand-green/5 p-8 text-center">
          <h2 className="mb-3 font-heading text-2xl font-bold text-brand-green">
            Ready to Partner With Us?
          </h2>
          <p className="mb-6 text-gray-600">
            Get in touch with our export team for a personalised quote.
          </p>
          <a
            href="/get-quote"
            className="inline-block rounded-full bg-brand-green px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-green-light"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </div>
  )
}

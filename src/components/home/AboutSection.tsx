import Link from 'next/link'

export function AboutSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-gold">
              About Myra Global
            </p>
            <h2 className="mb-4 font-heading text-3xl font-bold text-brand-green">
              Your Trusted Partner for Premium Agricultural Exports
            </h2>
            <p className="mb-4 text-gray-600">
              Myra Global Exports is an emerging agricultural export company based in India, dedicated to
              delivering high-quality agri-commodities to international buyers. We bridge the gap between
              India&apos;s rich agricultural heritage and the world&apos;s growing demand for quality produce.
            </p>
            <p className="mb-6 text-gray-600">
              We work directly with farmers and suppliers to ensure freshness, quality, and consistency.
              Our team handles everything from sourcing and quality inspection to packaging, documentation,
              and timely delivery.
            </p>
            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              {[
                { value: '30+', label: 'Countries Served' },
                { value: '50+', label: 'Products' },
                { value: '100%', label: 'Quality Assured' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-lg bg-brand-green/5 p-4">
                  <p className="text-2xl font-bold text-brand-green">{value}</p>
                  <p className="text-xs text-gray-600">{label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-light"
            >
              Learn More About Us
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-80 w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green/10 to-brand-gold/10 lg:h-96">
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="text-6xl" aria-hidden="true">🌾</div>
                <p className="font-heading text-xl font-bold text-brand-green">
                  Farm to World
                </p>
                <p className="text-sm text-gray-600">
                  Sourcing directly from India&apos;s finest farms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

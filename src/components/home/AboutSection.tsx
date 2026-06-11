import Link from 'next/link'

const STATS = [
  { value: '30+', label: 'Countries Served' },
  { value: '50+', label: 'Products' },
  { value: '100%', label: 'Quality Assured' },
]

export function AboutSection() {
  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">
                About Myra Global
              </p>
            </div>
            <h2
              className="font-heading font-light text-brand-green leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)' }}
            >
              Your Trusted Partner<br />
              <em className="italic">for Premium</em><br />
              Agricultural Exports
            </h2>
            <p className="text-bark/65 text-[15px] leading-relaxed mb-4 font-sans">
              Myra Global Exports is an emerging agricultural export company based in India, dedicated to
              delivering high-quality agri-commodities to international buyers. We bridge the gap between
              India&apos;s rich agricultural heritage and the world&apos;s growing demand for quality produce.
            </p>
            <p className="text-bark/65 text-[15px] leading-relaxed mb-10 font-sans">
              We work directly with farmers and suppliers to ensure freshness, quality, and consistency.
              Our team handles everything from sourcing and quality inspection to packaging, documentation,
              and timely delivery.
            </p>

            {/* Stats row */}
            <div className="flex mb-10 border border-fog overflow-hidden">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`flex-1 px-5 py-5 text-center ${i > 0 ? 'border-l border-fog' : ''}`}
                >
                  <p className="font-heading text-3xl font-light text-brand-green">{value}</p>
                  <p className="text-[9.5px] font-sans uppercase tracking-[0.18em] text-stone mt-1">{label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-[12px] font-sans font-semibold uppercase tracking-[0.15em] text-brand-green border-b border-brand-gold pb-0.5 transition-all hover:text-brand-gold hover:gap-4"
            >
              Learn More About Us
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="relative h-[460px] bg-brand-green/[0.04] border border-fog overflow-hidden">
              {/* Decorative grid */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(200,136,42,0.08) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(200,136,42,0.08) 1px, transparent 1px)`,
                  backgroundSize: '48px 48px',
                }}
              />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-12">
                <div className="relative">
                  <div className="text-8xl" aria-hidden="true">🌾</div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-gold/20 border border-brand-gold/40" />
                </div>
                <div className="text-center">
                  <p className="font-heading text-3xl font-light text-brand-green mb-2">
                    Farm to World
                  </p>
                  <p className="text-[10.5px] font-sans uppercase tracking-[0.2em] text-stone">
                    Sourcing from India&apos;s finest farms
                  </p>
                </div>
              </div>
              {/* Inner border rules */}
              <div className="absolute top-6 left-6 right-6 h-px bg-brand-gold/15 pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 h-px bg-brand-gold/15 pointer-events-none" />
              <div className="absolute top-6 bottom-6 left-6 w-px bg-brand-gold/15 pointer-events-none" />
              <div className="absolute top-6 bottom-6 right-6 w-px bg-brand-gold/15 pointer-events-none" />
            </div>
            {/* Corner accents */}
            <div className="absolute -bottom-3 -right-3 w-14 h-14 border-r-2 border-b-2 border-brand-gold pointer-events-none" />
            <div className="absolute -top-3 -left-3 w-14 h-14 border-l-2 border-t-2 border-brand-gold pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}

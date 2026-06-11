import Link from 'next/link'

const PRODUCTS = [
  'Basmati Rice',
  'Turmeric',
  'Cumin',
  'Coriander',
  'Red Chilli',
  'Cashews',
  'Sesame Seeds',
  'Peanuts',
  'Sugar',
  'Wheat',
  'Chickpeas',
  'Black Pepper',
  'Cardamom',
  'Mustard Seeds',
  'Lentils',
]

export function HeroBanner() {
  const ticker =
    PRODUCTS.map((p) => p.toUpperCase()).join(' · ') + ' · '

  return (
    <section className="relative min-h-screen bg-brand-green flex flex-col overflow-hidden">
      {/* Geometric wheat-diamond pattern */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cdefs%3E%3Cpattern id='p' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M40 4 L76 40 L40 76 L4 40 Z' fill='none' stroke='rgba(255,255,255,0.055)' stroke-width='0.8'/%3E%3Cpath d='M40 16 L64 40 L40 64 L16 40 Z' fill='none' stroke='rgba(200,136,42,0.12)' stroke-width='0.6'/%3E%3Ccircle cx='40' cy='40' r='2.5' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='0.8'/%3E%3Ccircle cx='0' cy='0' r='1.5' fill='rgba(200,136,42,0.1)'/%3E%3Ccircle cx='80' cy='0' r='1.5' fill='rgba(200,136,42,0.1)'/%3E%3Ccircle cx='0' cy='80' r='1.5' fill='rgba(200,136,42,0.1)'/%3E%3Ccircle cx='80' cy='80' r='1.5' fill='rgba(200,136,42,0.1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='80' height='80' fill='url(%23p)'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
        aria-hidden="true"
      />
      {/* Radial vignette to keep centre focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(7,31,13,0.55) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top info bar */}
      <div className="relative z-10 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-white/30">
            Premium Agricultural Exports · India
          </p>
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-white/30 hidden sm:block">
            GST · IEC · APEDA · FSSAI Certified
          </p>
        </div>
      </div>

      {/* Main content — centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="text-center px-6 py-16 w-full max-w-4xl mx-auto">

          {/* Company identifier */}
          <p className="font-sans text-brand-gold text-[11px] tracking-[0.45em] uppercase mb-8">
            Myra Global Exports
          </p>

          {/* Divider ornament */}
          <div className="flex items-center justify-center gap-3 mb-10" aria-hidden="true">
            <span className="block h-px w-20 bg-white/[0.12]" />
            <span className="block w-1 h-1 rounded-full bg-brand-gold/50 shrink-0" />
            <span className="block h-px w-20 bg-white/[0.12]" />
          </div>

          {/* Headline */}
          <h1
            className="font-heading text-white text-balance mb-8"
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 5rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
            }}
          >
            Agricultural commodities
            <br />
            <em className="text-brand-gold">
              from India&rsquo;s fields.
            </em>
          </h1>

          {/* Description */}
          <p
            className="font-sans text-white/65 mx-auto mb-12 leading-relaxed text-pretty"
            style={{
              maxWidth: '52ch',
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            }}
          >
            We supply rice, spices, pulses, cashews, and sugar to buyers
            across 30 countries. APEDA certified, quality-tested at every
            batch, shipped on schedule.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/get-quote"
              className="bg-brand-gold px-8 py-3.5 text-[12px] font-sans font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-brand-gold-light"
            >
              Request a quote
            </Link>
            <Link
              href="/products"
              className="border border-white/25 px-8 py-3.5 text-[12px] font-sans font-semibold uppercase tracking-[0.14em] text-white/70 transition-all duration-200 hover:border-white/60 hover:text-white"
            >
              See our products
            </Link>
          </div>
        </div>
      </div>

      {/* Product ticker */}
      <div
        className="relative z-10 border-t border-white/10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="animate-marquee inline-block whitespace-nowrap">
          <span className="font-sans text-[10px] tracking-[0.28em] text-white/25 uppercase py-4 inline-block">
            {ticker}
            {ticker}
          </span>
        </div>
      </div>
    </section>
  )
}

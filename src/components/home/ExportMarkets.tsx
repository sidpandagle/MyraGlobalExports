const COUNTRIES = [
  { code: 'ae', name: 'UAE' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'de', name: 'Germany' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'us', name: 'USA' },
  { code: 'cn', name: 'China' },
  { code: 'jp', name: 'Japan' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'my', name: 'Malaysia' },
  { code: 'id', name: 'Indonesia' },
  { code: 'sg', name: 'Singapore' },
  { code: 'za', name: 'South Africa' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'qa', name: 'Qatar' },
  { code: 'kw', name: 'Kuwait' },
  { code: 'au', name: 'Australia' },
]

/* Duplicate for seamless marquee loop */
const MARQUEE_ITEMS = [...COUNTRIES, ...COUNTRIES]

export function ExportMarkets() {
  return (
    <section className="py-24 bg-brand-green overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-brand-gold/60">
                Global Presence
              </p>
            </div>
            <h2
              className="font-heading font-light text-white leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}
            >
              Our Export<br />
              <em className="italic text-brand-gold">Markets</em>
            </h2>
          </div>
          <p className="text-white/45 text-sm font-sans max-w-xs leading-relaxed">
            Trusted by buyers across 30+ countries in Asia, Middle East, Europe, and Africa.
          </p>
        </div>
      </div>

      {/* Marquee row */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-brand-green to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-brand-green to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div
            className="flex shrink-0 gap-px"
            style={{ animation: 'marquee 45s linear infinite' }}
          >
            {MARQUEE_ITEMS.map(({ code, name }, i) => (
              <div
                key={`${name}-${i}`}
                className="flex items-center justify-center px-6 py-7 bg-white/5 hover:bg-white/10 transition-colors shrink-0"
              >
                <img
                  src={`https://flagcdn.com/w80/${code}.png`}
                  alt={name}
                  width={56}
                  height={40}
                  className="object-cover rounded-sm shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stats strip */}
      <div className="mx-auto max-w-7xl px-6 mt-14">
        <div className="border-t border-white/10 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '30+', label: 'Countries' },
            { value: '6', label: 'Continents' },
            { value: '50+', label: 'Commodities' },
            { value: '∞', label: 'Growth Potential' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-heading text-3xl font-light text-brand-gold">{value}</p>
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-white/35 mt-1.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

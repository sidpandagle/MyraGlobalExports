import Link from 'next/link'

export function InquirySection() {
  return (
    <section className="py-24 bg-cream border-y border-fog">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">
                Start a Conversation
              </p>
            </div>
            <h2
              className="font-heading font-light text-brand-green leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)' }}
            >
              Ready to Place<br />
              <em className="italic text-brand-gold">an Order?</em>
            </h2>
            <p className="text-bark/60 font-sans text-[15px] leading-relaxed max-w-md mb-8">
              Fill out our inquiry form and our export specialists will respond
              within 24 hours with pricing, availability, and logistics details.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                'Competitive pricing for bulk & container orders',
                'Flexible payment terms for verified buyers',
                'Full export documentation handled end-to-end',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                  <span className="text-bark/65 text-sm font-sans">{point}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/get-quote"
                className="bg-brand-green px-8 py-3.5 text-[12px] font-sans font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-brand-gold"
              >
                Get a Quote
              </Link>
              <Link
                href="/contact"
                className="border border-bark/20 px-8 py-3.5 text-[12px] font-sans font-semibold uppercase tracking-[0.14em] text-bark/60 transition-all hover:border-brand-green hover:text-brand-green"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Visual info card */}
          <div className="relative">
            <div className="bg-brand-green p-10 relative overflow-hidden">
              {/* Subtle background grain */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                  opacity: 0.04,
                }}
              />
              <div className="relative z-10">
                <p className="font-heading text-5xl font-light text-brand-gold mb-1">24h</p>
                <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/40 mb-8">
                  Response Guarantee
                </p>
                <div className="space-y-5 border-t border-white/10 pt-8">
                  {[
                    { label: 'Email', value: 'info@myraglobalexports.com' },
                    { label: 'WhatsApp', value: 'Available for quick queries' },
                    { label: 'Response', value: 'Within 24 business hours' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-white/30 shrink-0">{label}</span>
                      <span className="text-sm font-sans text-white/60 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Corner accent */}
            <div className="absolute -bottom-3 -right-3 w-14 h-14 border-r-2 border-b-2 border-brand-gold pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}

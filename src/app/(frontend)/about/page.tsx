import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Myra Global Exports — our mission, vision, and commitment to quality agricultural exports.',
}

const WHY_WORK = [
  'Direct sourcing from verified Indian farms and suppliers',
  'Strict quality checks at every stage — farm to shipment',
  'GST registered; IEC, APEDA, and FSSAI certifications in progress',
  'Flexible packaging and documentation for all buyer requirements',
  'Dedicated account manager for every buyer',
  'Transparent pricing with no hidden charges',
]

const MILESTONES = [
  { year: '2025', event: 'Myra Global founded in India' },
  { year: '2025', event: 'GST registration secured' },
  { year: '2025', event: 'Catalogue launched with 61+ agri-commodities' },
  { year: '2025', event: 'Initial international buyer network established' },
]

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Page hero */}
      <div className="bg-brand-green py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
            opacity: 0.04,
          }}
        />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="block h-px w-10 bg-brand-gold shrink-0" />
            <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-brand-gold/60">
              Our Story
            </p>
          </div>
          <h1
            className="font-heading font-light text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
          >
            About Myra<br />
            <em className="italic text-brand-gold">Global Exports</em>
          </h1>
          <p className="text-white/50 font-sans text-base max-w-xl">
            Connecting the World. Empowering Futures.
          </p>
        </div>
      </div>

      {/* Story section */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="relative h-72 lg:h-80 overflow-hidden mb-10 bg-fog">
              <Image
                src="/about/farmer-in-field.png"
                alt="Indian farmer standing proud in a golden wheat field"
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/40 to-transparent" />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">Our Story</p>
            </div>
            <h2
              className="font-heading font-light text-brand-green leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Built on Trust,<br />
              <em className="italic">Driven by Quality</em>
            </h2>
            <p className="text-bark/65 font-sans text-[15px] leading-relaxed mb-5">
              Myra Global Exports was founded with a clear purpose — to bring India&apos;s finest
              agricultural produce to international markets. We are a dedicated export company
              committed to quality, transparency, and building long-term partnerships with buyers
              and suppliers across the globe.
            </p>
            <p className="text-bark/65 font-sans text-[15px] leading-relaxed">
              We understand that every buyer has unique requirements. That is why we offer
              personalised service, from sourcing and quality inspection to packaging and delivery —
              ensuring your shipment meets the exact specifications you need.
            </p>
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">Milestones</p>
            </div>
            <div className="space-y-0 border-l border-fog ml-4">
              {MILESTONES.map(({ year, event }) => (
                <div key={year} className="relative pl-8 pb-8">
                  <div className="absolute -left-2 top-0 w-4 h-4 border-2 border-brand-gold bg-cream" />
                  <p className="font-heading text-brand-gold text-lg font-semibold">{year}</p>
                  <p className="text-bark/65 font-sans text-[14px] mt-0.5">{event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="border-y border-fog py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-4 mb-14 justify-center">
            <span className="block h-px w-10 bg-brand-gold shrink-0" />
            <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">
              Mission &amp; Vision
            </p>
            <span className="block h-px w-10 bg-brand-gold shrink-0" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-fog">
            <div className="bg-brand-green p-10 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                  opacity: 0.04,
                }}
              />
              <div className="relative z-10">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-brand-gold/60 mb-4">Mission</p>
                <h2 className="font-heading text-3xl font-light text-white mb-4">Our Mission</h2>
                <p className="text-white/60 font-sans text-[15px] leading-relaxed">
                  To deliver premium quality agricultural commodities to international markets while
                  supporting Indian farmers and promoting sustainable, ethical trade practices.
                </p>
              </div>
            </div>
            <div className="bg-white p-10">
              <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone mb-4">Vision</p>
              <h2 className="font-heading text-3xl font-light text-brand-green mb-4">Our Vision</h2>
              <p className="text-bark/60 font-sans text-[15px] leading-relaxed">
                To become a globally recognised name in agricultural exports, known for consistent
                quality, reliable supply chains, and exceptional buyer service across every market.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why work with us */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">Advantages</p>
            </div>
            <h2
              className="font-heading font-light text-brand-green leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Why Work<br />
              <em className="italic">With Us?</em>
            </h2>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-px bg-fog">
            {WHY_WORK.map((point, i) => (
              <div key={i} className="bg-white p-7 hover:bg-cream transition-colors">
                <div className="flex items-start gap-4">
                  <span className="font-heading text-2xl font-light text-brand-gold/40 shrink-0 leading-none mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-bark/65 font-sans text-[14px] leading-relaxed">{point}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-fog py-20 bg-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="font-heading font-light text-brand-green leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
              >
                Ready to Partner<br />
                <em className="italic text-brand-gold">With Us?</em>
              </h2>
              <p className="text-bark/60 font-sans text-[15px] leading-relaxed">
                Get in touch with our export team for a personalised quote and explore how we
                can serve your specific requirements.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/get-quote"
                className="bg-brand-green px-8 py-3.5 text-[12px] font-sans font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-brand-gold"
              >
                Request a Quote
              </Link>
              <Link
                href="/contact"
                className="border border-bark/20 px-8 py-3.5 text-[12px] font-sans font-semibold uppercase tracking-[0.14em] text-bark/60 transition-all hover:border-brand-green hover:text-brand-green"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

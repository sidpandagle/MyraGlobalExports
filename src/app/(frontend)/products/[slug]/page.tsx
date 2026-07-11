import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ShareButtons } from '@/components/shared/ShareButtons'
import type { Product, ProductSpec, ProductImage } from '@/types/database'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myraglobalexports.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, short_description, images')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (!data) return { title: 'Product Not Found' }
  const firstImage = (data.images as ProductImage[])?.[0]
  return {
    title: data.name,
    description: data.short_description ?? undefined,
    alternates: { canonical: `${SITE_URL}/products/${slug}` },
    openGraph: {
      title: `${data.name} | Myra Global Exports`,
      description: data.short_description ?? undefined,
      url: `${SITE_URL}/products/${slug}`,
      ...(firstImage?.url ? { images: [{ url: firstImage.url }] } : {}),
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!product) notFound()

  const typedProduct = product as Product
  const specs = typedProduct.specs as ProductSpec[]
  const images = typedProduct.images as ProductImage[]
  const relatedSlugs = typedProduct.related_slugs as string[]

  const { data: relatedProducts } = relatedSlugs.length
    ? await supabase
        .from('products')
        .select('id, name, slug, category, short_description, images, emoji, accent_color')
        .in('slug', relatedSlugs)
        .eq('is_published', true)
    : { data: [] }

  const firstImage = images?.[0] ?? null
  const accentColor = typedProduct.accent_color ?? '#C8882A'
  const varieties = typedProduct.varieties as string[]
  const grades = typedProduct.grades as string[]
  const packaging = typedProduct.packaging as string[]
  const certifications = typedProduct.certifications as string[]
  const useCases = typedProduct.use_cases as string[]

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: typedProduct.name,
    description: typedProduct.short_description ?? typedProduct.full_description ?? undefined,
    brand: { '@type': 'Organization', name: 'Myra Global Exports' },
    ...(firstImage?.url ? { image: firstImage.url } : {}),
    ...(typedProduct.origin ? { countryOfOrigin: typedProduct.origin } : {}),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Myra Global Exports' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: typedProduct.name, item: `${SITE_URL}/products/${typedProduct.slug}` },
    ],
  }

  return (
    <div className="bg-cream min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0D3B1A 0%, #071F0D 100%)` }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='2' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center gap-2 mb-10">
            <Link
              href="/products"
              className="text-[11px] font-sans uppercase tracking-[0.25em] text-white/35 hover:text-white/70 transition-colors"
            >
              Products
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-brand-gold/70">
              {typedProduct.category}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <p className="text-[10px] font-sans uppercase tracking-[0.4em] text-brand-gold/60 mb-4">
                {typedProduct.category}
              </p>
              <h1
                className="font-heading text-white font-light leading-none mb-5"
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
              >
                {typedProduct.name}
              </h1>
              {typedProduct.tagline && (
                <p
                  className="font-heading italic mb-6"
                  style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: accentColor }}
                >
                  {typedProduct.tagline}
                </p>
              )}
              {typedProduct.short_description && (
                <p className="font-sans text-white/55 text-[15px] leading-relaxed max-w-[52ch]">
                  {typedProduct.short_description}
                </p>
              )}
            </div>

            <div className="flex justify-center lg:justify-end">
              <div
                className="relative w-72 h-72 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                {firstImage?.url ? (
                  <Image
                    src={firstImage.url}
                    alt={firstImage.alt ?? typedProduct.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <>
                    <span className="text-9xl select-none" aria-hidden="true">
                      {typedProduct.emoji || '🌾'}
                    </span>
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${accentColor}20, transparent 70%)`,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-8">
            {typedProduct.origin && (
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Origin</p>
                <p className="font-sans text-white/70 text-sm">{typedProduct.origin}</p>
              </div>
            )}
            <div>
              <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Category</p>
              <p className="font-sans text-white/70 text-sm">{typedProduct.category}</p>
            </div>
            {certifications.length > 0 && (
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Certifications</p>
                <p className="font-sans text-white/70 text-sm">{certifications.slice(0, 3).join(' · ')}</p>
              </div>
            )}
            {typedProduct.availability && (
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Availability</p>
                <p className="font-sans text-white/70 text-sm">{typedProduct.availability}</p>
              </div>
            )}
            {typedProduct.moq && (
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">MOQ</p>
                <p className="font-sans text-white/70 text-sm">{typedProduct.moq} {typedProduct.moq_unit}</p>
              </div>
            )}
            {typedProduct.hs_code && (
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">HS Code</p>
                <p className="font-sans text-white/70 text-sm">{typedProduct.hs_code}</p>
              </div>
            )}
            {typedProduct.loading_capacity && (
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Loading Capacity</p>
                <p className="font-sans text-white/70 text-sm">{typedProduct.loading_capacity}</p>
              </div>
            )}
            {typedProduct.supply_capacity && (
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.3em] text-white/30 mb-1">Supply Capacity/Month</p>
                <p className="font-sans text-white/70 text-sm">{typedProduct.supply_capacity}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">

            {typedProduct.full_description && (
              <section>
                <div className="flex items-center gap-4 mb-5">
                  <span className="block h-px flex-1 bg-fog" />
                  <span className="text-[9px] font-sans uppercase tracking-[0.3em] text-stone">Overview</span>
                  <span className="block h-px flex-1 bg-fog" />
                </div>
                <p className="font-sans text-bark/70 text-[15px] leading-[1.9]">
                  {typedProduct.full_description}
                </p>
              </section>
            )}

            {specs.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-6">
                  Technical Specifications
                </h2>
                <div className="border border-fog overflow-hidden">
                  {specs.map((spec, i) => (
                    <div
                      key={spec.label}
                      className={`flex items-stretch ${i % 2 === 0 ? 'bg-white' : 'bg-cream/60'}`}
                    >
                      <div className="w-48 shrink-0 px-5 py-4 border-r border-fog">
                        <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.12em] text-stone">
                          {spec.label}
                        </p>
                      </div>
                      <div className="flex-1 px-5 py-4">
                        <p className="font-sans text-bark text-[14px]">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {varieties.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-5">
                  Varieties
                </h2>
                <div className="flex flex-wrap gap-2">
                  {varieties.map((v) => (
                    <span key={v} className="inline-block border border-fog bg-white px-4 py-2 text-[12px] font-sans font-medium text-bark/70 tracking-wide">
                      {v}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {grades.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-5">
                  Available Grades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {grades.map((grade) => (
                    <span key={grade} className="inline-block border border-fog bg-white px-4 py-2 text-[12px] font-sans font-medium text-bark/70 tracking-wide">
                      {grade}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {useCases.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-5">
                  Applications
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {useCases.map((use) => (
                    <div key={use} className="bg-white border border-fog px-4 py-3 flex items-start gap-2">
                      <span className="block w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: accentColor }} />
                      <span className="font-sans text-[13px] text-bark/70 leading-snug">{use}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {packaging.length > 0 && (
              <section>
                <h2 className="font-heading text-brand-green text-2xl font-semibold mb-5">
                  Packaging Options
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {packaging.map((pack, i) => (
                    <div key={i} className="flex items-center gap-3 border border-fog bg-white px-4 py-3">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                        <rect x="1" y="1" width="12" height="12" rx="1" stroke={accentColor} strokeWidth="1.5" />
                        <path d="M1 5h12M5 1v4" stroke={accentColor} strokeWidth="1" />
                      </svg>
                      <span className="font-sans text-[13px] text-bark/70">{pack}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-brand-green p-8">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-brand-gold/70 mb-3">
                  Export Inquiry
                </p>
                <h3 className="font-heading text-white text-2xl font-light leading-tight mb-4">
                  Request a quote for {typedProduct.name}
                </h3>
                <p className="font-sans text-white/50 text-[13px] leading-relaxed mb-6">
                  We respond within 24 hours with pricing, availability, and sample info.
                </p>
                <Link
                  href={`/get-quote?product=${encodeURIComponent(typedProduct.name)}`}
                  className="block w-full text-center py-3 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] transition-colors text-white"
                  style={{ background: accentColor }}
                >
                  Get a Quote
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-center border border-white/20 py-3 mt-3 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-white/60 hover:border-white/50 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </div>

              {certifications.length > 0 && (
                <div className="bg-white border border-fog p-6">
                  <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone mb-4">
                    Certifications
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <span key={cert} className="inline-block border border-fog px-3 py-1 text-[11px] font-sans font-semibold uppercase tracking-[0.08em] text-bark/60">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border border-fog p-6 space-y-4">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone">Why Us</p>
                {['30+ export destinations', 'Lab tested every batch', 'Phytosanitary certified', 'Custom packaging available'].map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 mt-0.5">
                      <circle cx="6" cy="6" r="5" fill="none" stroke="#0D3B1A" strokeWidth="1" />
                      <path d="M3.5 6l2 2 3-3" stroke="#0D3B1A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-sans text-[13px] text-bark/65 leading-snug">{point}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-fog p-6">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone mb-4">Share</p>
                <ShareButtons url={`${SITE_URL}/products/${typedProduct.slug}`} title={typedProduct.name} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="border-t border-fog bg-white py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-4 mb-10">
              <span className="block h-px w-8 bg-brand-gold shrink-0" />
              <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone">Also exported by Myra</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-fog">
              {relatedProducts.map((rel) => {
                const relImages = rel.images as ProductImage[]
                return (
                  <Link
                    key={rel.slug}
                    href={`/products/${rel.slug}`}
                    className="group bg-white hover:bg-cream transition-colors p-8 flex gap-5 items-start"
                  >
                    {relImages?.[0]?.url ? (
                      <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden mt-1">
                        <Image src={relImages[0].url} alt={rel.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <span className="text-4xl shrink-0 mt-1" aria-hidden="true">
                        {(rel.emoji as string) || '🌾'}
                      </span>
                    )}
                    <div>
                      <p className="text-[9px] font-sans uppercase tracking-[0.25em] text-stone mb-1">{rel.category}</p>
                      <h3 className="font-heading text-bark text-xl font-semibold mb-1 leading-tight">{rel.name}</h3>
                      <p className="font-sans text-bark/50 text-[12px] leading-relaxed line-clamp-2">{rel.short_description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-brand-green group-hover:text-brand-gold transition-colors">
                        View <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="border-t border-fog bg-cream py-16 text-center">
        <p className="text-[10px] font-sans uppercase tracking-[0.35em] text-stone mb-4">Ready to source?</p>
        <h2 className="font-heading text-brand-green font-light mb-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
          Get a competitive export quote<br />
          <em className="italic text-brand-gold">within 24 hours.</em>
        </h2>
        <Link
          href="/get-quote"
          className="inline-block bg-brand-green px-10 py-4 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-white hover:bg-brand-green-light transition-colors"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  )
}

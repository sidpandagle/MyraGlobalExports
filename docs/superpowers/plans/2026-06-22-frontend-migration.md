# Frontend Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded static data in the frontend with live Supabase queries — products, certifications, gallery, news, and the inquiry API.

**Architecture:** All frontend pages are Server Components that `await` the Supabase server client. Data is fetched at request time (dynamic). The inquiry API route saves leads to the `leads` table instead of sending email. The sitemap fetches product and news slugs from Supabase.

**Tech Stack:** `@supabase/ssr` server client (already set up in Plan 1), `react-markdown` for rendering news body

## Global Constraints

- **Prerequisite:** Plans 1 and 2 must be complete — DB must have data, client utilities must exist
- Next.js 15 App Router — `params` are Promises, `searchParams` are Promises
- Use `src/lib/supabase/server.ts` (`createClient`) for all frontend reads — NOT the admin client
- Keep the existing visual design unchanged on all frontend pages — this is a data layer swap, not a redesign
- Product `display_order: 1` (Fresh Red Onion) must appear first in all listings
- Only show `is_published: true` AND `is_future: false` products on frontend
- `src/data/site-settings.ts` — add `showNews: true` and `showGallery: true` in the `sections` object
- Install `react-markdown` for rendering markdown body in news article page

---

### Task 1: Update products list page

**Files:**
- Modify: `src/app/(frontend)/products/page.tsx`

The current page uses `MOCK_PRODUCTS` (hardcoded array) and `STATIC_IMAGES` (local file map). Replace with Supabase fetch. Keep all existing JSX/styles.

- [ ] **Step 1: Replace the page**

```tsx
// src/app/(frontend)/products/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Products',
  description:
    "Browse Myra Global Exports' range of premium agricultural products available for export.",
}

const CATEGORIES = [
  'All', 'Fresh Vegetables', 'Fresh Fruits', 'Spices',
  'Grains', 'Pulses', 'Oil Seeds', 'Herbs',
]

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('id, name, slug, category, short_description, images, emoji, accent_color')
    .eq('is_published', true)
    .eq('is_future', false)
    .order('display_order')

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data: products } = await query

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
              Product Range
            </p>
          </div>
          <h1
            className="font-heading font-light text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
          >
            Our Products
          </h1>
          <p className="text-white/50 font-sans text-base max-w-xl">
            Premium agricultural commodities sourced from India&apos;s finest farms and verified suppliers.
          </p>
        </div>
      </div>

      {/* Category pills */}
      <div className="border-b border-fog bg-white sticky top-[57px] z-30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/products' : `/products?category=${encodeURIComponent(cat)}`}
                className={`px-5 py-4 text-[11px] font-sans font-semibold uppercase tracking-[0.14em] shrink-0 border-b-2 transition-colors ${
                  (cat === 'All' && !category) || category === cat
                    ? 'text-brand-green border-brand-gold'
                    : 'text-bark/50 border-transparent hover:text-brand-green hover:border-brand-gold'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-stone mb-8">
          Showing {products?.length ?? 0} products
        </p>

        <div className="grid grid-cols-1 gap-px bg-fog sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => {
            const firstImage = (product.images as { url: string; alt?: string | null }[])?.[0]
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white hover:bg-cream transition-colors duration-200 flex flex-col overflow-hidden"
              >
                <div className="relative h-52 bg-fog/50 overflow-hidden">
                  {firstImage?.url ? (
                    <Image
                      src={firstImage.url}
                      alt={firstImage.alt ?? product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="flex h-full flex-col items-center justify-center"
                      style={{ background: `${product.accent_color}15` }}
                    >
                      <span className="text-5xl" aria-hidden="true">
                        {(product.emoji as string) || '🌾'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1 border-t border-fog">
                  {product.category && (
                    <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-brand-gold mb-2">
                      {product.category}
                    </p>
                  )}
                  <h3 className="font-heading text-xl font-semibold text-bark mb-2 leading-tight">
                    {product.name}
                  </h3>
                  {product.short_description && (
                    <p className="text-[13px] font-sans text-bark/55 line-clamp-2 leading-relaxed flex-1">
                      {product.short_description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-brand-green group-hover:text-brand-gold transition-colors">
                    <span>View Details</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* CTA banner */}
      <div className="border-t border-fog bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2
                className="font-heading font-light text-brand-green leading-tight mb-3"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
              >
                Interested in<br />
                <em className="italic text-brand-gold">Our Products?</em>
              </h2>
              <p className="text-bark/60 font-sans text-[15px] leading-relaxed">
                Send us an inquiry and receive a competitive quote within 24 hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
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
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify products list**

```bash
npm run dev
```

Visit `/products`. Confirm: Fresh Red Onion appears first, all seeded products visible, category filter works via URL param.

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/products/page.tsx
git commit -m "feat: fetch products list from supabase"
```

---

### Task 2: Update product detail page

**Files:**
- Modify: `src/app/(frontend)/products/[slug]/page.tsx`

Replace the giant `STATIC_PRODUCTS` object with a Supabase fetch by slug. Keep all existing JSX/styles.

- [ ] **Step 1: Replace the page**

```tsx
// src/app/(frontend)/products/[slug]/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Product, ProductSpec, ProductImage } from '@/types/database'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, short_description')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (!data) return { title: 'Product Not Found' }
  return { title: data.name, description: data.short_description ?? undefined }
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

  // Fetch related products
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

  return (
    <div className="bg-cream min-h-screen">
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
```

- [ ] **Step 2: Verify product detail**

```bash
npm run dev
```

Visit `/products/fresh-red-onion`. Confirm: name, description, origin, grades, packaging render correctly. Visit `/products/turmeric-finger`. Confirm: specs table renders.

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/products/[slug]/page.tsx
git commit -m "feat: fetch product detail from supabase"
```

---

### Task 3: Update certifications page

**Files:**
- Modify: `src/app/(frontend)/certifications/page.tsx`

- [ ] **Step 1: Replace the page**

```tsx
// src/app/(frontend)/certifications/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Myra Global Exports holds certifications ensuring international trade compliance.',
}

export default async function CertificationsPage() {
  const supabase = await createClient()
  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order')

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          Our Certifications
        </h1>
        <p className="text-gray-500">Certified, compliant, and trusted for international trade</p>
      </div>

      {certifications && certifications.length > 0 ? (
        <div className="rounded-2xl bg-brand-green/5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                {cert.logo_url ? (
                  <Image src={cert.logo_url} alt={cert.name} width={80} height={80} className="object-contain" />
                ) : (
                  <div className="w-20 h-20 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <span className="text-brand-green font-heading text-lg font-bold">{cert.name.slice(0, 2)}</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{cert.name}</p>
                  {cert.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{cert.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400">Certifications information coming soon.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(frontend)/certifications/page.tsx
git commit -m "feat: fetch certifications from supabase"
```

---

### Task 4: Update gallery page

**Files:**
- Modify: `src/app/(frontend)/gallery/page.tsx`

- [ ] **Step 1: Replace the page**

```tsx
// src/app/(frontend)/gallery/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo gallery of Myra Global Exports — operations, products, and partnerships.',
}

const CATEGORIES = ['All', 'Warehouse', 'Products', 'Team', 'Export', 'Other']

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('gallery_images')
    .select('*')
    .order('display_order')

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data: images } = await query

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Gallery</h1>
        <p className="text-gray-500">A glimpse into our operations, partnerships, and achievements</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={cat === 'All' ? '/gallery' : `/gallery?category=${cat}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (cat === 'All' && !category) || category === cat
                ? 'bg-brand-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={img.url}
                alt={img.alt ?? ''}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {img.alt && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-2">
                  <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.alt}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          {category ? `No images in "${category}" category.` : 'Gallery photos coming soon.'}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(frontend)/gallery/page.tsx
git commit -m "feat: fetch gallery images from supabase"
```

---

### Task 5: Update news pages

**Files:**
- Modify: `src/app/(frontend)/news/page.tsx`
- Modify: `src/app/(frontend)/news/[slug]/page.tsx`

- [ ] **Step 1: Install react-markdown**

```bash
npm install react-markdown
```

- [ ] **Step 2: Replace news list page**

```tsx
// src/app/(frontend)/news/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news and announcements from Myra Global Exports.',
}

export default async function NewsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('news')
    .select('id, title, slug, cover_image_url, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          News &amp; Updates
        </h1>
        <p className="text-gray-500">Stay up to date with Myra Global Exports</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {post.cover_image_url ? (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-48 bg-brand-green/5 flex items-center justify-center">
                  <span className="text-brand-green/20 font-heading text-4xl font-bold">M</span>
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-IN', {
                    dateStyle: 'long',
                  })}
                </p>
                <h2 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-brand-green transition-colors leading-snug">
                  {post.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No news articles yet. Check back soon.</p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Replace news article page**

```tsx
// src/app/(frontend)/news/[slug]/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('title')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (!data) return { title: 'Article Not Found' }
  return { title: data.title }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/news" className="text-sm text-brand-green hover:underline mb-6 inline-block">
        ← Back to News
      </Link>

      {post.cover_image_url && (
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <p className="text-sm text-gray-400 mb-3">
        {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
      </p>

      <h1 className="font-heading text-4xl font-bold text-brand-green mb-8 leading-tight">
        {post.title}
      </h1>

      {post.body && (
        <div className="prose prose-green max-w-none">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/(frontend)/news/
git commit -m "feat: fetch news from supabase with markdown rendering"
```

---

### Task 6: Update inquiry API to save leads

**Files:**
- Modify: `src/app/api/inquiry/route.ts`

Replace email sending with Supabase insert. Keep the same request/response contract so the form doesn't change.

- [ ] **Step 1: Replace the route handler**

```typescript
// src/app/api/inquiry/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  fullName: z.string().min(2),
  company: z.string().optional(),
  country: z.string().min(2),
  productRequired: z.string().min(2),
  quantity: z.string().optional(),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const { fullName, company, country, productRequired, quantity, email, whatsapp, message } = parsed.data

  const supabase = createAdminClient()
  const { error } = await supabase.from('leads').insert({
    full_name: fullName,
    company: company ?? null,
    country,
    product_required: productRequired,
    quantity: quantity ?? null,
    email,
    whatsapp: whatsapp ?? null,
    message: message ?? null,
    source: req.headers.get('referer') ?? null,
    status: 'new',
  })

  if (error) {
    console.error('Lead insert error:', error)
    return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
```

- [ ] **Step 2: Test inquiry form**

```bash
npm run dev
```

Submit the inquiry form at `/get-quote`. Then check `/admin/leads` — the new lead should appear with status "new".

- [ ] **Step 3: Commit**

```bash
git add src/app/api/inquiry/route.ts
git commit -m "feat: save inquiry form submissions to supabase leads table"
```

---

### Task 7: Update sitemap and site settings

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/data/site-settings.ts`

- [ ] **Step 1: Update sitemap to fetch slugs from Supabase**

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myraglobalexports.com'

  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/products', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/certifications', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/get-quote', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/gallery', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/news', priority: 0.7, changeFreq: 'weekly' as const },
    { path: '/privacy-policy', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
  ].map(({ path, priority, changeFreq }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }))

  const supabase = createAdminClient()

  const [{ data: products }, { data: news }] = await Promise.all([
    supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_published', true)
      .eq('is_future', false),
    supabase
      .from('news')
      .select('slug, updated_at')
      .eq('is_published', true),
  ])

  const productPages = (products ?? []).map(({ slug, updated_at }) => ({
    url: `${base}/products/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const newsPages = (news ?? []).map(({ slug, updated_at }) => ({
    url: `${base}/news/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...newsPages]
}
```

- [ ] **Step 2: Enable news and gallery in site-settings**

```typescript
// src/data/site-settings.ts
export const siteSettings = {
  contact: {
    phone: '+91 98765 43210',
    email: 'info@myraglobalexports.com',
    salesEmail: 'sales@myraglobalexports.com',
    whatsapp: '+919876543210',
    address: 'Maharashtra, India',
    businessHours: 'Mon–Sat, 9:00 AM – 6:00 PM IST',
    googleMapsEmbedUrl: null as string | null,
  },
  social: {
    whatsapp: 'https://wa.me/919876543210',
    instagram: null as string | null,
    facebook: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
  },
  sections: {
    showProducts: true,
    showCertificates: true,
    showExportMarkets: true,
    showContactInfo: true,
    showGallery: true,
    showNews: true,
    showPartners: false,
  },
  downloads: {
    companyProfile: null as { url: string } | null,
    productCatalogue: null as { url: string } | null,
  },
}
```

- [ ] **Step 3: Run final build check**

```bash
npm run build
```

Expected: build completes successfully with no TypeScript or linting errors. Dynamic routes for products and news should show up in the build output.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/data/site-settings.ts
git commit -m "feat: dynamic sitemap from supabase, enable news and gallery sections"
```

---

### Task 8: End-to-end verification

- [ ] **Step 1: Start dev server and run through all pages**

```bash
npm run dev
```

Checklist:
- [ ] `/products` — Fresh Red Onion first, all products visible, category filter works
- [ ] `/products/fresh-red-onion` — full detail, varieties, grades, packaging shown
- [ ] `/products/turmeric-finger` — specs table renders
- [ ] `/certifications` — empty state if no certs added, or shows certs added via admin
- [ ] `/gallery` — empty state if no images, or shows uploaded images with category filter
- [ ] `/news` — empty state if no posts, or shows published posts
- [ ] `/news/<slug>` — article renders with markdown body
- [ ] Submit inquiry form at `/get-quote` → check `/admin/leads` — lead appears with status "new"
- [ ] `http://localhost:3000/sitemap.xml` — all product slugs appear

- [ ] **Step 2: Final commit**

```bash
git add -A
git commit -m "chore: complete supabase frontend migration"
```

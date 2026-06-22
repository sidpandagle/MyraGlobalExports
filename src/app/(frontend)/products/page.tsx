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

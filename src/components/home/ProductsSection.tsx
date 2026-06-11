import Link from 'next/link'
import Image from 'next/image'

type ProductImage = {
  image: {
    url?: string | null
    alt?: string | null
  } | null
}

type Product = {
  id: string
  name: string
  slug: string
  category?: string | null
  shortDescription?: string | null
  images?: ProductImage[] | null
}

type Props = { products: Product[] }

const MOCK_PRODUCTS: Product[] = [
  { id: 'm1', name: 'Basmati Rice', slug: 'basmati-rice', category: 'Grains', shortDescription: 'Premium aged basmati with distinct aroma and long grain.' },
  { id: 'm2', name: 'Turmeric', slug: 'turmeric', category: 'Spices', shortDescription: 'High curcumin content, bright golden colour from Erode.' },
  { id: 'm3', name: 'Cumin Seeds', slug: 'cumin', category: 'Spices', shortDescription: 'Aromatic cumin sourced from the farms of Rajasthan.' },
  { id: 'm4', name: 'Sesame Seeds', slug: 'sesame', category: 'Oil Seeds', shortDescription: 'Export-grade white & black sesame, hull and natural.' },
  { id: 'm5', name: 'Red Chilli', slug: 'red-chilli', category: 'Spices', shortDescription: 'Bold flavour and vibrant colour from Guntur, Andhra Pradesh.' },
  { id: 'm6', name: 'Groundnuts', slug: 'groundnuts', category: 'Oil Seeds', shortDescription: 'Bold & Java variety groundnuts, aflatoxin tested.' },
  { id: 'm7', name: 'Wheat', slug: 'wheat', category: 'Grains', shortDescription: 'Milling and durum wheat with consistent protein content.' },
  { id: 'm8', name: 'Soybean Meal', slug: 'soybean', category: 'Feed', shortDescription: 'High-protein soybean meal for feed and food processing.' },
]

export function ProductsSection({ products }: Props) {
  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS

  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">
                Product Range
              </p>
            </div>
            <h2
              className="font-heading font-light text-brand-green leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}
            >
              Our Products
            </h2>
          </div>
          <Link
            href="/products"
            className="shrink-0 border border-brand-green px-6 py-2.5 text-[11.5px] font-sans font-semibold uppercase tracking-[0.14em] text-brand-green transition-all hover:bg-brand-green hover:text-white"
          >
            View All Products
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-px bg-fog sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.map((product) => {
            const imgObj = product.images?.[0]?.image
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white hover:bg-cream transition-colors duration-200 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-52 bg-fog/50 overflow-hidden">
                  {imgObj?.url ? (
                    <Image
                      src={imgObj.url}
                      alt={imgObj.alt ?? product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
                      <span className="text-5xl" aria-hidden="true">🌾</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1 border-t border-fog">
                  {product.category && (
                    <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-brand-gold mb-2">
                      {product.category}
                    </p>
                  )}
                  <h3 className="font-heading text-xl font-semibold text-bark mb-2 leading-tight">
                    {product.name}
                  </h3>
                  {product.shortDescription && (
                    <p className="text-[13px] font-sans text-bark/55 line-clamp-2 leading-relaxed flex-1">
                      {product.shortDescription}
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
    </section>
  )
}

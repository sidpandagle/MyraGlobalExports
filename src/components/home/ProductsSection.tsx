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

export function ProductsSection({ products }: Props) {
  if (products.length === 0) return null

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-brand-green">
          Our Products
        </h2>
        <p className="mb-10 text-center text-gray-500">
          Premium agricultural commodities sourced from India&apos;s finest farms
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const imgObj = product.images?.[0]?.image
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-48 bg-gray-100">
                  {imgObj?.url ? (
                    <Image
                      src={imgObj.url}
                      alt={imgObj.alt ?? product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">🌾</div>
                  )}
                </div>
                <div className="p-4">
                  {product.category && (
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">
                      {product.category}
                    </p>
                  )}
                  <h3 className="mt-1 font-semibold text-gray-900">{product.name}</h3>
                  {product.shortDescription && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {product.shortDescription}
                    </p>
                  )}
                  <span className="mt-3 inline-block text-xs font-medium text-brand-green">
                    View Details →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="rounded-full border-2 border-brand-green px-8 py-3 font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

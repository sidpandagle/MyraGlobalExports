import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Products',
  description:
    "Browse Myra Global Exports' range of premium agricultural products available for export.",
}

type ProductImage = {
  image: { url?: string | null; alt?: string | null } | null
}

type Product = {
  id: string
  name: string
  slug: string
  category?: string | null
  shortDescription?: string | null
  images?: ProductImage[] | null
}

async function getProducts(): Promise<Product[]> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: { visible: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
      depth: 1,
    })
    return result.docs as unknown as Product[]
  } catch {
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Our Products</h1>
        <p className="text-gray-500">
          Premium agricultural commodities sourced from India&apos;s finest farms
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-4 text-5xl" aria-hidden="true">🌾</div>
          <p className="text-gray-400">Products coming soon. Please check back.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const imgObj = product.images?.[0]?.image
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
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
                    <div
                      className="flex h-full items-center justify-center text-4xl"
                      aria-hidden="true"
                    >
                      🌾
                    </div>
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
      )}

      <div className="mt-12 rounded-2xl bg-brand-green p-8 text-center text-white">
        <h2 className="mb-2 text-2xl font-bold">Interested in Our Products?</h2>
        <p className="mb-6 text-green-100">
          Send us an inquiry and get a competitive quote within 24 hours.
        </p>
        <Link
          href="/get-quote"
          className="inline-block rounded-full bg-brand-gold px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-brand-gold-light"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type ProductImage = {
  image: { url?: string | null; alt?: string | null } | null
}

type Product = {
  id: string
  name: string
  slug: string
  category?: string | null
  shortDescription?: string | null
  description?: unknown
  packagingInfo?: string | null
  images?: ProductImage[] | null
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      where: {
        and: [
          { slug: { equals: slug } },
          { visible: { equals: true } },
        ],
      },
      limit: 1,
      depth: 1,
    })
    return (result.docs[0] as unknown as Product) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.shortDescription ?? undefined,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const firstImage = product.images?.[0]?.image

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-brand-green hover:underline"
      >
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-96 overflow-hidden rounded-2xl bg-gray-100">
          {firstImage?.url ? (
            <Image
              src={firstImage.url}
              alt={firstImage.alt ?? product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full items-center justify-center text-6xl"
              aria-hidden="true"
            >
              🌾
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">
              {product.category}
            </p>
          )}
          <h1 className="mt-2 font-heading text-3xl font-bold text-gray-900">{product.name}</h1>
          {product.shortDescription && (
            <p className="mt-4 text-gray-600">{product.shortDescription}</p>
          )}
          {product.packagingInfo && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-brand-green">Packaging</h3>
              <p className="text-sm text-gray-600">{product.packagingInfo}</p>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/get-quote"
              className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-light"
            >
              Get a Quote
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-brand-green px-6 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Image gallery */}
      {product.images && product.images.length > 1 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-brand-green">More Images</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {product.images.slice(1).map((imgItem, i) => {
              if (!imgItem.image?.url) return null
              return (
                <div
                  key={i}
                  className="relative h-40 overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={imgItem.image.url}
                    alt={imgItem.image.alt ?? `${product.name} image ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

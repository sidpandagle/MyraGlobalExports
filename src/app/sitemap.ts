import type { MetadataRoute } from 'next'

async function getDynamicPaths(): Promise<{
  products: { slug: string; updatedAt: string }[]
  news: { slug: string; updatedAt: string }[]
}> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const [productsResult, newsResult] = await Promise.all([
      payload.find({
        collection: 'products',
        where: { visible: { equals: true } },
        limit: 500,
      }),
      payload.find({
        collection: 'news',
        where: { visible: { equals: true } },
        limit: 500,
      }),
    ])
    return {
      products: productsResult.docs.map((p) => ({
        slug: p.slug as string,
        updatedAt: p.updatedAt as string,
      })),
      news: newsResult.docs.map((n) => ({
        slug: n.slug as string,
        updatedAt: n.updatedAt as string,
      })),
    }
  } catch {
    return { products: [], news: [] }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myraglobalexports.com'

  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/products', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/certifications', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/get-quote', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/gallery', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/partners', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/news', priority: 0.7, changeFreq: 'weekly' as const },
    { path: '/privacy-policy', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
  ].map(({ path, priority, changeFreq }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }))

  const { products, news } = await getDynamicPaths()

  const productPages = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const newsPages = news.map((n) => ({
    url: `${base}/news/${n.slug}`,
    lastModified: new Date(n.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...newsPages]
}

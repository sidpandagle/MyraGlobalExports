import type { MetadataRoute } from 'next'

const PRODUCT_SLUGS = [
  'basmati-rice', 'turmeric', 'cumin', 'sesame', 'red-chilli',
  'groundnuts', 'wheat', 'soybean', 'coriander', 'mustard',
  'ginger', 'pulses', 'garlic', 'onion',
]

export default function sitemap(): MetadataRoute.Sitemap {
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

  const productPages = PRODUCT_SLUGS.map((slug) => ({
    url: `${base}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages]
}

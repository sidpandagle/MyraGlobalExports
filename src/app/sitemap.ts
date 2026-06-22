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

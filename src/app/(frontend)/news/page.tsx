import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news and announcements from Myra Global Exports.',
}

type Article = {
  id: string
  title: string
  slug: string
  category?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  coverImage?: { url?: string | null; alt?: string | null } | null
}

async function getNewsData(): Promise<{
  articles: Article[]
  show: boolean
}> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const [result, settings] = await Promise.all([
      payload.find({
        collection: 'news',
        where: { visible: { equals: true } },
        sort: '-publishedAt',
        limit: 50,
        depth: 1,
      }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])
    return {
      articles: result.docs as unknown as Article[],
      show: settings.sections?.showNews !== false,
    }
  } catch {
    return { articles: [], show: true }
  }
}

export default async function NewsPage() {
  const { articles, show } = await getNewsData()

  if (!show) {
    return <div className="py-32 text-center text-gray-400">News section coming soon.</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          News &amp; Updates
        </h1>
        <p className="text-gray-500">Stay up to date with Myra Global Exports</p>
      </div>

      {articles.length === 0 ? (
        <p className="text-center text-gray-400">No news articles yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {article.coverImage?.url && (
                <div className="relative h-48">
                  <Image
                    src={article.coverImage.url}
                    alt={article.coverImage.alt ?? article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                {article.category && (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    {article.category}
                  </p>
                )}
                <h3 className="font-semibold text-gray-900">{article.title}</h3>
                {article.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-gray-500">{article.excerpt}</p>
                )}
                {article.publishedAt && (
                  <p className="mt-3 text-xs text-gray-400">
                    {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

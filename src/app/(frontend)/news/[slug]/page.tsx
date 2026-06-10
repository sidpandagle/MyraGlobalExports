import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Article = {
  id: string
  title: string
  slug: string
  category?: string | null
  excerpt?: string | null
  publishedAt?: string | null
  coverImage?: { url?: string | null; alt?: string | null } | null
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'news',
      where: {
        and: [
          { slug: { equals: slug } },
          { visible: { equals: true } },
        ],
      },
      limit: 1,
      depth: 1,
    })
    return (result.docs[0] as unknown as Article) ?? null
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
  const article = await getArticle(slug)
  if (!article) return { title: 'Article Not Found' }
  return { title: article.title, description: article.excerpt ?? undefined }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link
        href="/news"
        className="mb-8 inline-flex items-center gap-2 text-sm text-brand-green hover:underline"
      >
        ← Back to News
      </Link>

      {article.category && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-gold">
          {article.category}
        </p>
      )}
      <h1 className="mb-4 font-heading text-4xl font-bold text-gray-900">{article.title}</h1>
      {article.publishedAt && (
        <p className="mb-6 text-sm text-gray-400">
          {new Date(article.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}
      {article.coverImage?.url && (
        <div className="relative mb-8 h-72 overflow-hidden rounded-2xl">
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt ?? article.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      {article.excerpt && (
        <p className="text-lg leading-relaxed text-gray-600">{article.excerpt}</p>
      )}
    </div>
  )
}

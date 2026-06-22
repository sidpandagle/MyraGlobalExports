import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news and announcements from Myra Global Exports.',
}

export default async function NewsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('news')
    .select('id, title, slug, cover_image_url, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          News &amp; Updates
        </h1>
        <p className="text-gray-500">Stay up to date with Myra Global Exports</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {post.cover_image_url ? (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-48 bg-brand-green/5 flex items-center justify-center">
                  <span className="text-brand-green/20 font-heading text-4xl font-bold">M</span>
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-IN', {
                    dateStyle: 'long',
                  })}
                </p>
                <h2 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-brand-green transition-colors leading-snug">
                  {post.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No news articles yet. Check back soon.</p>
      )}
    </div>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('title')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (!data) return { title: 'Article Not Found' }
  return { title: data.title }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/news" className="text-sm text-brand-green hover:underline mb-6 inline-block">
        ← Back to News
      </Link>

      {post.cover_image_url && (
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <p className="text-sm text-gray-400 mb-3">
        {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
      </p>

      <h1 className="font-heading text-4xl font-bold text-brand-green mb-8 leading-tight">
        {post.title}
      </h1>

      {post.body && (
        <div className="prose prose-green max-w-none">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news and announcements from Myra Global Exports.',
}

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          News &amp; Updates
        </h1>
        <p className="text-gray-500">Stay up to date with Myra Global Exports</p>
      </div>
      <p className="text-center text-gray-400">No news articles yet. Check back soon.</p>
    </div>
  )
}

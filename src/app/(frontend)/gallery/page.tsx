import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo and video gallery of Myra Global Exports.',
}

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Gallery</h1>
        <p className="text-gray-500">
          A glimpse into our operations, partnerships, and achievements
        </p>
      </div>
      <p className="text-center text-gray-400">Gallery photos coming soon.</p>
    </div>
  )
}

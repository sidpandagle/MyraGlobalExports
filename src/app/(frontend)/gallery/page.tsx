import type { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo gallery of Myra Global Exports — operations, products, and partnerships.',
}

const CATEGORIES = ['All', 'Warehouse', 'Products', 'Team', 'Export', 'Other']

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('gallery_images')
    .select('*')
    .order('display_order')

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data: images } = await query

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Gallery</h1>
        <p className="text-gray-500">A glimpse into our operations, partnerships, and achievements</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={cat === 'All' ? '/gallery' : `/gallery?category=${cat}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              (cat === 'All' && !category) || category === cat
                ? 'bg-brand-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={img.url}
                alt={img.alt ?? ''}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {img.alt && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-2">
                  <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.alt}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          {category ? `No images in "${category}" category.` : 'Gallery photos coming soon.'}
        </p>
      )}
    </div>
  )
}

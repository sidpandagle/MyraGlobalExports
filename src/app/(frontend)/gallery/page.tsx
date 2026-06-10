import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo and video gallery of Myra Global Exports.',
}

type MediaItem = {
  id: string
  title: string
  caption?: string | null
  category?: string | null
  media: { url?: string | null; alt?: string | null } | null
  mediaType?: string | null
}

async function getGalleryData(): Promise<{
  items: MediaItem[]
  show: boolean
}> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const [result, settings] = await Promise.all([
      payload.find({
        collection: 'gallery',
        where: { visible: { equals: true } },
        sort: 'sortOrder',
        limit: 200,
        depth: 1,
      }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])
    return {
      items: result.docs as unknown as MediaItem[],
      show: settings.sections?.showGallery !== false,
    }
  } catch {
    return { items: [], show: true }
  }
}

export default async function GalleryPage() {
  const { items, show } = await getGalleryData()

  if (!show) {
    return (
      <div className="py-32 text-center text-gray-400">Gallery coming soon.</div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Gallery</h1>
        <p className="text-gray-500">
          A glimpse into our operations, partnerships, and achievements
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-400">Gallery photos coming soon.</p>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {items.map((item) => {
            if (!item.media?.url) return null
            return (
              <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl">
                <Image
                  src={item.media.url}
                  alt={item.media.alt ?? item.title}
                  width={400}
                  height={300}
                  className="w-full object-cover"
                />
                {item.caption && (
                  <p className="bg-gray-50 px-3 py-2 text-xs text-gray-600">{item.caption}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

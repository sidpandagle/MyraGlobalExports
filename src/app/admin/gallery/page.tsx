import Image from 'next/image'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteGalleryImage } from './actions'
import { GalleryUploadForm } from './_components/GalleryUploadForm'

export default async function AdminGalleryPage() {
  const supabase = createAdminClient()
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>
          Gallery
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--admin-muted)' }}>
          {images?.length ?? 0} images
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-2.5">
            {images?.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square rounded-lg overflow-hidden"
                style={{ border: '1px solid var(--admin-border)' }}
              >
                <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-white/90 bg-black/40 px-1.5 py-0.5 rounded-md">
                      {img.category}
                    </span>
                    <form action={deleteGalleryImage.bind(null, img.id)}>
                      <button
                        type="submit"
                        className="text-xs text-white bg-red-500/80 hover:bg-red-600 px-2 py-0.5 rounded-md transition-colors"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
            {!images?.length && (
              <p
                className="col-span-3 text-sm text-center py-12"
                style={{ color: 'var(--admin-muted)' }}
              >
                No images yet.
              </p>
            )}
          </div>
        </div>

        <div
          className="bg-white rounded-lg p-6 self-start"
          style={{ border: '1px solid var(--admin-border)' }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>
            Upload Image
          </h2>
          <GalleryUploadForm />
        </div>
      </div>
    </div>
  )
}

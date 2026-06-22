import Image from 'next/image'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteGalleryImage } from './actions'
import { Button } from '@/components/ui/button'
import { GalleryUploadForm } from './_components/GalleryUploadForm'

export default async function AdminGalleryPage() {
  const supabase = createAdminClient()
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Gallery</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            {images?.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">{img.category}</span>
                    <form action={deleteGalleryImage.bind(null, img.id)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="text-white hover:bg-red-500/80 h-6 px-2 text-xs"
                      >
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
            {!images?.length && (
              <p className="col-span-3 text-neutral-400 text-sm text-center py-12">No images yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Upload Image</h2>
          <GalleryUploadForm />
        </div>
      </div>
    </div>
  )
}

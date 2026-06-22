'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '../../_components/ImageUploader'
import { addGalleryImage } from '../actions'

const CATEGORIES = ['Warehouse', 'Products', 'Team', 'Export', 'Other']

export function GalleryUploadForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('Products')
  const [displayOrder, setDisplayOrder] = useState(999)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url) { setError('Upload an image first'); return }
    setSaving(true)
    setError(null)
    const result = await addGalleryImage({ url, alt: alt || null, category, display_order: displayOrder })
    if (result.error) { setError(result.error); setSaving(false); return }
    setUrl(''); setAlt(''); setDisplayOrder(999)
    router.refresh()
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Image *</Label>
        <ImageUploader bucket="gallery" currentUrl={url || null} onUpload={setUrl} />
      </div>
      <div className="space-y-1">
        <Label>Alt Text</Label>
        <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Display Order</Label>
          <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}
      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add to Gallery'}</Button>
    </form>
  )
}

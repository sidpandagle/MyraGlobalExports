'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type Props = {
  bucket: 'product-images' | 'certification-logos' | 'gallery' | 'news-covers'
  currentUrl?: string | null
  onUpload: (url: string) => void
  className?: string
}

export function ImageUploader({ bucket, currentUrl, onUpload, className }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const maxMb = 5
    if (file.size > maxMb * 1024 * 1024) {
      setError(`File must be under ${maxMb} MB`)
      return
    }

    setError(null)
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onUpload(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className={className}>
      {currentUrl && (
        <div className="mb-2 relative w-32 h-24 rounded overflow-hidden border border-neutral-200">
          <Image src={currentUrl} alt="preview" fill className="object-cover" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? 'Uploading…' : currentUrl ? 'Replace image' : 'Upload image'}
      </Button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

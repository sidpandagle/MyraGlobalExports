'use server'
import { createAdminClient } from '@/lib/supabase/admin'

type Bucket = 'product-images' | 'certification-logos' | 'gallery' | 'news-covers'

export async function uploadImage(bucket: Bucket, formData: FormData) {
  const file = formData.get('file') as File | null
  if (!file) return { error: 'No file provided' }

  const maxMb = 5
  if (file.size > maxMb * 1024 * 1024) {
    return { error: `File must be under ${maxMb} MB` }
  }

  const supabase = createAdminClient()
  const ext = file.name.split('.').pop()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) return { error: error.message }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl }
}

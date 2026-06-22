'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { GalleryImageInsert } from '@/types/database'

export async function addGalleryImage(data: GalleryImageInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('gallery_images').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('gallery_images').delete().eq('id', id)
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}

'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { NewsInsert, NewsUpdate } from '@/types/database'

export async function createPost(data: NewsInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('news').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/news')
  revalidatePath('/news')
  return { success: true }
}

export async function updatePost(id: string, data: NewsUpdate) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('news')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/news')
  revalidatePath('/news')
  if (data.slug) revalidatePath(`/news/${data.slug}`)
  return { success: true }
}

export async function deletePost(id: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('news').delete().eq('id', id)
  revalidatePath('/admin/news')
  revalidatePath('/news')
}

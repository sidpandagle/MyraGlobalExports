'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ProductInsert, ProductUpdate } from '@/types/database'

export async function createProduct(data: ProductInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { success: true }
}

export async function updateProduct(id: string, data: ProductUpdate) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('products')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/products')
  if (data.slug) revalidatePath(`/products/${data.slug}`)
  return { success: true }
}

export async function deleteProduct(id: string, slug: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath(`/products/${slug}`)
}

export async function togglePublished(id: string, current: boolean): Promise<void> {
  const supabase = createAdminClient()
  await supabase
    .from('products')
    .update({ is_published: !current, updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/products')
}

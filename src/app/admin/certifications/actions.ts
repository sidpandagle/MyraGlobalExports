'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { CertificationInsert } from '@/types/database'

export async function createCertification(data: CertificationInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('certifications').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/certifications')
  revalidatePath('/certifications')
  return { success: true }
}

export async function updateCertification(id: string, data: Partial<CertificationInsert>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('certifications').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/certifications')
  revalidatePath('/certifications')
  return { success: true }
}

export async function deleteCertification(id: string): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('certifications').delete().eq('id', id)
  revalidatePath('/admin/certifications')
  revalidatePath('/certifications')
}

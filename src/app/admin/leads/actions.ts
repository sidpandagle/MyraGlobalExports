'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateLeadStatus(id: string, status: 'new' | 'contacted' | 'closed'): Promise<void> {
  const supabase = createAdminClient()
  await supabase.from('leads').update({ status }).eq('id', id)
  revalidatePath('/admin/leads')
}

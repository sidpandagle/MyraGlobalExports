import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { NewsForm } from '../_components/NewsForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: post } = await supabase.from('news').select('*').eq('id', id).single()
  if (!post) notFound()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Edit: {post.title}</h1>
      <NewsForm post={post} />
    </div>
  )
}

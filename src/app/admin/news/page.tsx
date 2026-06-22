import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deletePost } from './actions'

export default async function AdminNewsPage() {
  const supabase = createAdminClient()
  const { data: posts } = await supabase
    .from('news')
    .select('id, title, slug, is_published, published_at, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">News</h1>
        <Button asChild><Link href="/admin/news/new">+ New Post</Link></Button>
      </div>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Title</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Date</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <span className="font-medium text-neutral-800">{p.title}</span>
                  <span className="ml-2 text-xs text-neutral-400">{p.slug}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge className={p.is_published ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''} variant={p.is_published ? 'default' : 'secondary'}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-neutral-500 text-xs">
                  {new Date(p.published_at ?? p.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/news/${p.id}`}>Edit</Link>
                    </Button>
                    <form action={deletePost.bind(null, p.id)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
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
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>
            News
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--admin-muted)' }}>
            {posts?.length ?? 0} posts
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="text-sm font-medium px-4 py-2 rounded-md transition-colors"
          style={{ backgroundColor: 'var(--admin-accent)', color: 'white' }}
        >
          + New Post
        </Link>
      </div>

      <div
        className="bg-white rounded-lg overflow-hidden"
        style={{ border: '1px solid var(--admin-border)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--admin-muted)' }}>
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--admin-muted)' }}>
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--admin-muted)' }}>
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: 'var(--admin-muted)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((p, i) => (
              <tr
                key={p.id}
                className="transition-colors hover:bg-[#FAF8F4]"
                style={{
                  borderBottom:
                    i < (posts.length - 1) ? '1px solid var(--admin-border)' : undefined,
                }}
              >
                <td className="px-4 py-3">
                  <span className="font-medium" style={{ color: 'var(--admin-text)' }}>
                    {p.title}
                  </span>
                  <span className="ml-2 text-xs" style={{ color: 'var(--admin-muted)' }}>
                    {p.slug}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={
                      p.is_published
                        ? { backgroundColor: 'rgba(13,59,26,0.1)', color: '#0D3B1A' }
                        : { backgroundColor: 'rgba(42,28,12,0.08)', color: 'var(--admin-muted)' }
                    }
                  >
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--admin-muted)' }}>
                  {new Date(p.published_at ?? p.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 justify-end">
                    <Link
                      href={`/admin/news/${p.id}`}
                      className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                      style={{
                        backgroundColor: 'var(--admin-bg)',
                        color: 'var(--admin-text)',
                        border: '1px solid var(--admin-border)',
                      }}
                    >
                      Edit
                    </Link>
                    <form action={deletePost.bind(null, p.id)}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-md font-medium"
                        style={{ color: '#B84040' }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!posts?.length && (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--admin-muted)' }}>
            No posts yet.
          </p>
        )}
      </div>
    </div>
  )
}

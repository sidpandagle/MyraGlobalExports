import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteProduct, togglePublished } from './actions'

export default async function AdminProductsPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, category, display_order, is_published, is_future')
    .order('display_order')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>
            Products
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--admin-muted)' }}>
            {products?.length ?? 0} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="text-sm font-medium px-4 py-2 rounded-md transition-colors"
          style={{ backgroundColor: 'var(--admin-accent)', color: 'white' }}
        >
          + New Product
        </Link>
      </div>

      <div
        className="bg-white rounded-lg overflow-hidden"
        style={{ border: '1px solid var(--admin-border)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg)' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold w-12" style={{ color: 'var(--admin-muted)' }}>
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--admin-muted)' }}>
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--admin-muted)' }}>
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--admin-muted)' }}>
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold" style={{ color: 'var(--admin-muted)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p, i) => (
              <tr
                key={p.id}
                className="transition-colors hover:bg-[#FAF8F4]"
                style={{
                  borderBottom:
                    i < (products.length - 1) ? '1px solid var(--admin-border)' : undefined,
                }}
              >
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--admin-muted)' }}>
                  {p.display_order}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium" style={{ color: 'var(--admin-text)' }}>
                    {p.name}
                  </span>
                  <span className="ml-2 text-xs" style={{ color: 'var(--admin-muted)' }}>
                    {p.slug}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--admin-muted)' }}>
                  {p.category}
                </td>
                <td className="px-4 py-3">
                  {p.is_future ? (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(200,136,42,0.12)',
                        color: '#8B5E1A',
                      }}
                    >
                      Future
                    </span>
                  ) : p.is_published ? (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(13,59,26,0.1)',
                        color: '#0D3B1A',
                      }}
                    >
                      Live
                    </span>
                  ) : (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'rgba(42,28,12,0.08)',
                        color: 'var(--admin-muted)',
                      }}
                    >
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 justify-end">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                      style={{
                        backgroundColor: 'var(--admin-bg)',
                        color: 'var(--admin-text)',
                        border: '1px solid var(--admin-border)',
                      }}
                    >
                      Edit
                    </Link>
                    <form action={togglePublished.bind(null, p.id, p.is_published)}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                        style={{
                          backgroundColor: 'var(--admin-bg)',
                          color: 'var(--admin-text)',
                          border: '1px solid var(--admin-border)',
                        }}
                      >
                        {p.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                    <form action={deleteProduct.bind(null, p.id, p.slug)}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
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
        {!products?.length && (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--admin-muted)' }}>
            No products yet.
          </p>
        )}
      </div>
    </div>
  )
}

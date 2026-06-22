import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
        <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">+ New Product</Link>
        </Button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-4 py-3 text-left font-medium text-neutral-500 w-12">Order</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Category</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3 text-neutral-400 text-xs">{p.display_order}</td>
                <td className="px-4 py-3">
                  <span className="font-medium text-neutral-800">{p.name}</span>
                  <span className="ml-2 text-xs text-neutral-400">{p.slug}</span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{p.category}</td>
                <td className="px-4 py-3">
                  {p.is_future ? (
                    <Badge variant="secondary">Future</Badge>
                  ) : p.is_published ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Live</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/products/${p.id}`}>Edit</Link>
                    </Button>
                    <form action={togglePublished.bind(null, p.id, p.is_published)}>
                      <Button variant="ghost" size="sm" type="submit">
                        {p.is_published ? 'Unpublish' : 'Publish'}
                      </Button>
                    </form>
                    <form action={deleteProduct.bind(null, p.id, p.slug)}>
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

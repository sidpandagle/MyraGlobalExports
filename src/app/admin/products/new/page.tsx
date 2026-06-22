import { ProductForm } from '../_components/ProductForm'

export default function NewProductPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Product</h1>
      <ProductForm />
    </div>
  )
}

import { NewsForm } from '../_components/NewsForm'

export default function NewPostPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Post</h1>
      <NewsForm />
    </div>
  )
}

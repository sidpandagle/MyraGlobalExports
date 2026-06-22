'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ImageUploader } from '../../_components/ImageUploader'
import { createPost, updatePost } from '../actions'
import type { NewsPost } from '@/types/database'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function NewsForm({ post }: { post?: NewsPost }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [body, setBody] = useState(post?.body ?? '')
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? '')
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!post) setSlug(toSlug(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const data = {
      title,
      slug,
      body: body || null,
      cover_image_url: coverUrl || null,
      is_published: isPublished,
      published_at: isPublished ? (post?.published_at ?? new Date().toISOString()) : null,
    }

    const result = post ? await updatePost(post.id, data) : await createPost(data)

    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }
    router.push('/admin/news')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Slug *</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Cover Image</Label>
        <ImageUploader
          bucket="news-covers"
          currentUrl={coverUrl || null}
          onUpload={(url) => setCoverUrl(url)}
        />
        {coverUrl && (
          <Input
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="Or paste URL"
            className="mt-1"
          />
        )}
      </div>

      <div className="space-y-1">
        <Label>Body (Markdown)</Label>
        <div data-color-mode="light">
          <MDEditor value={body} onChange={(v) => setBody(v ?? '')} height={400} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={isPublished} onCheckedChange={setIsPublished} id="published" />
        <Label htmlFor="published">Published</Label>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : post ? 'Save changes' : 'Create post'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/news')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

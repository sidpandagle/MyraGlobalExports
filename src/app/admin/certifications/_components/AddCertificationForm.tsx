'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '../../_components/ImageUploader'
import { createCertification } from '../actions'

export function AddCertificationForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [displayOrder, setDisplayOrder] = useState(999)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const result = await createCertification({
      name,
      description: description || null,
      logo_url: logoUrl || null,
      display_order: displayOrder,
    })
    if (result.error) { setError(result.error); setSaving(false); return }
    setName(''); setDescription(''); setLogoUrl(''); setDisplayOrder(999)
    router.refresh()
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Name *</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>
      <div className="space-y-1">
        <Label>Logo</Label>
        <ImageUploader bucket="certification-logos" currentUrl={logoUrl || null} onUpload={setLogoUrl} />
      </div>
      <div className="space-y-1">
        <Label>Display Order</Label>
        <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}
      <Button type="submit" disabled={saving}>{saving ? 'Adding…' : 'Add Certification'}</Button>
    </form>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageUploader } from '../../_components/ImageUploader'
import { createProduct, updateProduct } from '../actions'
import type { Product, ProductImage, ProductSpec } from '@/types/database'

type Props = {
  product?: Product
}

const CATEGORIES = [
  'Fresh Vegetables', 'Fresh Fruits', 'Spices', 'Grains',
  'Pulses', 'Oil Seeds', 'Herbs', 'Future',
]

const MOQ_UNITS = ['Kg', 'MT', 'Container Load', 'Custom'] as const

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function ArrayEditor({
  label,
  value,
  onChange,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="space-y-1.5">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...value]
                next[i] = e.target.value
                onChange(next)
              }}
              className="flex-1 h-8 text-sm"
            />
            <button
              type="button"
              className="h-8 px-2 text-sm text-red-500 hover:text-red-700 transition-colors"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
          style={{
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-muted)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--admin-bg)'
            e.currentTarget.style.color = 'var(--admin-text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--admin-muted)'
          }}
          onClick={() => onChange([...value, ''])}
        >
          + Add {label.toLowerCase().replace(/s$/, '')}
        </button>
      </div>
    </div>
  )
}

function SpecsEditor({
  value,
  onChange,
}: {
  value: ProductSpec[]
  onChange: (v: ProductSpec[]) => void
}) {
  return (
    <div className="space-y-1">
      <Label>Specifications</Label>
      <div className="space-y-1.5">
        {value.map((spec, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Label"
              value={spec.label}
              onChange={(e) => {
                const next = [...value]
                next[i] = { ...next[i], label: e.target.value }
                onChange(next)
              }}
              className="w-40 h-8 text-sm"
            />
            <Input
              placeholder="Value"
              value={spec.value}
              onChange={(e) => {
                const next = [...value]
                next[i] = { ...next[i], value: e.target.value }
                onChange(next)
              }}
              className="flex-1 h-8 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-500"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              ✕
            </Button>
          </div>
        ))}
        <button
          type="button"
          className="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
          style={{
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-muted)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--admin-bg)'
            e.currentTarget.style.color = 'var(--admin-text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--admin-muted)'
          }}
          onClick={() => onChange([...value, { label: '', value: '' }])}
        >
          + Add spec
        </button>
      </div>
    </div>
  )
}

export function ProductForm({ product }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [category, setCategory] = useState(product?.category ?? 'Fresh Vegetables')
  const [tagline, setTagline] = useState(product?.tagline ?? '')
  const [shortDesc, setShortDesc] = useState(product?.short_description ?? '')
  const [fullDesc, setFullDesc] = useState(product?.full_description ?? '')
  const [origin, setOrigin] = useState(product?.origin ?? '')
  const [emoji, setEmoji] = useState(product?.emoji ?? '')
  const [accentColor, setAccentColor] = useState(product?.accent_color ?? '#C8882A')
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? [])
  const [specs, setSpecs] = useState<ProductSpec[]>(product?.specs ?? [])
  const [varieties, setVarieties] = useState<string[]>(product?.varieties ?? [])
  const [grades, setGrades] = useState<string[]>(product?.grades ?? [])
  const [packaging, setPackaging] = useState<string[]>(product?.packaging ?? [])
  const [certifications, setCertifications] = useState<string[]>(product?.certifications ?? [])
  const [useCases, setUseCases] = useState<string[]>(product?.use_cases ?? [])
  const [relatedSlugs, setRelatedSlugs] = useState<string[]>(product?.related_slugs ?? [])
  const [availability, setAvailability] = useState(product?.availability ?? '')
  const [moq, setMoq] = useState(product?.moq ?? '')
  const [moqUnit, setMoqUnit] = useState<typeof MOQ_UNITS[number]>(
    (product?.moq_unit as typeof MOQ_UNITS[number]) ?? 'MT',
  )
  const [displayOrder, setDisplayOrder] = useState(product?.display_order ?? 999)
  const [isPublished, setIsPublished] = useState(product?.is_published ?? true)
  const [isFuture, setIsFuture] = useState(product?.is_future ?? false)

  function handleNameChange(val: string) {
    setName(val)
    if (!product) setSlug(toSlug(val))
  }

  function addImage(url: string) {
    setImages((prev) => [...prev, { url, alt: name }])
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const data = {
      name,
      slug,
      category,
      tagline: tagline || null,
      short_description: shortDesc || null,
      full_description: fullDesc || null,
      origin: origin || null,
      emoji: emoji || null,
      accent_color: accentColor || null,
      images,
      specs,
      varieties,
      grades,
      packaging,
      certifications,
      use_cases: useCases,
      related_slugs: relatedSlugs,
      availability: availability || null,
      moq: moq || null,
      moq_unit: moqUnit || null,
      display_order: displayOrder,
      is_published: isPublished,
      is_future: isFuture,
    }

    const result = product
      ? await updateProduct(product.id, data)
      : await createProduct(data)

    if (result.error) {
      setError(result.error)
      setSaving(false)
      return
    }

    router.push('/admin/products')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">Basic Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label>Slug *</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Category *</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              required
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Origin</Label>
            <Input value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Tagline</Label>
          <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Short Description</Label>
          <Textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={2} />
        </div>
        <div className="space-y-1">
          <Label>Full Description</Label>
          <Textarea value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} rows={5} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Emoji</Label>
            <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🌾" />
          </div>
          <div className="space-y-1">
            <Label>Accent Color</Label>
            <div className="flex gap-2 items-center">
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-9 w-12 rounded border cursor-pointer" />
              <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <div className="w-24 h-20 rounded overflow-hidden border border-neutral-200">
                <img src={img.url} alt={img.alt ?? ''} className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          <ImageUploader bucket="product-images" onUpload={addImage} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">Commercial</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Availability</Label>
            <Input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Year-round" />
          </div>
          <div className="space-y-1">
            <Label>MOQ</Label>
            <Input value={moq} onChange={(e) => setMoq(e.target.value)} placeholder="1" />
          </div>
          <div className="space-y-1">
            <Label>MOQ Unit</Label>
            <select
              value={moqUnit}
              onChange={(e) => setMoqUnit(e.target.value as typeof MOQ_UNITS[number])}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {MOQ_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-neutral-800">Product Details</h2>
        <ArrayEditor label="Varieties" value={varieties} onChange={setVarieties} />
        <ArrayEditor label="Grades" value={grades} onChange={setGrades} />
        <ArrayEditor label="Packaging Options" value={packaging} onChange={setPackaging} />
        <ArrayEditor label="Certifications" value={certifications} onChange={setCertifications} />
        <ArrayEditor label="Use Cases" value={useCases} onChange={setUseCases} />
        <ArrayEditor label="Related Product Slugs" value={relatedSlugs} onChange={setRelatedSlugs} />
        <SpecsEditor value={specs} onChange={setSpecs} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">Visibility</h2>
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
              id="published"
              className="data-[state=checked]:bg-[#C8882A] data-[state=unchecked]:bg-[#C0B2A0] [&>span]:bg-white [&>span]:shadow-sm"
            />
            <Label htmlFor="published" className="cursor-pointer" style={{ color: 'var(--admin-text)' }}>Published</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={isFuture}
              onCheckedChange={setIsFuture}
              id="future"
              className="data-[state=checked]:bg-[#C8882A] data-[state=unchecked]:bg-[#C0B2A0] [&>span]:bg-white [&>span]:shadow-sm"
            />
            <Label htmlFor="future" className="cursor-pointer" style={{ color: 'var(--admin-text)' }}>Future Product (name only)</Label>
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-md text-sm font-medium transition-opacity disabled:opacity-60"
          style={{ backgroundColor: 'var(--admin-accent)', color: 'white' }}
        >
          {saving ? 'Saving…' : product ? 'Save changes' : 'Create product'}
        </button>
        <button
          type="button"
          className="px-5 py-2 rounded-md text-sm font-medium border transition-colors hover:bg-[#DDD5C5]/40"
          style={{
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text)',
            backgroundColor: 'transparent',
          }}
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

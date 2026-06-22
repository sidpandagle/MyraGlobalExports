# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional `/admin` panel with login, product CRUD, leads management, news editor, certifications, and gallery — all backed by Supabase.

**Architecture:** Next.js App Router at `/admin/*`. Server Components fetch data via admin client (service role). Client Components handle forms, image uploads, and interactivity. Server Actions handle all writes. Next.js middleware guards all `/admin/*` routes except `/admin/login`.

**Tech Stack:** shadcn/ui, `@uiw/react-md-editor` (markdown for news), Supabase Storage (image upload via browser client)

## Global Constraints

- **Prerequisite:** Plan 1 (Supabase Foundation) must be complete — DB tables, client utilities, and TypeScript types must exist
- Next.js 15 App Router — Server Actions with `'use server'`, async `cookies()`, async `params`
- Admin client (`src/lib/supabase/admin.ts`) used in all Server Actions — never expose service role to browser
- Browser client (`src/lib/supabase/browser.ts`) used only for image upload (requires authenticated Supabase session)
- All admin routes return 401 redirect to `/admin/login` if no Supabase session
- shadcn/ui CSS variables scope to the whole app — admin uses shadcn components, frontend uses existing brand classes

---

### Task 1: Initialize shadcn/ui

**Files:**
- Modify: `src/app/globals.css` (shadcn adds CSS variable block)
- Create: `components.json`
- Modify: `tailwind.config.ts` (shadcn adds plugin)
- Create: `src/lib/utils.ts` (shadcn cn helper)
- Modify: `package.json` (new deps)

- [ ] **Step 1: Run shadcn init**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Neutral**
- CSS variables: **Yes**
- Tailwind config: `tailwind.config.ts`
- Components directory: `@/components/ui`
- Utils alias: `@/lib/utils`

- [ ] **Step 2: Install all needed components in one command**

```bash
npx shadcn@latest add button input label textarea select table dialog badge card form toast dropdown-menu separator tabs switch
```

- [ ] **Step 3: Install markdown editor**

```bash
npm install @uiw/react-md-editor
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: initialize shadcn/ui and install admin components"
```

---

### Task 2: Auth middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware**

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Verify middleware is picked up**

```bash
npm run dev
```

Visit `http://localhost:3000/admin` in browser. Expected: redirect to `/admin/login`.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add admin auth middleware"
```

---

### Task 3: Login page

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/login/actions.ts`

- [ ] **Step 1: Create login server action**

```typescript
// src/app/admin/login/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: error.message }
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
```

- [ ] **Step 2: Create login page**

```tsx
// src/app/admin/login/page.tsx
'use client'
import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Myra Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            {state?.error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{state.error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Test login flow**

```bash
npm run dev
```

Go to `http://localhost:3000/admin/login`. Enter the admin email/password created in Task 4 of Plan 1. Expected: redirect to `/admin` (which will 404 until Task 4).

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin login page and auth actions"
```

---

### Task 4: Admin layout and dashboard

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Create admin layout with sidebar nav**

```tsx
// src/app/admin/layout.tsx
import Link from 'next/link'
import { logout } from './login/actions'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/certifications', label: 'Certifications' },
  { href: '/admin/gallery', label: 'Gallery' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-neutral-200 flex flex-col">
        <div className="px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Myra Admin</p>
        </div>
        <Separator />
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 rounded text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="p-3">
          <form action={logout}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-neutral-500" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create dashboard page with stats**

```tsx
// src/app/admin/page.tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: productCount },
    { count: leadCount },
    { count: newLeadCount },
    { count: newsCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true).eq('is_future', false),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('news').select('*', { count: 'exact', head: true }).eq('is_published', true),
  ])

  const stats = [
    { label: 'Published Products', value: productCount ?? 0 },
    { label: 'Total Leads', value: leadCount ?? 0 },
    { label: 'New Leads', value: newLeadCount ?? 0 },
    { label: 'Published Posts', value: newsCount ?? 0 },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-500">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-neutral-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify dashboard loads**

```bash
npm run dev
```

Log in at `/admin/login`, verify redirect to `/admin` shows the stat cards with real counts.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/layout.tsx src/app/admin/page.tsx
git commit -m "feat: add admin layout and dashboard"
```

---

### Task 5: Image uploader component

**Files:**
- Create: `src/app/admin/_components/ImageUploader.tsx`

This component is used by Products, News, Certifications, and Gallery pages. It uploads a file to Supabase Storage using the browser client (authenticated session) and returns the public URL.

- [ ] **Step 1: Create ImageUploader**

```tsx
// src/app/admin/_components/ImageUploader.tsx
'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type Props = {
  bucket: 'product-images' | 'certification-logos' | 'gallery' | 'news-covers'
  currentUrl?: string | null
  onUpload: (url: string) => void
  className?: string
}

export function ImageUploader({ bucket, currentUrl, onUpload, className }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const maxMb = 5
    if (file.size > maxMb * 1024 * 1024) {
      setError(`File must be under ${maxMb} MB`)
      return
    }

    setError(null)
    setUploading(true)

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onUpload(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className={className}>
      {currentUrl && (
        <div className="mb-2 relative w-32 h-24 rounded overflow-hidden border border-neutral-200">
          <Image src={currentUrl} alt="preview" fill className="object-cover" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? 'Uploading…' : currentUrl ? 'Replace image' : 'Upload image'}
      </Button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/_components/
git commit -m "feat: add admin ImageUploader component"
```

---

### Task 6: Products CRUD

**Files:**
- Create: `src/app/admin/products/page.tsx`
- Create: `src/app/admin/products/actions.ts`
- Create: `src/app/admin/products/_components/ProductForm.tsx`
- Create: `src/app/admin/products/new/page.tsx`
- Create: `src/app/admin/products/[id]/page.tsx`

- [ ] **Step 1: Create product server actions**

```typescript
// src/app/admin/products/actions.ts
'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ProductInsert, ProductUpdate } from '@/types/database'

export async function createProduct(data: ProductInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { success: true }
}

export async function updateProduct(id: string, data: ProductUpdate) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('products')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/products')
  if (data.slug) revalidatePath(`/products/${data.slug}`)
  return { success: true }
}

export async function deleteProduct(id: string, slug: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath(`/products/${slug}`)
  return { success: true }
}

export async function togglePublished(id: string, current: boolean) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('products')
    .update({ is_published: !current, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/products')
  return { success: true }
}
```

- [ ] **Step 2: Create ProductForm component**

```tsx
// src/app/admin/products/_components/ProductForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, ''])}>
          + Add {label.toLowerCase().replace(/s$/, '')}
        </Button>
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...value, { label: '', value: '' }])}
        >
          + Add spec
        </Button>
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
      {/* Basic info */}
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

      {/* Images */}
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

      {/* Commercial */}
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

      {/* Arrays */}
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

      {/* Flags */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">Visibility</h2>
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} id="published" />
            <Label htmlFor="published">Published</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isFuture} onCheckedChange={setIsFuture} id="future" />
            <Label htmlFor="future">Future Product (name only)</Label>
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : product ? 'Save changes' : 'Create product'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Create products list page**

```tsx
// src/app/admin/products/page.tsx
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
                        onClick={(e) => { if (!confirm(`Delete ${p.name}?`)) e.preventDefault() }}
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
```

- [ ] **Step 4: Create new product page**

```tsx
// src/app/admin/products/new/page.tsx
import { ProductForm } from '../_components/ProductForm'

export default function NewProductPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Product</h1>
      <ProductForm />
    </div>
  )
}
```

- [ ] **Step 5: Create edit product page**

```tsx
// src/app/admin/products/[id]/page.tsx
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ProductForm } from '../_components/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Edit: {product.name}</h1>
      <ProductForm product={product} />
    </div>
  )
}
```

- [ ] **Step 6: Test products CRUD**

```bash
npm run dev
```

Verify:
1. `/admin/products` lists all seeded products ordered by display_order
2. Click "New Product" — form loads, fill fields, save — product appears in list
3. Click "Edit" on a product — form loads with current values, update, save — changes persist
4. Click "Delete" — product removed from list
5. Click "Publish/Unpublish" — badge updates

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/products/
git commit -m "feat: add admin products CRUD (list, create, edit, delete)"
```

---

### Task 7: Leads management

**Files:**
- Create: `src/app/admin/leads/page.tsx`
- Create: `src/app/admin/leads/actions.ts`

- [ ] **Step 1: Create lead actions**

```typescript
// src/app/admin/leads/actions.ts
'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateLeadStatus(id: string, status: 'new' | 'contacted' | 'closed') {
  const supabase = createAdminClient()
  const { error } = await supabase.from('leads').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/leads')
  return { success: true }
}
```

- [ ] **Step 2: Create leads page**

```tsx
// src/app/admin/leads/page.tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { updateLeadStatus } from './actions'

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-green-100 text-green-800',
} as const

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = createAdminClient()

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (status && ['new', 'contacted', 'closed'].includes(status)) {
    query = query.eq('status', status)
  }

  const { data: leads } = await query

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Leads</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[undefined, 'new', 'contacted', 'closed'].map((s) => (
          <a
            key={s ?? 'all'}
            href={s ? `/admin/leads?status=${s}` : '/admin/leads'}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              status === s || (!status && !s)
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {s ?? 'All'}
          </a>
        ))}
      </div>

      <div className="space-y-3">
        {leads?.map((lead) => (
          <div key={lead.id} className="bg-white border border-neutral-200 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-neutral-900">{lead.full_name}</span>
                  {lead.company && <span className="text-sm text-neutral-500">· {lead.company}</span>}
                  <Badge className={`text-xs ${STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS]}`}>
                    {lead.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1 text-sm text-neutral-600 mb-2">
                  <span><span className="text-neutral-400">Country:</span> {lead.country}</span>
                  <span><span className="text-neutral-400">Product:</span> {lead.product_required}</span>
                  {lead.quantity && <span><span className="text-neutral-400">Qty:</span> {lead.quantity}</span>}
                  <span><span className="text-neutral-400">Email:</span> {lead.email}</span>
                  {lead.whatsapp && <span><span className="text-neutral-400">WA:</span> {lead.whatsapp}</span>}
                  {lead.source && <span><span className="text-neutral-400">From:</span> {lead.source}</span>}
                </div>
                {lead.message && (
                  <p className="text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded">{lead.message}</p>
                )}
                <p className="text-xs text-neutral-400 mt-2">
                  {new Date(lead.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {(['new', 'contacted', 'closed'] as const).map((s) => (
                  <form key={s} action={updateLeadStatus.bind(null, lead.id, s)}>
                    <Button
                      variant={lead.status === s ? 'default' : 'outline'}
                      size="sm"
                      type="submit"
                      className="w-full text-xs"
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  </form>
                ))}
              </div>
            </div>
          </div>
        ))}
        {!leads?.length && (
          <p className="text-neutral-400 text-center py-12">No leads {status ? `with status "${status}"` : 'yet'}.</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/leads/
git commit -m "feat: add admin leads page with status filter and status update"
```

---

### Task 8: News / Blog

**Files:**
- Create: `src/app/admin/news/page.tsx`
- Create: `src/app/admin/news/actions.ts`
- Create: `src/app/admin/news/_components/NewsForm.tsx`
- Create: `src/app/admin/news/new/page.tsx`
- Create: `src/app/admin/news/[id]/page.tsx`

- [ ] **Step 1: Create news server actions**

```typescript
// src/app/admin/news/actions.ts
'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { NewsInsert, NewsUpdate } from '@/types/database'

export async function createPost(data: NewsInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('news').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/news')
  revalidatePath('/news')
  return { success: true }
}

export async function updatePost(id: string, data: NewsUpdate) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('news')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/news')
  revalidatePath('/news')
  if (data.slug) revalidatePath(`/news/${data.slug}`)
  return { success: true }
}

export async function deletePost(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/news')
  revalidatePath('/news')
  return { success: true }
}
```

- [ ] **Step 2: Create NewsForm component**

```tsx
// src/app/admin/news/_components/NewsForm.tsx
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
```

- [ ] **Step 3: Create news list page**

```tsx
// src/app/admin/news/page.tsx
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
                        onClick={(e) => { if (!confirm(`Delete "${p.title}"?`)) e.preventDefault() }}
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
```

- [ ] **Step 4: Create new and edit news pages**

```tsx
// src/app/admin/news/new/page.tsx
import { NewsForm } from '../_components/NewsForm'

export default function NewPostPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">New Post</h1>
      <NewsForm />
    </div>
  )
}
```

```tsx
// src/app/admin/news/[id]/page.tsx
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
```

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/news/
git commit -m "feat: add admin news CRUD with markdown editor"
```

---

### Task 9: Certifications management

**Files:**
- Create: `src/app/admin/certifications/page.tsx`
- Create: `src/app/admin/certifications/actions.ts`

- [ ] **Step 1: Create certifications actions**

```typescript
// src/app/admin/certifications/actions.ts
'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { CertificationInsert } from '@/types/database'

export async function createCertification(data: CertificationInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('certifications').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/certifications')
  revalidatePath('/certifications')
  return { success: true }
}

export async function updateCertification(id: string, data: Partial<CertificationInsert>) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('certifications').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/certifications')
  revalidatePath('/certifications')
  return { success: true }
}

export async function deleteCertification(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/certifications')
  revalidatePath('/certifications')
  return { success: true }
}
```

- [ ] **Step 2: Create certifications page (inline add/edit)**

```tsx
// src/app/admin/certifications/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ImageUploader } from '../_components/ImageUploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createCertification, deleteCertification } from './actions'
import type { Certification } from '@/types/database'
import { createAdminClient } from '@/lib/supabase/admin'
```

Wait — this page needs to be a Server Component to fetch data, but also has a client form. Split it: Server Component for the page, Client Component for the add form.

```tsx
// src/app/admin/certifications/page.tsx
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteCertification } from './actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { AddCertificationForm } from './_components/AddCertificationForm'

export default async function AdminCertificationsPage() {
  const supabase = createAdminClient()
  const { data: certs } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Certifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* List */}
        <div className="space-y-3">
          {certs?.map((cert) => (
            <div key={cert.id} className="bg-white border border-neutral-200 rounded-lg p-4 flex gap-4 items-start">
              {cert.logo_url && (
                <div className="relative w-16 h-12 shrink-0">
                  <Image src={cert.logo_url} alt={cert.name} fill className="object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-800">{cert.name}</p>
                {cert.description && <p className="text-sm text-neutral-500 mt-0.5">{cert.description}</p>}
                <p className="text-xs text-neutral-400 mt-1">Order: {cert.display_order}</p>
              </div>
              <form action={deleteCertification.bind(null, cert.id)}>
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  className="text-red-500 hover:text-red-700 shrink-0"
                  onClick={(e) => { if (!confirm(`Delete "${cert.name}"?`)) e.preventDefault() }}
                >
                  Delete
                </Button>
              </form>
            </div>
          ))}
          {!certs?.length && <p className="text-neutral-400 text-sm">No certifications yet.</p>}
        </div>

        {/* Add form */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Add Certification</h2>
          <AddCertificationForm />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create AddCertificationForm client component**

```tsx
// src/app/admin/certifications/_components/AddCertificationForm.tsx
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
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/certifications/
git commit -m "feat: add admin certifications page"
```

---

### Task 10: Gallery management

**Files:**
- Create: `src/app/admin/gallery/page.tsx`
- Create: `src/app/admin/gallery/actions.ts`
- Create: `src/app/admin/gallery/_components/GalleryUploadForm.tsx`

- [ ] **Step 1: Create gallery actions**

```typescript
// src/app/admin/gallery/actions.ts
'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { GalleryImageInsert } from '@/types/database'

export async function addGalleryImage(data: GalleryImageInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('gallery_images').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}

export async function deleteGalleryImage(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('gallery_images').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  return { success: true }
}
```

- [ ] **Step 2: Create gallery upload form**

```tsx
// src/app/admin/gallery/_components/GalleryUploadForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '../../_components/ImageUploader'
import { addGalleryImage } from '../actions'

const CATEGORIES = ['Warehouse', 'Products', 'Team', 'Export', 'Other']

export function GalleryUploadForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('Products')
  const [displayOrder, setDisplayOrder] = useState(999)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url) { setError('Upload an image first'); return }
    setSaving(true)
    setError(null)
    const result = await addGalleryImage({ url, alt: alt || null, category, display_order: displayOrder })
    if (result.error) { setError(result.error); setSaving(false); return }
    setUrl(''); setAlt(''); setDisplayOrder(999)
    router.refresh()
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label>Image *</Label>
        <ImageUploader bucket="gallery" currentUrl={url || null} onUpload={setUrl} />
      </div>
      <div className="space-y-1">
        <Label>Alt Text</Label>
        <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <Label>Display Order</Label>
          <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}
      <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add to Gallery'}</Button>
    </form>
  )
}
```

- [ ] **Step 3: Create gallery page**

```tsx
// src/app/admin/gallery/page.tsx
import Image from 'next/image'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteGalleryImage } from './actions'
import { Button } from '@/components/ui/button'
import { GalleryUploadForm } from './_components/GalleryUploadForm'

export default async function AdminGalleryPage() {
  const supabase = createAdminClient()
  const { data: images } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Gallery</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            {images?.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-white bg-black/50 px-1.5 py-0.5 rounded">{img.category}</span>
                    <form action={deleteGalleryImage.bind(null, img.id)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="text-white hover:bg-red-500/80 h-6 px-2 text-xs"
                        onClick={(e) => { if (!confirm('Remove this image?')) e.preventDefault() }}
                      >
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
            {!images?.length && (
              <p className="col-span-3 text-neutral-400 text-sm text-center py-12">No images yet.</p>
            )}
          </div>
        </div>

        {/* Upload form */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Upload Image</h2>
          <GalleryUploadForm />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify full admin flow end-to-end**

```bash
npm run dev
```

Walk through each section:
1. `/admin/products` — list, create, edit, delete
2. `/admin/leads` — view empty state (test by submitting the inquiry form)
3. `/admin/news` — create a post, publish it
4. `/admin/certifications` — add a cert with logo
5. `/admin/gallery` — upload an image

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/gallery/
git commit -m "feat: add admin gallery page with image upload"
```

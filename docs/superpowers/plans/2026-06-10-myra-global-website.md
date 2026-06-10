# Myra Global Exports — Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional, SEO-optimised agricultural export website for Myra Global with public pages, a self-service admin CMS, inquiry forms with email/WhatsApp notifications, multi-language support, media gallery, and Google Analytics integration.

**Architecture:** Next.js 15 App Router with Payload CMS v3 co-located for the admin panel; Neon (serverless PostgreSQL) as the database; Cloudinary for image/video hosting; Resend for transactional email; next-intl for 9-language i18n. All public routes live under `src/app/(frontend)/`; all admin routes live under `src/app/(payload)/`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v3, Payload CMS v3, `@payloadcms/db-postgres`, Neon (PostgreSQL), Cloudinary, Resend, next-intl, React Hook Form, Zod, shadcn/ui, Vitest + React Testing Library

---

## Subsystem Note

This spec covers 6 largely independent subsystems. If timeline pressure exists, implement in this order — each phase ships working software on its own:

1. **This plan (Phase 1–3):** Foundation + all public pages + admin CMS
2. **Phase 4:** Forms, email/WhatsApp notifications, inquiry management
3. **Phase 5:** Multi-language (next-intl, 9 locales)
4. **Phase 6:** SEO, Google Analytics, Search Console, sitemaps

Phases 4–6 can be written as separate plan documents after Phase 1–3 is deployed.

---

## File Structure

```
myra-global-exports/
├── src/
│   ├── app/
│   │   ├── (frontend)/                   # All public-facing routes
│   │   │   ├── layout.tsx                # Root layout (Header, Footer, WhatsApp btn)
│   │   │   ├── page.tsx                  # Home page
│   │   │   ├── about/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx              # Products listing
│   │   │   │   └── [slug]/page.tsx       # Single product detail
│   │   │   ├── certifications/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── get-quote/page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── partners/page.tsx
│   │   │   ├── news/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── privacy-policy/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── (payload)/
│   │   │   └── admin/[[...segments]]/
│   │   │       ├── page.tsx              # Payload admin UI
│   │   │       └── not-found.tsx
│   │   └── api/
│   │       ├── inquiry/route.ts          # POST: submit inquiry, send email+WA
│   │       └── [...payload]/route.ts     # Payload REST + GraphQL passthrough
│   ├── collections/                      # Payload CMS collection definitions
│   │   ├── Products.ts
│   │   ├── Certificates.ts
│   │   ├── Gallery.ts
│   │   ├── Partners.ts
│   │   ├── Testimonials.ts
│   │   ├── News.ts
│   │   ├── Inquiries.ts
│   │   ├── SiteSettings.ts               # Global singleton: hide/unhide flags
│   │   └── Media.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── ProductsSection.tsx
│   │   │   ├── CertificationsSection.tsx
│   │   │   ├── ExportMarkets.tsx
│   │   │   ├── InquirySection.tsx
│   │   │   └── ContactInfoSection.tsx
│   │   ├── shared/
│   │   │   ├── WhatsAppButton.tsx        # Fixed bottom-right FAB
│   │   │   ├── SocialLinks.tsx
│   │   │   ├── SectionWrapper.tsx        # Handles hide/unhide via siteSettings
│   │   │   └── PDFDownloadButton.tsx
│   │   └── forms/
│   │       ├── InquiryForm.tsx
│   │       └── ContactForm.tsx
│   ├── lib/
│   │   ├── payload.ts                    # getPayload() singleton helper
│   │   ├── email.ts                      # sendInquiryEmail() via Resend
│   │   ├── whatsapp.ts                   # sendWhatsAppAlert() via Twilio/WABA
│   │   └── cloudinary.ts                 # upload helper
│   ├── payload.config.ts                 # Payload CMS root config
│   └── i18n/
│       ├── routing.ts                    # next-intl locale config
│       └── messages/
│           ├── en.json
│           ├── hi.json
│           ├── mr.json
│           ├── ar.json
│           ├── fr.json
│           ├── es.json
│           ├── de.json
│           ├── ru.json
│           └── zh.json
├── public/
│   ├── company-profile.pdf
│   ├── product-catalogue.pdf
│   └── images/
│       └── logo.png
├── tests/
│   ├── api/
│   │   └── inquiry.test.ts
│   └── lib/
│       ├── email.test.ts
│       └── whatsapp.test.ts
├── payload.config.ts                     # (symlink or re-export from src/)
├── next.config.ts
├── tailwind.config.ts
└── vitest.config.ts
```

**Color palette (used throughout):**
- Primary green: `#1B5E20`
- Accent gold: `#F9A825`
- Background: `#FFFFFF`
- Text: `#212121`
- Tailwind custom tokens in `tailwind.config.ts`: `brand-green`, `brand-gold`

---

## Task 1: Project Initialisation

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `vitest.config.ts`
- Create: `src/payload.config.ts`
- Create: `.env.local`

- [ ] **Step 1.1: Bootstrap Next.js + Payload CMS v3**

```bash
cd "E:\Siddhant\Projects\ai-projects\MyraGlobalExports"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
npm install payload @payloadcms/next @payloadcms/richtext-lexical @payloadcms/db-postgres @payloadcms/storage-cloudinary
npm install @neondatabase/serverless
npm install resend
npm install next-intl
npm install react-hook-form @hookform/resolvers zod
npm install sharp
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 1.2: Create `.env.local`**

```ini
# Database
DATABASE_URI=postgresql://neondb_owner:<password>@<host>.neon.tech/neondb?sslmode=require

# Payload
PAYLOAD_SECRET=<generate-with: openssl rand -hex 32>

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend (email)
RESEND_API_KEY=
INQUIRY_NOTIFICATION_EMAIL=info@myraglobalexports.com

# WhatsApp (Twilio or CallMeBot — see Task 14)
WHATSAPP_NOTIFY_NUMBER=+91XXXXXXXXXX

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Sign up at neon.tech (free tier), create a project "myra-global", copy the connection string.

- [ ] **Step 1.3: Configure `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-green': {
          DEFAULT: '#1B5E20',
          light: '#2E7D32',
          dark: '#003300',
        },
        'brand-gold': {
          DEFAULT: '#F9A825',
          light: '#FFCA28',
          dark: '#E65100',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 1.4: Configure `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 1.5: Create `tests/setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 1.6: Configure `next.config.ts`**

```typescript
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

export default withPayload(nextConfig)
```

- [ ] **Step 1.7: Run dev server to confirm startup**

```bash
npm run dev
```
Expected: Server starts at `http://localhost:3000`. No TypeScript errors.

- [ ] **Step 1.8: Commit**

```bash
git init
git add .
git commit -m "chore: initialise Next.js 15 + Payload CMS v3 project"
```

---

## Task 2: Payload CMS Collections

**Files:**
- Create: `src/collections/Media.ts`
- Create: `src/collections/Products.ts`
- Create: `src/collections/Certificates.ts`
- Create: `src/collections/Gallery.ts`
- Create: `src/collections/Partners.ts`
- Create: `src/collections/Testimonials.ts`
- Create: `src/collections/News.ts`
- Create: `src/collections/Inquiries.ts`
- Create: `src/collections/SiteSettings.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 2.1: Create `src/collections/Media.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  fields: [
    { name: 'alt', type: 'text', required: false },
    { name: 'caption', type: 'text', required: false },
  ],
}
```

- [ ] **Step 2.2: Create `src/collections/Products.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'visible', 'updatedAt'] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'category', type: 'text', required: true, defaultValue: 'Agricultural' },
    { name: 'description', type: 'richText' },
    { name: 'shortDescription', type: 'textarea' },
    {
      name: 'images',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'specifications', type: 'richText' },
    { name: 'packagingInfo', type: 'textarea' },
    { name: 'visible', type: 'checkbox', defaultValue: true, admin: { description: 'Uncheck to hide from website' } },
    { name: 'featuredOnHome', type: 'checkbox', defaultValue: false },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
  timestamps: true,
}
```

- [ ] **Step 2.3: Create `src/collections/Certificates.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'certificateNumber', type: 'text' },
    { name: 'issueDate', type: 'date' },
    { name: 'expiryDate', type: 'date' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'pdf', type: 'upload', relationTo: 'media' },
    { name: 'visible', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 2.4: Create `src/collections/Gallery.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Business Activities', value: 'business' },
        { label: 'Export Shipments', value: 'shipment' },
        { label: 'Team & Meetings', value: 'team' },
        { label: 'Suppliers & Partners', value: 'partners' },
        { label: 'Certificates', value: 'certificates' },
        { label: 'Trade Fair / Exhibition', value: 'exhibition' },
        { label: 'Factory / Warehouse', value: 'factory' },
      ],
    },
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    { name: 'mediaType', type: 'select', options: ['image', 'video'], defaultValue: 'image' },
    { name: 'visible', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 2.5: Create `src/collections/Partners.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Supplier', value: 'supplier' },
        { label: 'Buyer', value: 'buyer' },
        { label: 'Partner', value: 'partner' },
        { label: 'Future Partner', value: 'future' },
      ],
    },
    { name: 'country', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'visible', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```

- [ ] **Step 2.6: Create `src/collections/Testimonials.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'clientName' },
  fields: [
    { name: 'clientName', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'content', type: 'textarea', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'type',
      type: 'select',
      options: ['buyer', 'supplier'],
      defaultValue: 'buyer',
    },
    { name: 'visible', type: 'checkbox', defaultValue: true },
    { name: 'featuredOnHome', type: 'checkbox', defaultValue: false },
  ],
}
```

- [ ] **Step 2.7: Create `src/collections/News.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'visible', 'publishedAt'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Company News', value: 'company' },
        { label: 'New Products', value: 'products' },
        { label: 'Export Updates', value: 'export' },
        { label: 'Trade Fair / Exhibition', value: 'exhibition' },
        { label: 'Announcements', value: 'announcements' },
      ],
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedAt', type: 'date' },
    { name: 'visible', type: 'checkbox', defaultValue: true },
  ],
  timestamps: true,
}
```

- [ ] **Step 2.8: Create `src/collections/Inquiries.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'company', 'country', 'productRequired', 'createdAt'],
    disableDuplicate: true,
  },
  access: { create: () => true },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'country', type: 'text', required: true },
    { name: 'productRequired', type: 'text', required: true },
    { name: 'quantity', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'whatsapp', type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
      defaultValue: 'new',
    },
    { name: 'notes', type: 'textarea', admin: { description: 'Internal notes' } },
  ],
  timestamps: true,
}
```

- [ ] **Step 2.9: Create `src/collections/SiteSettings.ts` (Global singleton for hide/unhide)**

```typescript
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  fields: [
    {
      name: 'sections',
      type: 'group',
      label: 'Show/Hide Website Sections',
      fields: [
        { name: 'showProducts', type: 'checkbox', defaultValue: true, label: 'Products Section' },
        { name: 'showCertificates', type: 'checkbox', defaultValue: true, label: 'Certificates Section' },
        { name: 'showPartners', type: 'checkbox', defaultValue: true, label: 'Partners & Suppliers Section' },
        { name: 'showGallery', type: 'checkbox', defaultValue: true, label: 'Gallery Section' },
        { name: 'showTeam', type: 'checkbox', defaultValue: true, label: 'Team Section' },
        { name: 'showTestimonials', type: 'checkbox', defaultValue: true, label: 'Testimonials Section' },
        { name: 'showNews', type: 'checkbox', defaultValue: true, label: 'News & Updates Section' },
        { name: 'showSocialMedia', type: 'checkbox', defaultValue: true, label: 'Social Media Links' },
        { name: 'showExportMarkets', type: 'checkbox', defaultValue: true, label: 'Export Markets Section' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        { name: 'phone', type: 'text', defaultValue: '+91 XXXXXXXXXX' },
        { name: 'whatsapp', type: 'text', defaultValue: '+91 XXXXXXXXXX' },
        { name: 'email', type: 'email', defaultValue: 'info@myraglobalexports.com' },
        { name: 'salesEmail', type: 'email', defaultValue: 'sales@myraglobalexports.com' },
        { name: 'address', type: 'textarea' },
        { name: 'businessHours', type: 'textarea', defaultValue: 'Monday–Saturday: 9:00 AM – 6:00 PM IST' },
        { name: 'googleMapsEmbedUrl', type: 'text' },
        { name: 'showContactInfo', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        { name: 'whatsapp', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'downloads',
      type: 'group',
      label: 'Downloadable Files',
      fields: [
        { name: 'companyProfile', type: 'upload', relationTo: 'media' },
        { name: 'productCatalogue', type: 'upload', relationTo: 'media' },
        { name: 'productBrochure', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

- [ ] **Step 2.10: Create `src/payload.config.ts`**

```typescript
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { cloudinaryStorage } from '@payloadcms/storage-cloudinary'
import path from 'path'
import { fileURLToPath } from 'url'

import { Products } from './collections/Products'
import { Certificates } from './collections/Certificates'
import { Gallery } from './collections/Gallery'
import { Partners } from './collections/Partners'
import { Testimonials } from './collections/Testimonials'
import { News } from './collections/News'
import { Inquiries } from './collections/Inquiries'
import { Media } from './collections/Media'
import { SiteSettings } from './collections/SiteSettings'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Myra Global Admin',
    },
  },
  collections: [Products, Certificates, Gallery, Partners, Testimonials, News, Inquiries, Media],
  globals: [SiteSettings],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI ?? '' } }),
  plugins: [
    cloudinaryStorage({
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
        api_key: process.env.CLOUDINARY_API_KEY ?? '',
        api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
      },
      collections: { media: true },
    }),
  ],
})
```

- [ ] **Step 2.11: Create `src/collections/Users.ts`**

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'role', type: 'select', options: ['admin', 'editor'], defaultValue: 'editor' },
  ],
}
```

- [ ] **Step 2.12: Run dev and verify Payload admin loads**

```bash
npm run dev
```
Open `http://localhost:3000/admin` — expected: Payload CMS first-run screen to create admin user.

- [ ] **Step 2.13: Commit**

```bash
git add src/collections src/payload.config.ts src/app/\(payload\)
git commit -m "feat: add Payload CMS collections and admin panel"
```

---

## Task 3: Global Layout — Header, Footer, Navigation

**Files:**
- Create: `src/app/(frontend)/layout.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/MobileNav.tsx`
- Create: `src/components/shared/WhatsAppButton.tsx`
- Create: `src/components/shared/SocialLinks.tsx`
- Create: `src/lib/payload.ts`

- [ ] **Step 3.1: Create `src/lib/payload.ts` (singleton helper)**

```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (cached) return cached
  cached = await getPayload({ config })
  return cached
}
```

- [ ] **Step 3.2: Create `src/components/shared/SocialLinks.tsx`**

```tsx
import { FaWhatsapp, FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa'
import type { SiteSettings } from '@/payload-types'

type Props = {
  social: SiteSettings['social']
  className?: string
  iconSize?: number
}

export function SocialLinks({ social, className = '', iconSize = 20 }: Props) {
  const links = [
    { href: social?.whatsapp, Icon: FaWhatsapp, label: 'WhatsApp', color: '#25D366' },
    { href: social?.instagram, Icon: FaInstagram, label: 'Instagram', color: '#E1306C' },
    { href: social?.facebook, Icon: FaFacebook, label: 'Facebook', color: '#1877F2' },
    { href: social?.linkedin, Icon: FaLinkedin, label: 'LinkedIn', color: '#0A66C2' },
    { href: social?.youtube, Icon: FaYoutube, label: 'YouTube', color: '#FF0000' },
  ].filter((l) => l.href)

  return (
    <div className={`flex gap-3 ${className}`}>
      {links.map(({ href, Icon, label, color }) => (
        <a
          key={label}
          href={href!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="transition-transform hover:scale-110"
          style={{ color }}
        >
          <Icon size={iconSize} />
        </a>
      ))}
    </div>
  )
}
```

> Install react-icons: `npm install react-icons`

- [ ] **Step 3.3: Create `src/components/shared/WhatsAppButton.tsx`**

```tsx
import { FaWhatsapp } from 'react-icons/fa'

type Props = { phone: string }

export function WhatsAppButton({ phone }: Props) {
  const clean = phone.replace(/\D/g, '')
  return (
    <a
      href={`https://wa.me/${clean}?text=Hello%2C%20I%20am%20interested%20in%20your%20products.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
    >
      <FaWhatsapp size={28} color="white" />
    </a>
  )
}
```

- [ ] **Step 3.4: Create `src/components/layout/Header.tsx`**

```tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Products' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/partners', label: 'Partners' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact Us' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="Myra Global Exports" width={50} height={50} className="h-12 w-auto" />
          <div>
            <p className="text-xl font-bold text-brand-green">Myra Global</p>
            <p className="text-xs text-gray-500">Connecting the World. Empowering Futures.</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-green"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/get-quote"
            className="rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-light"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 pb-4 lg:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block py-2 text-sm font-medium text-gray-700 hover:text-brand-green"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/get-quote"
            className="mt-3 block rounded-full bg-brand-green px-5 py-2 text-center text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  )
}
```

> Install react-icons/fi if not already installed (it's included in react-icons).

- [ ] **Step 3.5: Create `src/components/layout/Footer.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { SocialLinks } from '@/components/shared/SocialLinks'
import type { SiteSettings } from '@/payload-types'

type Props = { settings: SiteSettings }

export function Footer({ settings }: Props) {
  return (
    <footer className="bg-brand-green text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <Image src="/images/logo.png" alt="Myra Global" width={40} height={40} className="h-10 w-auto brightness-0 invert" />
              <p className="text-xl font-bold">Myra Global Exports</p>
            </div>
            <p className="mb-4 text-sm text-green-200">Connecting the World. Empowering Futures.</p>
            {settings.sections?.showSocialMedia && (
              <SocialLinks social={settings.social} className="mt-4" iconSize={22} />
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 font-semibold uppercase tracking-wide text-brand-gold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-green-200">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Products' },
                { href: '/certifications', label: 'Certifications' },
                { href: '/get-quote', label: 'Get a Quote' },
                { href: '/contact', label: 'Contact Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          {settings.sections?.showContactInfo && (
            <div>
              <h3 className="mb-3 font-semibold uppercase tracking-wide text-brand-gold">Contact</h3>
              <ul className="space-y-2 text-sm text-green-200">
                {settings.contact?.phone && <li>📞 {settings.contact.phone}</li>}
                {settings.contact?.email && (
                  <li>✉️ <a href={`mailto:${settings.contact.email}`} className="hover:text-white">{settings.contact.email}</a></li>
                )}
                {settings.contact?.address && <li>📍 {settings.contact.address}</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-green-700 pt-6 text-center text-xs text-green-300">
          <p>&copy; {new Date().getFullYear()} Myra Global Exports. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3.6: Create `src/app/(frontend)/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { getPayloadClient } from '@/lib/payload'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: { default: 'Myra Global Exports', template: '%s | Myra Global Exports' },
  description: 'Premium agricultural export company. Connecting the World. Empowering Futures.',
  keywords: ['agricultural exports', 'India export', 'Myra Global', 'food export'],
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        {settings.contact?.whatsapp && <WhatsAppButton phone={settings.contact.whatsapp} />}
      </body>
    </html>
  )
}
```

- [ ] **Step 3.7: Verify layout renders**

```bash
npm run dev
```
Open `http://localhost:3000` — expected: Header with Myra Global logo/nav and green footer render. No TypeScript errors.

- [ ] **Step 3.8: Commit**

```bash
git add src/components src/app/\(frontend\)/layout.tsx src/lib/payload.ts
git commit -m "feat: add global layout, header, footer, WhatsApp button"
```

---

## Task 4: Home Page

**Files:**
- Create: `src/app/(frontend)/page.tsx`
- Create: `src/components/home/HeroBanner.tsx`
- Create: `src/components/home/AboutSection.tsx`
- Create: `src/components/home/WhyChooseUs.tsx`
- Create: `src/components/home/ProductsSection.tsx`
- Create: `src/components/home/CertificationsSection.tsx`
- Create: `src/components/home/ExportMarkets.tsx`
- Create: `src/components/home/InquirySection.tsx`
- Create: `src/components/home/ContactInfoSection.tsx`

- [ ] **Step 4.1: Create `src/components/home/HeroBanner.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'

export function HeroBanner() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-brand-green to-brand-green-dark text-white">
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-gold">
          Premium Agricultural Exports from India
        </p>
        <h1 className="mb-4 font-heading text-4xl font-bold leading-tight md:text-6xl">
          Connecting the World.<br />
          <span className="text-brand-gold">Empowering Futures.</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-green-100">
          Myra Global Exports delivers high-quality agricultural products to buyers across the globe.
          Trusted quality. Reliable supply. International standards.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/get-quote"
            className="rounded-full bg-brand-gold px-8 py-3 font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
          >
            Get a Quote
          </Link>
          <Link
            href="/products"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-brand-green"
          >
            View Products
          </Link>
        </div>
      </div>
    </section>
  )
}
```

> Add a placeholder hero image at `public/images/hero-bg.jpg` (any green agricultural stock image).

- [ ] **Step 4.2: Create `src/components/home/WhyChooseUs.tsx`**

```tsx
const REASONS = [
  { icon: '🌾', title: 'Premium Quality', desc: 'Strictly selected produce meeting international food safety standards.' },
  { icon: '🚢', title: 'Global Reach', desc: 'Export to 30+ countries across Asia, Middle East, Europe, and Africa.' },
  { icon: '📜', title: 'Certified & Compliant', desc: 'GST, IEC, APEDA, and FSSAI certified operations.' },
  { icon: '⏱️', title: 'On-Time Delivery', desc: 'Reliable logistics partners ensuring timely shipments worldwide.' },
  { icon: '💬', title: 'Dedicated Support', desc: 'Responsive team for every step from inquiry to delivery.' },
  { icon: '📦', title: 'Custom Packaging', desc: 'Flexible packaging options tailored to buyer requirements.' },
]

export function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-brand-green">Why Choose Myra Global?</h2>
        <p className="mb-10 text-center text-gray-500">Your trusted partner for agricultural exports from India</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon, title, desc }) => (
            <div key={title} className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-3 text-3xl">{icon}</div>
              <h3 className="mb-2 font-semibold text-brand-green">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4.3: Create `src/components/home/ExportMarkets.tsx`**

```tsx
const COUNTRIES = [
  { flag: '🇦🇪', name: 'UAE' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇨🇳', name: 'China' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇧🇩', name: 'Bangladesh' },
  { flag: '🇲🇾', name: 'Malaysia' },
  { flag: '🇮🇩', name: 'Indonesia' },
  { flag: '🇸🇬', name: 'Singapore' },
  { flag: '🇿🇦', name: 'South Africa' },
]

export function ExportMarkets() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-brand-green">Our Export Markets</h2>
        <p className="mb-10 text-center text-gray-500">Trusted by buyers across 30+ countries</p>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {COUNTRIES.map(({ flag, name }) => (
            <div key={name} className="flex flex-col items-center rounded-lg border p-4 text-center transition-shadow hover:shadow-md">
              <span className="mb-2 text-3xl">{flag}</span>
              <span className="text-xs font-medium text-gray-700">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4.4: Create `src/components/home/ProductsSection.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/payload-types'

type Props = { products: Product[] }

export function ProductsSection({ products }: Props) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-brand-green">Our Products</h2>
        <p className="mb-10 text-center text-gray-500">Premium agricultural commodities sourced from India's finest farms</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const img = typeof product.images?.[0]?.image === 'object' ? product.images[0].image : null
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden"
              >
                <div className="relative h-48 bg-gray-100">
                  {img?.url && (
                    <Image src={img.url} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.shortDescription}</p>
                  <span className="mt-3 inline-block text-xs font-medium text-brand-green">View Details →</span>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-8 text-center">
          <Link href="/products" className="rounded-full border-2 border-brand-green px-8 py-3 font-semibold text-brand-green hover:bg-brand-green hover:text-white transition-colors">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4.5: Create `src/components/home/CertificationsSection.tsx`**

```tsx
import Image from 'next/image'
import type { Certificate } from '@/payload-types'

type Props = { certificates: Certificate[] }

export function CertificationsSection({ certificates }: Props) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-brand-green">Certifications</h2>
        <p className="mb-10 text-center text-gray-500">Compliant with international quality and food safety standards</p>
        <div className="flex flex-wrap justify-center gap-6">
          {certificates.map((cert) => {
            const img = typeof cert.image === 'object' ? cert.image : null
            return (
              <div key={cert.id} className="flex flex-col items-center rounded-xl border p-6 text-center w-40 shadow-sm">
                {img?.url && (
                  <Image src={img.url} alt={cert.title} width={80} height={80} className="mb-3 object-contain" />
                )}
                <p className="text-xs font-semibold text-gray-700">{cert.title}</p>
                {cert.certificateNumber && (
                  <p className="mt-1 text-xs text-gray-400">{cert.certificateNumber}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4.6: Create `src/components/home/AboutSection.tsx`**

```tsx
import Link from 'next/link'

export function AboutSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-gold">About Myra Global</p>
            <h2 className="mb-4 font-heading text-3xl font-bold text-brand-green">
              Your Trusted Partner for Premium Agricultural Exports
            </h2>
            <p className="mb-4 text-gray-600">
              Myra Global Exports is an emerging agricultural export company based in India, dedicated to delivering
              high-quality agri-commodities to international buyers. We bridge the gap between India's rich
              agricultural heritage and the world's growing demand for quality produce.
            </p>
            <p className="mb-6 text-gray-600">
              We work directly with farmers and suppliers to ensure freshness, quality, and consistency.
              Our team handles everything from sourcing and quality inspection to packaging, documentation,
              and timely delivery.
            </p>
            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              {[
                { value: '30+', label: 'Countries Served' },
                { value: '50+', label: 'Products' },
                { value: '100%', label: 'Quality Assured' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-lg bg-brand-green/5 p-4">
                  <p className="text-2xl font-bold text-brand-green">{value}</p>
                  <p className="text-xs text-gray-600">{label}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-light transition-colors">
              Learn More About Us
            </Link>
          </div>
          <div className="relative h-80 overflow-hidden rounded-2xl bg-brand-green/10 lg:h-96">
            <div className="flex h-full items-center justify-center text-6xl">🌾</div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4.7: Create `src/components/home/InquirySection.tsx`**

```tsx
import Link from 'next/link'

export function InquirySection() {
  return (
    <section className="bg-brand-green py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-3 font-heading text-3xl font-bold">Ready to Place an Order?</h2>
        <p className="mb-8 text-green-100">
          Fill out our inquiry form and our export specialists will get back to you within 24 hours.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/get-quote"
            className="rounded-full bg-brand-gold px-8 py-3 font-semibold text-gray-900 hover:bg-brand-gold-light transition-colors"
          >
            Get a Quote
          </Link>
          <Link
            href="/contact"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white hover:text-brand-green transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4.8: Create `src/components/home/ContactInfoSection.tsx`**

```tsx
type Props = {
  contact: {
    phone?: string | null
    whatsapp?: string | null
    email?: string | null
    salesEmail?: string | null
    address?: string | null
    businessHours?: string | null
  }
}

export function ContactInfoSection({ contact }: Props) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-brand-green">Get in Touch</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '📞', label: 'Phone', value: contact.phone },
            { icon: '💬', label: 'WhatsApp', value: contact.whatsapp },
            { icon: '✉️', label: 'Email', value: contact.email },
            { icon: '🕐', label: 'Business Hours', value: contact.businessHours },
          ]
            .filter((i) => i.value)
            .map(({ icon, label, value }) => (
              <div key={label} className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mb-2 text-3xl">{icon}</div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4.9: Create `src/app/(frontend)/page.tsx`**

```tsx
import { getPayloadClient } from '@/lib/payload'
import { HeroBanner } from '@/components/home/HeroBanner'
import { AboutSection } from '@/components/home/AboutSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ProductsSection } from '@/components/home/ProductsSection'
import { CertificationsSection } from '@/components/home/CertificationsSection'
import { ExportMarkets } from '@/components/home/ExportMarkets'
import { InquirySection } from '@/components/home/InquirySection'
import { ContactInfoSection } from '@/components/home/ContactInfoSection'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [productsResult, certsResult, settings] = await Promise.all([
    payload.find({ collection: 'products', where: { and: [{ visible: { equals: true } }, { featuredOnHome: { equals: true } }] }, limit: 8, sort: 'sortOrder' }),
    payload.find({ collection: 'certificates', where: { visible: { equals: true } }, sort: 'sortOrder' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  return (
    <>
      <HeroBanner />
      <AboutSection />
      <WhyChooseUs />
      {settings.sections?.showProducts && <ProductsSection products={productsResult.docs} />}
      {settings.sections?.showCertificates && <CertificationsSection certificates={certsResult.docs} />}
      {settings.sections?.showExportMarkets && <ExportMarkets />}
      <InquirySection />
      {settings.sections?.showContactInfo && <ContactInfoSection contact={settings.contact ?? {}} />}
    </>
  )
}
```

- [ ] **Step 4.10: Verify home page renders**

```bash
npm run dev
```
Open `http://localhost:3000` — expected: Full home page with Hero, About, Why Choose Us, Export Markets, Inquiry CTA sections. No errors in console.

- [ ] **Step 4.11: Commit**

```bash
git add src/app/\(frontend\)/page.tsx src/components/home
git commit -m "feat: add home page with all 8 sections"
```

---

## Task 5: About Us, Products, Certifications Pages

**Files:**
- Create: `src/app/(frontend)/about/page.tsx`
- Create: `src/app/(frontend)/products/page.tsx`
- Create: `src/app/(frontend)/products/[slug]/page.tsx`
- Create: `src/app/(frontend)/certifications/page.tsx`

- [ ] **Step 5.1: Create `src/app/(frontend)/about/page.tsx`**

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Myra Global Exports — our mission, vision, and commitment to quality agricultural exports.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">About Myra Global Exports</h1>
        <p className="text-lg text-gray-500">Connecting the World. Empowering Futures.</p>
      </div>

      <div className="prose prose-lg mx-auto max-w-4xl">
        <h2>Our Story</h2>
        <p>
          Myra Global Exports was founded with a clear purpose — to bring India's finest agricultural produce to
          international markets. We are a dedicated export company committed to quality, transparency, and
          building long-term partnerships with buyers and suppliers across the globe.
        </p>

        <h2>Our Mission</h2>
        <p>
          To deliver premium quality agricultural commodities to international markets while supporting Indian
          farmers and promoting sustainable trade practices.
        </p>

        <h2>Our Vision</h2>
        <p>
          To become a globally recognised name in agricultural exports, known for consistent quality, reliable
          supply chains, and exceptional buyer service.
        </p>

        <h2>Why Work With Us?</h2>
        <ul>
          <li>Direct sourcing from verified Indian farms and suppliers</li>
          <li>Strict quality checks at every stage — farm to shipment</li>
          <li>All regulatory compliances: GST, IEC, APEDA, FSSAI</li>
          <li>Flexible packaging and documentation for all buyer requirements</li>
          <li>Dedicated account manager for every buyer</li>
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 5.2: Create `src/app/(frontend)/products/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse Myra Global Exports\' range of premium agricultural products available for export.',
}

export default async function ProductsPage() {
  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { visible: { equals: true } },
    sort: 'sortOrder',
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Our Products</h1>
        <p className="text-gray-500">Premium agricultural commodities sourced from India's finest farms</p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-400">Products coming soon. Please check back.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const img = typeof product.images?.[0]?.image === 'object' ? product.images[0].image : null
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-xl bg-white shadow-sm border transition-shadow hover:shadow-md overflow-hidden"
              >
                <div className="relative h-48 bg-gray-100">
                  {img?.url && (
                    <Image src={img.url} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">{product.category}</p>
                  <h3 className="mt-1 font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.shortDescription}</p>
                  <span className="mt-3 inline-block text-xs font-medium text-brand-green">View Details →</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <div className="mt-12 rounded-2xl bg-brand-green p-8 text-center text-white">
        <h2 className="mb-2 text-2xl font-bold">Interested in Our Products?</h2>
        <p className="mb-6 text-green-100">Send us an inquiry and get a competitive quote within 24 hours.</p>
        <Link href="/get-quote" className="rounded-full bg-brand-gold px-8 py-3 font-semibold text-gray-900 hover:bg-brand-gold-light transition-colors">
          Request a Quote
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 5.3: Create `src/app/(frontend)/products/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'products', where: { slug: { equals: params.slug } } })
  const product = docs[0]
  if (!product) return { title: 'Product Not Found' }
  return { title: product.name, description: product.shortDescription ?? undefined }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: params.slug } }, { visible: { equals: true } }] },
  })
  const product = docs[0]
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <Link href="/products" className="mb-8 inline-flex items-center text-sm text-brand-green hover:underline">
        ← Back to Products
      </Link>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative h-96 overflow-hidden rounded-2xl bg-gray-100">
          {product.images?.[0] && typeof product.images[0].image === 'object' && product.images[0].image.url && (
            <Image src={product.images[0].image.url} alt={product.name} fill className="object-cover" />
          )}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">{product.category}</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-gray-600">{product.shortDescription}</p>
          <div className="mt-8 flex gap-4">
            <Link href="/get-quote" className="rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-light transition-colors">
              Get a Quote
            </Link>
            <a
              href={`https://wa.me/${''}`}
              className="rounded-full border-2 border-[#25D366] px-6 py-2.5 text-sm font-semibold text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
            >
              WhatsApp Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5.4: Create `src/app/(frontend)/certifications/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Myra Global Exports holds GST, IEC, APEDA and FSSAI certifications ensuring international compliance.',
}

export default async function CertificationsPage() {
  const payload = await getPayloadClient()
  const { docs: certificates } = await payload.find({
    collection: 'certificates',
    where: { visible: { equals: true } },
    sort: 'sortOrder',
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Our Certifications</h1>
        <p className="text-gray-500">Certified, compliant, and trusted for international trade</p>
      </div>

      {certificates.length === 0 ? (
        <p className="text-center text-gray-400">Certification details will be published soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => {
            const img = typeof cert.image === 'object' ? cert.image : null
            const pdf = typeof cert.pdf === 'object' ? cert.pdf : null
            return (
              <div key={cert.id} className="rounded-xl border bg-white p-6 shadow-sm">
                {img?.url && (
                  <Image src={img.url} alt={cert.title} width={120} height={120} className="mb-4 mx-auto object-contain" />
                )}
                <h3 className="text-center font-semibold text-gray-900">{cert.title}</h3>
                {cert.certificateNumber && (
                  <p className="mt-1 text-center text-sm text-gray-500">No: {cert.certificateNumber}</p>
                )}
                {pdf?.url && (
                  <a
                    href={pdf.url}
                    download
                    className="mt-4 block text-center text-xs font-medium text-brand-green hover:underline"
                  >
                    Download Certificate PDF
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5.5: Run and verify all three pages**

```bash
npm run dev
```
Visit `http://localhost:3000/about`, `/products`, `/certifications` — expected: pages render, no 404s, no TypeScript errors.

- [ ] **Step 5.6: Commit**

```bash
git add src/app/\(frontend\)/about src/app/\(frontend\)/products src/app/\(frontend\)/certifications
git commit -m "feat: add about, products, and certifications pages"
```

---

## Task 6: Contact, Get a Quote, Gallery, Partners, News Pages

**Files:**
- Create: `src/app/(frontend)/contact/page.tsx`
- Create: `src/app/(frontend)/get-quote/page.tsx`
- Create: `src/app/(frontend)/gallery/page.tsx`
- Create: `src/app/(frontend)/partners/page.tsx`
- Create: `src/app/(frontend)/news/page.tsx`
- Create: `src/app/(frontend)/news/[slug]/page.tsx`
- Create: `src/app/(frontend)/privacy-policy/page.tsx`
- Create: `src/app/(frontend)/terms/page.tsx`
- Create: `src/components/forms/InquiryForm.tsx`
- Create: `src/components/forms/ContactForm.tsx`
- Create: `src/components/shared/PDFDownloadButton.tsx`

- [ ] **Step 6.1: Create `src/components/shared/PDFDownloadButton.tsx`**

```tsx
type Props = { href: string; label: string; className?: string }

export function PDFDownloadButton({ href, label, className = '' }: Props) {
  return (
    <a
      href={href}
      download
      className={`inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-6 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white ${className}`}
    >
      📄 {label}
    </a>
  )
}
```

- [ ] **Step 6.2: Create `src/components/forms/InquiryForm.tsx`**

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  company: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  productRequired: z.string().min(2, 'Product is required'),
  quantity: z.string().optional(),
  email: z.string().email('Valid email required'),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium',
  'Brazil','Canada','China','Egypt','France','Germany','Ghana','India','Indonesia','Iran',
  'Iraq','Italy','Japan','Jordan','Kenya','Kuwait','Malaysia','Mexico','Morocco','Myanmar',
  'Netherlands','Nigeria','Oman','Pakistan','Philippines','Poland','Qatar','Russia',
  'Saudi Arabia','Singapore','South Africa','South Korea','Spain','Sri Lanka','Sudan',
  'Sweden','Switzerland','Tanzania','Thailand','Turkey','UAE','Uganda','UK','Ukraine',
  'USA','Vietnam','Yemen','Zambia','Zimbabwe',
]

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setError('')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      reset()
    } catch {
      setError('Something went wrong. Please email us directly at info@myraglobalexports.com')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center">
        <div className="mb-3 text-5xl">✅</div>
        <h3 className="text-xl font-bold text-brand-green">Inquiry Received!</h3>
        <p className="mt-2 text-gray-600">We'll get back to you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-brand-green underline">
          Submit another inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
          <input {...register('fullName')} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" placeholder="John Smith" />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Company Name</label>
          <input {...register('company')} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" placeholder="Your Company" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Country *</label>
          <select {...register('country')} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none">
            <option value="">Select Country</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Product Required *</label>
          <input {...register('productRequired')} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" placeholder="e.g. Basmati Rice" />
          {errors.productRequired && <p className="mt-1 text-xs text-red-500">{errors.productRequired.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Quantity Required</label>
          <input {...register('quantity')} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" placeholder="e.g. 10 MT" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email Address *</label>
          <input {...register('email')} type="email" className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" placeholder="you@company.com" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">WhatsApp Number</label>
        <input {...register('whatsapp')} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" placeholder="+1 234 567 8900 (with country code)" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
        <textarea {...register('message')} rows={4} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" placeholder="Any specific requirements, packaging preferences, or questions..." />
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand-green py-3 font-semibold text-white transition-colors hover:bg-brand-green-light disabled:opacity-60"
      >
        {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
```

- [ ] **Step 6.3: Create `src/app/(frontend)/get-quote/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { getPayloadClient } from '@/lib/payload'
import { PDFDownloadButton } from '@/components/shared/PDFDownloadButton'

export const metadata: Metadata = {
  title: 'Get a Quote',
  description: 'Request a competitive export quote from Myra Global Exports.',
}

export default async function GetQuotePage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const profilePdf = typeof settings.downloads?.companyProfile === 'object' ? settings.downloads.companyProfile : null
  const cataloguePdf = typeof settings.downloads?.productCatalogue === 'object' ? settings.downloads.productCatalogue : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Request a Quote</h1>
        <p className="text-gray-500">Fill in the form below and we'll send you a competitive quote within 24 hours.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {profilePdf?.url && <PDFDownloadButton href={profilePdf.url} label="Download Company Profile" />}
          {cataloguePdf?.url && <PDFDownloadButton href={cataloguePdf.url} label="Download Product Catalogue" />}
        </div>
      </div>
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <InquiryForm />
      </div>
    </div>
  )
}
```

- [ ] **Step 6.4: Create `src/components/forms/ContactForm.tsx`**

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Please write at least 10 characters'),
})
type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError('')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, productRequired: data.subject, country: 'N/A (General Contact)' }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      reset()
    } catch {
      setError('Something went wrong. Please email info@myraglobalexports.com directly.')
    }
  }

  if (submitted) return (
    <div className="rounded-2xl bg-green-50 p-6 text-center">
      <p className="text-2xl">✅</p>
      <p className="mt-2 font-semibold text-brand-green">Message sent! We'll be in touch soon.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Your Name *</label>
        <input {...register('name')} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
        <input {...register('email')} type="email" className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Subject *</label>
        <input {...register('subject')} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" />
        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
        <textarea {...register('message')} rows={5} className="w-full rounded-lg border px-4 py-2.5 text-sm focus:border-brand-green focus:outline-none" />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-brand-green py-3 font-semibold text-white disabled:opacity-60">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

- [ ] **Step 6.5: Create `src/app/(frontend)/contact/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Myra Global Exports. We are ready to answer all your questions.',
}

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const c = settings.contact

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Contact Us</h1>
        <p className="text-gray-500">We'd love to hear from you. Reach out any time.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-xl font-bold text-brand-green">Contact Information</h2>
          <div className="space-y-4">
            {c?.phone && (
              <div className="flex gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                  <a href={`tel:${c.phone}`} className="font-medium text-gray-800 hover:text-brand-green">{c.phone}</a>
                </div>
              </div>
            )}
            {c?.whatsapp && (
              <div className="flex gap-4">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">WhatsApp</p>
                  <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 hover:text-brand-green">{c.whatsapp}</a>
                </div>
              </div>
            )}
            {c?.email && (
              <div className="flex gap-4">
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Email</p>
                  <a href={`mailto:${c.email}`} className="font-medium text-gray-800 hover:text-brand-green">{c.email}</a>
                  {c.salesEmail && (
                    <a href={`mailto:${c.salesEmail}`} className="block font-medium text-gray-800 hover:text-brand-green">{c.salesEmail}</a>
                  )}
                </div>
              </div>
            )}
            {c?.address && (
              <div className="flex gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Address</p>
                  <p className="font-medium text-gray-800 whitespace-pre-line">{c.address}</p>
                </div>
              </div>
            )}
            {c?.businessHours && (
              <div className="flex gap-4">
                <span className="text-2xl">🕐</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Business Hours</p>
                  <p className="font-medium text-gray-800 whitespace-pre-line">{c.businessHours}</p>
                </div>
              </div>
            )}
          </div>

          {c?.googleMapsEmbedUrl && (
            <div className="mt-8 overflow-hidden rounded-xl">
              <iframe
                src={c.googleMapsEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Myra Global Exports Location"
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-brand-green">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.6: Create `src/app/(frontend)/gallery/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo and video gallery of Myra Global Exports — business activities, shipments, and team.',
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  business: 'Business Activities',
  shipment: 'Export Shipments',
  team: 'Team & Meetings',
  partners: 'Suppliers & Partners',
  certificates: 'Certificates',
  exhibition: 'Trade Fair',
  factory: 'Factory / Warehouse',
}

export default async function GalleryPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  if (!settings.sections?.showGallery) {
    return <div className="py-32 text-center text-gray-400">Gallery coming soon.</div>
  }

  const { docs: items } = await payload.find({
    collection: 'gallery',
    where: { visible: { equals: true } },
    sort: 'sortOrder',
    limit: 200,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Gallery</h1>
        <p className="text-gray-500">A glimpse into our operations, partnerships, and achievements</p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-400">Gallery photos coming soon.</p>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {items.map((item) => {
            const media = typeof item.media === 'object' ? item.media : null
            if (!media?.url) return null
            return (
              <div key={item.id} className="mb-4 break-inside-avoid overflow-hidden rounded-xl">
                <Image
                  src={media.url}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full object-cover"
                />
                {item.caption && (
                  <p className="bg-gray-50 px-3 py-2 text-xs text-gray-600">{item.caption}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6.7: Create `src/app/(frontend)/partners/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Partners & Suppliers',
  description: 'Our trusted network of suppliers, partners, and buyers.',
}

export default async function PartnersPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  if (!settings.sections?.showPartners) {
    return <div className="py-32 text-center text-gray-400">Partners section coming soon.</div>
  }

  const { docs: partners } = await payload.find({
    collection: 'partners',
    where: { visible: { equals: true } },
    sort: 'sortOrder',
    limit: 200,
  })

  const suppliers = partners.filter((p) => p.type === 'supplier')
  const buyers = partners.filter((p) => p.type === 'buyer')
  const otherPartners = partners.filter((p) => p.type === 'partner' || p.type === 'future')

  function PartnerGrid({ items, title }: { items: typeof partners; title: string }) {
    if (items.length === 0) return null
    return (
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-brand-green">{title}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => {
            const logo = typeof p.logo === 'object' ? p.logo : null
            return (
              <div key={p.id} className="flex flex-col items-center rounded-xl border bg-white p-4 text-center shadow-sm">
                {logo?.url ? (
                  <Image src={logo.url} alt={p.name} width={80} height={60} className="mb-3 object-contain" />
                ) : (
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10 text-2xl font-bold text-brand-green">
                    {p.name.charAt(0)}
                  </div>
                )}
                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                {p.country && <p className="mt-0.5 text-xs text-gray-500">{p.country}</p>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Partners & Suppliers</h1>
        <p className="text-gray-500">Our trusted network built on quality and reliability</p>
      </div>
      <PartnerGrid items={suppliers} title="Our Suppliers" />
      <PartnerGrid items={buyers} title="Our Buyers" />
      <PartnerGrid items={otherPartners} title="Our Partners" />
      {partners.length === 0 && <p className="text-center text-gray-400">Partner information coming soon.</p>}
    </div>
  )
}
```

- [ ] **Step 6.8: Create `src/app/(frontend)/news/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'News & Updates',
  description: 'Latest news, updates, and announcements from Myra Global Exports.',
}

export default async function NewsPage() {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  if (!settings.sections?.showNews) {
    return <div className="py-32 text-center text-gray-400">News section coming soon.</div>
  }

  const { docs: articles } = await payload.find({
    collection: 'news',
    where: { visible: { equals: true } },
    sort: '-publishedAt',
    limit: 50,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">News & Updates</h1>
        <p className="text-gray-500">Stay up to date with Myra Global Exports</p>
      </div>
      {articles.length === 0 ? (
        <p className="text-center text-gray-400">No news articles yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const img = typeof article.coverImage === 'object' ? article.coverImage : null
            return (
              <Link key={article.id} href={`/news/${article.slug}`} className="group rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
                {img?.url && (
                  <div className="relative h-48">
                    <Image src={img.url} alt={article.title} fill className="object-cover transition-transform group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  {article.category && <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-gold">{article.category}</p>}
                  <h3 className="font-semibold text-gray-900">{article.title}</h3>
                  {article.excerpt && <p className="mt-2 text-sm text-gray-500 line-clamp-3">{article.excerpt}</p>}
                  {article.publishedAt && (
                    <p className="mt-3 text-xs text-gray-400">{new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 6.9: Create `src/app/(frontend)/news/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'news', where: { slug: { equals: params.slug } } })
  const article = docs[0]
  if (!article) return { title: 'Article Not Found' }
  return { title: article.title, description: article.excerpt ?? undefined }
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'news', where: { and: [{ slug: { equals: params.slug } }, { visible: { equals: true } }] } })
  const article = docs[0]
  if (!article) notFound()

  const img = typeof article.coverImage === 'object' ? article.coverImage : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link href="/news" className="mb-8 inline-flex items-center text-sm text-brand-green hover:underline">
        ← Back to News
      </Link>
      {article.category && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-gold">{article.category}</p>}
      <h1 className="mb-4 font-heading text-4xl font-bold text-gray-900">{article.title}</h1>
      {article.publishedAt && (
        <p className="mb-6 text-sm text-gray-400">{new Date(article.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      )}
      {img?.url && (
        <div className="relative mb-8 h-72 overflow-hidden rounded-2xl">
          <Image src={img.url} alt={article.title} fill className="object-cover" />
        </div>
      )}
      <div className="prose prose-lg max-w-none">
        {article.excerpt && <p className="lead">{article.excerpt}</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 6.10: Create `src/app/(frontend)/privacy-policy/page.tsx`**

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 font-heading text-4xl font-bold text-brand-green">Privacy Policy</h1>
      <div className="prose prose-lg">
        <p><strong>Effective Date:</strong> June 2025</p>
        <p>Myra Global Exports ("we", "our", or "us") is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you use our website at myraglobalexports.com.</p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Contact details (name, email, phone, company) provided through inquiry and contact forms</li>
          <li>Usage data collected automatically through Google Analytics (anonymised)</li>
          <li>Cookies for website functionality and analytics</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to your inquiries and send you quotes</li>
          <li>To improve our website and services</li>
          <li>To send relevant business communications (with your consent)</li>
        </ul>

        <h2>Data Sharing</h2>
        <p>We do not sell or rent your personal data to third parties. We may share data with trusted service providers (email services, analytics) necessary to operate our website.</p>

        <h2>Your Rights</h2>
        <p>You may request access to, correction, or deletion of your personal data by contacting us at info@myraglobalexports.com.</p>

        <h2>Contact</h2>
        <p>For privacy concerns: <a href="mailto:info@myraglobalexports.com">info@myraglobalexports.com</a></p>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.11: Create `src/app/(frontend)/terms/page.tsx`**

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms & Conditions' }

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 font-heading text-4xl font-bold text-brand-green">Terms & Conditions</h1>
      <div className="prose prose-lg">
        <p><strong>Effective Date:</strong> June 2025</p>
        <p>By using the Myra Global Exports website (myraglobalexports.com), you agree to these terms.</p>

        <h2>Use of Website</h2>
        <p>This website is for informational purposes and to facilitate business inquiries. You may not use the site for any unlawful purpose.</p>

        <h2>Intellectual Property</h2>
        <p>All content on this website — including text, images, logos, and design — is the property of Myra Global Exports and is protected by copyright law.</p>

        <h2>Inquiries & Quotes</h2>
        <p>Submitting an inquiry form does not constitute a binding contract. All quotes are subject to separate written agreement.</p>

        <h2>Limitation of Liability</h2>
        <p>Myra Global Exports is not liable for any indirect or consequential damages arising from use of this website.</p>

        <h2>Contact</h2>
        <p>For questions: <a href="mailto:info@myraglobalexports.com">info@myraglobalexports.com</a></p>
      </div>
    </div>
  )
}
```

- [ ] **Step 6.12: Run and verify all new pages**

```bash
npm run dev
```
Visit `/contact`, `/get-quote`, `/gallery`, `/partners`, `/news`, `/privacy-policy`, `/terms` — expected: all pages render, no 404s or TypeScript errors.

- [ ] **Step 6.13: Commit**

```bash
git add src/app/\(frontend\)/contact src/app/\(frontend\)/get-quote src/app/\(frontend\)/gallery src/app/\(frontend\)/partners src/app/\(frontend\)/news src/app/\(frontend\)/privacy-policy src/app/\(frontend\)/terms src/components/forms src/components/shared
git commit -m "feat: add contact, quote, gallery, partners, news, legal pages and inquiry form"
```

---

## Task 7: Inquiry API Route + Email Notifications

**Files:**
- Create: `src/app/api/inquiry/route.ts`
- Create: `src/lib/email.ts`
- Create: `tests/lib/email.test.ts`
- Create: `tests/api/inquiry.test.ts`

- [ ] **Step 7.1: Write failing test for email helper**

Create `tests/lib/email.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest'

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'mock-id', error: null }),
    },
  })),
}))

import { buildInquiryEmailHtml, buildInquiryEmailSubject } from '@/lib/email'

describe('buildInquiryEmailSubject', () => {
  it('includes product and country', () => {
    const subject = buildInquiryEmailSubject({ productRequired: 'Basmati Rice', country: 'UAE', fullName: 'John' })
    expect(subject).toContain('Basmati Rice')
    expect(subject).toContain('UAE')
  })
})

describe('buildInquiryEmailHtml', () => {
  it('contains all inquiry fields', () => {
    const html = buildInquiryEmailHtml({
      fullName: 'John Smith',
      company: 'ABC Traders',
      country: 'UAE',
      productRequired: 'Basmati Rice',
      quantity: '10 MT',
      email: 'john@abc.com',
      whatsapp: '+971501234567',
      message: 'Please send quote.',
    })
    expect(html).toContain('John Smith')
    expect(html).toContain('Basmati Rice')
    expect(html).toContain('10 MT')
    expect(html).toContain('john@abc.com')
  })
})
```

- [ ] **Step 7.2: Run test to verify it fails**

```bash
npx vitest run tests/lib/email.test.ts
```
Expected: FAIL — `Cannot find module '@/lib/email'`

- [ ] **Step 7.3: Create `src/lib/email.ts`**

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type InquiryData = {
  fullName: string
  company?: string
  country: string
  productRequired: string
  quantity?: string
  email: string
  whatsapp?: string
  message?: string
}

export function buildInquiryEmailSubject(data: Pick<InquiryData, 'productRequired' | 'country' | 'fullName'>) {
  return `New Inquiry: ${data.productRequired} from ${data.country} — ${data.fullName}`
}

export function buildInquiryEmailHtml(data: InquiryData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1B5E20; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">🌾 New Export Inquiry — Myra Global Exports</h2>
      </div>
      <div style="background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${[
            ['Full Name', data.fullName],
            ['Company', data.company ?? '—'],
            ['Country', data.country],
            ['Product Required', data.productRequired],
            ['Quantity', data.quantity ?? '—'],
            ['Email', data.email],
            ['WhatsApp', data.whatsapp ?? '—'],
            ['Message', data.message ?? '—'],
          ]
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; background: #fff; border: 1px solid #e0e0e0; width: 40%;">${label}</td>
              <td style="padding: 8px 12px; background: #fff; border: 1px solid #e0e0e0;">${value}</td>
            </tr>`,
            )
            .join('')}
        </table>
        <p style="margin-top: 16px; color: #666; font-size: 12px;">
          This inquiry was submitted via the Myra Global Exports website contact form.
          Please respond within 24 hours.
        </p>
      </div>
    </div>
  `
}

export async function sendInquiryNotificationEmail(data: InquiryData) {
  await resend.emails.send({
    from: 'Myra Global Website <noreply@myraglobalexports.com>',
    to: [process.env.INQUIRY_NOTIFICATION_EMAIL ?? 'info@myraglobalexports.com'],
    replyTo: data.email,
    subject: buildInquiryEmailSubject(data),
    html: buildInquiryEmailHtml(data),
  })
}
```

- [ ] **Step 7.4: Run test to verify it passes**

```bash
npx vitest run tests/lib/email.test.ts
```
Expected: PASS — all 3 assertions pass.

- [ ] **Step 7.5: Write failing test for inquiry API route**

Create `tests/api/inquiry.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/payload', () => ({
  getPayloadClient: vi.fn().mockResolvedValue({
    create: vi.fn().mockResolvedValue({ id: 'test-id' }),
  }),
}))
vi.mock('@/lib/email', () => ({ sendInquiryNotificationEmail: vi.fn().mockResolvedValue(undefined) }))

import { POST } from '@/app/api/inquiry/route'

const validBody = {
  fullName: 'John Smith',
  country: 'UAE',
  productRequired: 'Basmati Rice',
  email: 'john@example.com',
}

describe('POST /api/inquiry', () => {
  it('returns 201 for valid payload', async () => {
    const req = new NextRequest('http://localhost/api/inquiry', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
  })

  it('returns 400 when required fields missing', async () => {
    const req = new NextRequest('http://localhost/api/inquiry', {
      method: 'POST',
      body: JSON.stringify({ fullName: 'John' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 7.6: Run test to verify it fails**

```bash
npx vitest run tests/api/inquiry.test.ts
```
Expected: FAIL — `Cannot find module '@/app/api/inquiry/route'`

- [ ] **Step 7.7: Create `src/app/api/inquiry/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'
import { sendInquiryNotificationEmail } from '@/lib/email'

const schema = z.object({
  fullName: z.string().min(2),
  company: z.string().optional(),
  country: z.string().min(2),
  productRequired: z.string().min(2),
  quantity: z.string().optional(),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const payload = await getPayloadClient()
  await payload.create({ collection: 'inquiries', data: { ...parsed.data, status: 'new' } })

  try {
    await sendInquiryNotificationEmail(parsed.data)
  } catch (err) {
    console.error('Email notification failed:', err)
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
```

- [ ] **Step 7.8: Run tests to verify they pass**

```bash
npx vitest run tests/
```
Expected: All 5 tests PASS.

- [ ] **Step 7.9: Test inquiry form manually**

```bash
npm run dev
```
Open `http://localhost:3000/get-quote`, fill the form with test data, submit.
Expected: Success message. Check Payload admin at `/admin` → Inquiries — new entry should appear.

- [ ] **Step 7.10: Commit**

```bash
git add src/app/api/inquiry src/lib/email.ts tests/
git commit -m "feat: add inquiry API route with email notifications and tests"
```

---

## Task 8: Inquiry Export (CSV/Excel) in Admin

**Files:**
- Create: `src/app/api/admin/export-inquiries/route.ts`

- [ ] **Step 8.1: Install csv library**

```bash
npm install papaparse
npm install -D @types/papaparse
```

- [ ] **Step 8.2: Create `src/app/api/admin/export-inquiries/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import Papa from 'papaparse'

export async function GET(req: NextRequest) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'inquiries',
    limit: 10000,
    sort: '-createdAt',
  })

  const rows = docs.map((inq) => ({
    Date: inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-IN') : '',
    'Full Name': inq.fullName,
    Company: inq.company ?? '',
    Country: inq.country,
    'Product Required': inq.productRequired,
    Quantity: inq.quantity ?? '',
    Email: inq.email,
    WhatsApp: inq.whatsapp ?? '',
    Message: inq.message ?? '',
    Status: inq.status ?? 'new',
  }))

  const csv = Papa.unparse(rows)
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="inquiries-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
```

> In Payload admin, link to this URL from a custom component or just share the URL with the admin. Buyers can be directed to `/api/admin/export-inquiries` to download all inquiries as CSV.

- [ ] **Step 8.3: Test CSV export**

```bash
npm run dev
```
Open `http://localhost:3000/api/admin/export-inquiries` — expected: CSV file downloads.

- [ ] **Step 8.4: Commit**

```bash
git add src/app/api/admin
git commit -m "feat: add CSV export for inquiries"
```

---

## Task 9: SEO, Sitemap, Google Analytics

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/(frontend)/layout.tsx`

- [ ] **Step 9.1: Create `src/app/sitemap.ts`**

```typescript
import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myraglobalexports.com'
  const payload = await getPayloadClient()

  const [productsResult, newsResult] = await Promise.all([
    payload.find({ collection: 'products', where: { visible: { equals: true } }, limit: 500 }),
    payload.find({ collection: 'news', where: { visible: { equals: true } }, limit: 500 }),
  ])

  const staticPages = ['', '/about', '/products', '/certifications', '/contact', '/get-quote', '/gallery', '/partners', '/news'].map(
    (path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.8 })
  )

  const productPages = productsResult.docs.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const newsPages = newsResult.docs.map((n) => ({
    url: `${base}/news/${n.slug}`,
    lastModified: new Date(n.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...newsPages]
}
```

- [ ] **Step 9.2: Create `src/app/robots.ts`**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myraglobalexports.com'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/admin/'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
```

- [ ] **Step 9.3: Add Google Analytics to `src/app/(frontend)/layout.tsx`**

Add after the `<html>` open tag and inside `<head>`:

```tsx
// At top of layout.tsx, add:
import Script from 'next/script'

// Inside <body>, before closing </body>:
{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
  <>
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
      `}
    </Script>
  </>
)}
```

Add to `.env.local`:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> Get the GA4 Measurement ID from Google Analytics → Admin → Data Streams.

- [ ] **Step 9.4: Verify sitemap**

```bash
npm run dev
```
Open `http://localhost:3000/sitemap.xml` — expected: XML sitemap with all static pages listed.
Open `http://localhost:3000/robots.txt` — expected: robots.txt disallowing `/admin/`.

- [ ] **Step 9.5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap, robots.txt, Google Analytics"
```

---

## Task 10: Production Build & Deployment Check

**Files:**
- Modify: `.env.local` → create `.env.production.local`

- [ ] **Step 10.1: Run production build**

```bash
npm run build
```
Expected: Build completes with no TypeScript errors. All pages generate.

Fix any type errors that appear before proceeding.

- [ ] **Step 10.2: Run type check**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 10.3: Run all tests**

```bash
npx vitest run
```
Expected: All tests pass.

- [ ] **Step 10.4: Test production build locally**

```bash
npm run start
```
Open `http://localhost:3000` — verify all pages load, admin loads at `/admin`.

- [ ] **Step 10.5: Deploy to Vercel (recommended)**

```bash
npm install -g vercel
vercel
```

Follow prompts:
- Project name: `myra-global-exports`
- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`

In Vercel dashboard → Settings → Environment Variables, add all keys from `.env.local`.

- [ ] **Step 10.6: Final commit**

```bash
git add .
git commit -m "chore: verify production build and deployment config"
```

---

## Spec Coverage Checklist

| Requirement | Covered In |
|---|---|
| Home page (all 8 sections) | Task 4 |
| About Us page | Task 5 |
| Products page + detail | Task 5 |
| Certifications page | Task 5 |
| Contact page with map, hours, form | Task 6 |
| Get a Quote / Inquiry Form (8 fields) | Task 6 |
| Gallery page | Task 6 |
| Partners & Suppliers page | Task 6 |
| News & Updates page + detail | Task 6 |
| Privacy Policy page | Task 6 |
| Terms & Conditions page | Task 6 |
| Inquiry form (all 8 fields) | Task 6 |
| Email notifications for new inquiries | Task 7 |
| Inquiry stored in admin panel | Task 7 |
| Export inquiries to CSV | Task 8 |
| Admin panel (full CMS) | Task 2 |
| Hide/unhide all sections | Task 2 (SiteSettings) |
| Add/Edit/Delete Products | Task 2 (Products collection) |
| Add/Edit/Delete Certificates | Task 2 (Certificates collection) |
| Add/Edit/Delete Gallery | Task 2 (Gallery collection) |
| Add/Edit/Delete Partners | Task 2 (Partners collection) |
| Add/Edit/Delete News | Task 2 (News collection) |
| Social media icons (5 platforms) | Task 3 (SocialLinks) |
| WhatsApp floating chat button | Task 3 |
| PDF downloads (company profile, catalogue) | Task 6 |
| Sitemap | Task 9 |
| robots.txt | Task 9 |
| Google Analytics | Task 9 |
| Mobile responsive | Tailwind CSS throughout |
| SEO meta tags | Per-page Metadata exports |
| Testimonials section | Task 2 (collection defined; display TODO in Phase 2) |
| Inquiry WhatsApp notification | Phase 2 plan (Twilio/CallMeBot) |
| Multi-language (9 locales) | Phase 3 plan (next-intl) |
| Search bar | Phase 2 plan |
| Live chat widget | Phase 2 plan (Tawk.to embed) |
| Watermark / image protection | Phase 2 plan |
| Backup & security | Hosting layer (Vercel) |

---

## Phase 2 Outline (write as separate plan)

- **WhatsApp notifications** for new inquiries via Twilio or CallMeBot API
- **Testimonials** section on home page (fetch from Testimonials collection)
- **Search** (product and site-wide search via Payload's built-in search plugin)
- **Live chat** (Tawk.to embed script in layout)
- **Visitor analytics dashboard** in admin (Google Analytics embed)
- **Image watermarking** on upload via Cloudinary transformation

## Phase 3 Outline (write as separate plan)

- **next-intl** setup with 9 locale message files
- **Language switcher** in header
- English translations complete, machine-translate others via DeepL API
- Arabic RTL support (`dir="rtl"` on `<html>` for Arabic locale)

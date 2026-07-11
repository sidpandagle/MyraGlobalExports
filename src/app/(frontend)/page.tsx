import type { Metadata } from 'next'
import { HeroBanner } from '@/components/home/HeroBanner'
import { AboutSection } from '@/components/home/AboutSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ProductsSection } from '@/components/home/ProductsSection'
import { CertificationsSection } from '@/components/home/CertificationsSection'
import { ExportMarkets } from '@/components/home/ExportMarkets'
import { ExportInfo } from '@/components/home/ExportInfo'
import { PaymentTerms } from '@/components/home/PaymentTerms'
import { InquirySection } from '@/components/home/InquirySection'
import { ContactInfoSection } from '@/components/home/ContactInfoSection'
import { siteSettings } from '@/data/site-settings'
import { createClient } from '@/lib/supabase/server'
import type { ProductImage } from '@/types/database'

const { showProducts, showCertificates, showExportMarkets, showContactInfo } = siteSettings.sections

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myraglobalexports.com'

export const metadata: Metadata = {
  title: 'Myra Global Exports — Premium Agricultural Commodities from India',
  description:
    'Myra Global Exports sources and exports premium agricultural produce — fresh vegetables, fruits, spices, grains, pulses, and oil seeds — from India to buyers in 30+ countries.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: 'Myra Global Exports — Premium Agricultural Commodities from India',
    description:
      'Premium agricultural produce exported from India. Fresh vegetables, fruits, spices, grains, pulses — sourced from verified Indian farms.',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Myra Global Exports',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-81692-13274',
    contactType: 'sales',
    availableLanguage: 'English',
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  sameAs: ['https://www.instagram.com/myraglobalexports_'],
}

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: rawProducts }, { data: rawCerts }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, category, short_description, images')
      .eq('is_published', true)
      .eq('is_future', false)
      .order('display_order')
      .limit(8),
    supabase
      .from('certifications')
      .select('id, name, logo_url, description')
      .order('display_order'),
  ])

  const products = (rawProducts ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    shortDescription: p.short_description,
    images: (p.images as ProductImage[]).map((img) => ({ image: img })),
  }))

  const certificates = (rawCerts ?? []).map((c) => ({
    id: c.id,
    title: c.name,
    certificateNumber: c.description,
    image: c.logo_url ? { url: c.logo_url, alt: c.name } : null,
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HeroBanner />
      <AboutSection />
      <WhyChooseUs />
      {showProducts && <ProductsSection products={products} />}
      {showCertificates && <CertificationsSection certificates={certificates} />}
      {showExportMarkets && <ExportMarkets />}
      <ExportInfo />
      <PaymentTerms />
      <InquirySection />
      {showContactInfo && (
        <ContactInfoSection contact={siteSettings.contact} />
      )}
    </>
  )
}

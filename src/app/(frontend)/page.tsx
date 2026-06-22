import { HeroBanner } from '@/components/home/HeroBanner'
import { AboutSection } from '@/components/home/AboutSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ProductsSection } from '@/components/home/ProductsSection'
import { CertificationsSection } from '@/components/home/CertificationsSection'
import { ExportMarkets } from '@/components/home/ExportMarkets'
import { InquirySection } from '@/components/home/InquirySection'
import { ContactInfoSection } from '@/components/home/ContactInfoSection'
import { siteSettings } from '@/data/site-settings'
import { createClient } from '@/lib/supabase/server'
import type { ProductImage } from '@/types/database'

const { showProducts, showCertificates, showExportMarkets, showContactInfo } = siteSettings.sections

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
      <HeroBanner />
      <AboutSection />
      <WhyChooseUs />
      {showProducts && <ProductsSection products={products} />}
      {showCertificates && <CertificationsSection certificates={certificates} />}
      {showExportMarkets && <ExportMarkets />}
      <InquirySection />
      {showContactInfo && (
        <ContactInfoSection contact={siteSettings.contact} />
      )}
    </>
  )
}

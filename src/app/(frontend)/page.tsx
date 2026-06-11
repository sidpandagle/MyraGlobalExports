import { HeroBanner } from '@/components/home/HeroBanner'
import { AboutSection } from '@/components/home/AboutSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ProductsSection } from '@/components/home/ProductsSection'
import { CertificationsSection } from '@/components/home/CertificationsSection'
import { ExportMarkets } from '@/components/home/ExportMarkets'
import { InquirySection } from '@/components/home/InquirySection'
import { ContactInfoSection } from '@/components/home/ContactInfoSection'
import { siteSettings } from '@/data/site-settings'

const FEATURED_PRODUCTS = [
  { id: 'm1', name: 'Basmati Rice', slug: 'basmati-rice', category: 'Grains', shortDescription: 'Premium aged basmati with distinct aroma and long grain.', images: [] },
  { id: 'm2', name: 'Turmeric', slug: 'turmeric', category: 'Spices', shortDescription: 'High curcumin content, bright golden colour from Erode.', images: [] },
  { id: 'm3', name: 'Cumin Seeds', slug: 'cumin', category: 'Spices', shortDescription: 'Aromatic cumin sourced from the farms of Rajasthan.', images: [] },
  { id: 'm4', name: 'Sesame Seeds', slug: 'sesame', category: 'Oil Seeds', shortDescription: 'Export-grade white & black sesame, hull and natural.', images: [] },
  { id: 'm5', name: 'Red Chilli', slug: 'red-chilli', category: 'Spices', shortDescription: 'Bold flavour and vibrant colour from Guntur, Andhra Pradesh.', images: [] },
  { id: 'm6', name: 'Groundnuts', slug: 'groundnuts', category: 'Oil Seeds', shortDescription: 'Bold & Java variety groundnuts, aflatoxin tested.', images: [] },
  { id: 'm7', name: 'Wheat', slug: 'wheat', category: 'Grains', shortDescription: 'Milling and durum wheat with consistent protein content.', images: [] },
  { id: 'm8', name: 'Pulses & Lentils', slug: 'pulses', category: 'Pulses', shortDescription: 'Toor, moong, masoor, chana — broad pulse export range.', images: [] },
]

const { showProducts, showCertificates, showExportMarkets, showContactInfo } = siteSettings.sections

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <AboutSection />
      <WhyChooseUs />
      {showProducts && (
        <ProductsSection
          products={FEATURED_PRODUCTS as Parameters<typeof ProductsSection>[0]['products']}
        />
      )}
      {showCertificates && (
        <CertificationsSection
          certificates={[] as Parameters<typeof CertificationsSection>[0]['certificates']}
        />
      )}
      {showExportMarkets && <ExportMarkets />}
      <InquirySection />
      {showContactInfo && (
        <ContactInfoSection contact={siteSettings.contact} />
      )}
    </>
  )
}

import { HeroBanner } from '@/components/home/HeroBanner'
import { AboutSection } from '@/components/home/AboutSection'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ProductsSection } from '@/components/home/ProductsSection'
import { CertificationsSection } from '@/components/home/CertificationsSection'
import { ExportMarkets } from '@/components/home/ExportMarkets'
import { InquirySection } from '@/components/home/InquirySection'
import { ContactInfoSection } from '@/components/home/ContactInfoSection'

async function getHomeData() {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const [productsResult, certsResult, settings] = await Promise.all([
      payload.find({
        collection: 'products',
        where: {
          and: [
            { visible: { equals: true } },
            { featuredOnHome: { equals: true } },
          ],
        },
        limit: 8,
        sort: 'sortOrder',
        depth: 1,
      }),
      payload.find({
        collection: 'certificates',
        where: { visible: { equals: true } },
        sort: 'sortOrder',
        depth: 1,
      }),
      payload.findGlobal({ slug: 'site-settings' }),
    ])
    return {
      products: productsResult.docs,
      certificates: certsResult.docs,
      settings,
    }
  } catch {
    return { products: [], certificates: [], settings: null }
  }
}

export default async function HomePage() {
  const { products, certificates, settings } = await getHomeData()

  const showProducts = settings?.sections?.showProducts !== false
  const showCertificates = settings?.sections?.showCertificates !== false
  const showExportMarkets = settings?.sections?.showExportMarkets !== false
  const showContactInfo = settings?.sections?.showContactInfo !== false

  return (
    <>
      <HeroBanner />
      <AboutSection />
      <WhyChooseUs />
      {showProducts && (
        <ProductsSection
          products={products as Parameters<typeof ProductsSection>[0]['products']}
        />
      )}
      {showCertificates && (
        <CertificationsSection
          certificates={certificates as Parameters<typeof CertificationsSection>[0]['certificates']}
        />
      )}
      {showExportMarkets && <ExportMarkets />}
      <InquirySection />
      {showContactInfo && settings?.contact && (
        <ContactInfoSection contact={settings.contact} />
      )}
    </>
  )
}

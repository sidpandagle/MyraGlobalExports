import type { Metadata } from 'next'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { PDFDownloadButton } from '@/components/shared/PDFDownloadButton'

export const metadata: Metadata = {
  title: 'Get a Quote',
  description: 'Request a competitive export quote from Myra Global Exports.',
}

type MediaFile = { url?: string | null }

async function getDownloads(): Promise<{
  companyProfile: MediaFile | null
  productCatalogue: MediaFile | null
}> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    return {
      companyProfile:
        typeof settings.downloads?.companyProfile === 'object'
          ? (settings.downloads.companyProfile as MediaFile)
          : null,
      productCatalogue:
        typeof settings.downloads?.productCatalogue === 'object'
          ? (settings.downloads.productCatalogue as MediaFile)
          : null,
    }
  } catch {
    return { companyProfile: null, productCatalogue: null }
  }
}

export default async function GetQuotePage() {
  const { companyProfile, productCatalogue } = await getDownloads()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          Request a Quote
        </h1>
        <p className="text-gray-500">
          Fill in the form below and we&apos;ll send you a competitive quote within 24 hours.
        </p>
        {(companyProfile?.url || productCatalogue?.url) && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {companyProfile?.url && (
              <PDFDownloadButton href={companyProfile.url} label="Download Company Profile" />
            )}
            {productCatalogue?.url && (
              <PDFDownloadButton href={productCatalogue.url} label="Download Product Catalogue" />
            )}
          </div>
        )}
      </div>
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <InquiryForm />
      </div>
    </div>
  )
}

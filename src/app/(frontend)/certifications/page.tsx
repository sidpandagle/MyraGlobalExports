import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Certifications',
  description:
    'Myra Global Exports holds GST, IEC, APEDA and FSSAI certifications ensuring international compliance.',
}

type CertMedia = { url?: string | null; alt?: string | null }

type Certificate = {
  id: string
  title: string
  certificateNumber?: string | null
  issueDate?: string | null
  expiryDate?: string | null
  image?: CertMedia | null
  pdf?: CertMedia | null
}

async function getCertificates(): Promise<Certificate[]> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'certificates',
      where: { visible: { equals: true } },
      sort: 'sortOrder',
      depth: 1,
    })
    return result.docs as unknown as Certificate[]
  } catch {
    return []
  }
}

export default async function CertificationsPage() {
  const certificates = await getCertificates()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          Our Certifications
        </h1>
        <p className="text-gray-500">Certified, compliant, and trusted for international trade</p>
      </div>

      {/* Static certification items always shown (even without DB data) */}
      <div className="mb-8 rounded-2xl bg-brand-green/5 p-6">
        <h2 className="mb-4 font-semibold text-brand-green">Our Compliance</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'GST Registration', desc: 'Goods & Services Tax registered', icon: '📋' },
            { name: 'IEC Certificate', desc: 'Import Export Code — certification in progress', icon: '🌐' },
            { name: 'APEDA Registration', desc: 'Agricultural & Processed Food Exports certification', icon: '🌾' },
            { name: 'FSSAI Certificate', desc: 'Food Safety Standards Authority certification', icon: '🍱' },
          ].map(({ name, desc, icon }) => (
            <div key={name} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
              <span className="text-2xl" aria-hidden="true">{icon}</span>
              <div>
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-xl border bg-white p-6 shadow-sm">
              {cert.image?.url && (
                <Image
                  src={cert.image.url}
                  alt={cert.image.alt ?? cert.title}
                  width={120}
                  height={120}
                  className="mx-auto mb-4 object-contain"
                />
              )}
              <h3 className="text-center font-semibold text-gray-900">{cert.title}</h3>
              {cert.certificateNumber && (
                <p className="mt-1 text-center text-sm text-gray-500">
                  No: {cert.certificateNumber}
                </p>
              )}
              {cert.issueDate && (
                <p className="mt-1 text-center text-xs text-gray-400">
                  Issued: {new Date(cert.issueDate).toLocaleDateString('en-IN')}
                </p>
              )}
              {cert.pdf?.url && (
                <a
                  href={cert.pdf.url}
                  download
                  className="mt-4 block text-center text-xs font-medium text-brand-green hover:underline"
                >
                  Download Certificate PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

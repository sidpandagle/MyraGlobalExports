import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Certifications',
  description:
    'Myra Global Exports holds GST, IEC, APEDA and FSSAI certifications ensuring international compliance.',
}

export default function CertificationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          Our Certifications
        </h1>
        <p className="text-gray-500">Certified, compliant, and trusted for international trade</p>
      </div>

      <div className="mb-8 rounded-2xl bg-brand-green/5 p-6">
        <h2 className="mb-4 font-semibold text-brand-green">Our Compliance</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'GST Registration', desc: 'Goods & Services Tax registered', badge: '/certifications/cert-gst.png' },
            { name: 'IEC Certificate', desc: 'Import Export Code — certification in progress', badge: '/certifications/cert-iec.png' },
            { name: 'APEDA Registration', desc: 'Agricultural & Processed Food Exports certification', badge: '/certifications/cert-apeda.png' },
            { name: 'FSSAI Certificate', desc: 'Food Safety Standards Authority certification', badge: '/certifications/cert-fssai.png' },
          ].map(({ name, desc, badge }) => (
            <div key={name} className="flex flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <Image src={badge} alt={name} width={80} height={80} className="object-contain" />
              <div className="text-center">
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Certifications',
  description: 'Myra Global Exports holds certifications ensuring international trade compliance.',
}

export default async function CertificationsPage() {
  const supabase = await createClient()
  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order')

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          Our Certifications
        </h1>
        <p className="text-gray-500">Certified, compliant, and trusted for international trade</p>
      </div>

      {certifications && certifications.length > 0 ? (
        <div className="rounded-2xl bg-brand-green/5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex flex-col items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                {cert.logo_url ? (
                  <Image src={cert.logo_url} alt={cert.name} width={80} height={80} className="object-contain" />
                ) : (
                  <div className="w-20 h-20 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <span className="text-brand-green font-heading text-lg font-bold">{cert.name.slice(0, 2)}</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{cert.name}</p>
                  {cert.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{cert.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400">Certifications information coming soon.</p>
      )}
    </div>
  )
}

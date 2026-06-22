import { createAdminClient } from '@/lib/supabase/admin'
import { deleteCertification } from './actions'
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--admin-text)' }}>
          Certifications
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--admin-muted)' }}>
          {certs?.length ?? 0} certifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-2.5">
          {certs?.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-lg p-4 flex gap-4 items-start"
              style={{ border: '1px solid var(--admin-border)' }}
            >
              {cert.logo_url && (
                <div className="relative w-14 h-10 shrink-0">
                  <Image src={cert.logo_url} alt={cert.name} fill className="object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: 'var(--admin-text)' }}>
                  {cert.name}
                </p>
                {cert.description && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--admin-muted)' }}>
                    {cert.description}
                  </p>
                )}
                <p className="text-xs mt-1" style={{ color: 'var(--admin-muted)', opacity: 0.6 }}>
                  Order: {cert.display_order}
                </p>
              </div>
              <form action={deleteCertification.bind(null, cert.id)}>
                <button
                  type="submit"
                  className="text-xs px-2.5 py-1.5 rounded-md font-medium shrink-0"
                  style={{ color: '#B84040' }}
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
          {!certs?.length && (
            <p className="text-sm" style={{ color: 'var(--admin-muted)' }}>
              No certifications yet.
            </p>
          )}
        </div>

        <div
          className="bg-white rounded-lg p-6 self-start"
          style={{ border: '1px solid var(--admin-border)' }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>
            Add Certification
          </h2>
          <AddCertificationForm />
        </div>
      </div>
    </div>
  )
}

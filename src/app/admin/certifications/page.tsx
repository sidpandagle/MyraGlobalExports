import { createAdminClient } from '@/lib/supabase/admin'
import { deleteCertification } from './actions'
import { Button } from '@/components/ui/button'
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
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Certifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          {certs?.map((cert) => (
            <div key={cert.id} className="bg-white border border-neutral-200 rounded-lg p-4 flex gap-4 items-start">
              {cert.logo_url && (
                <div className="relative w-16 h-12 shrink-0">
                  <Image src={cert.logo_url} alt={cert.name} fill className="object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-800">{cert.name}</p>
                {cert.description && <p className="text-sm text-neutral-500 mt-0.5">{cert.description}</p>}
                <p className="text-xs text-neutral-400 mt-1">Order: {cert.display_order}</p>
              </div>
              <form action={deleteCertification.bind(null, cert.id)}>
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  className="text-red-500 hover:text-red-700 shrink-0"
                >
                  Delete
                </Button>
              </form>
            </div>
          ))}
          {!certs?.length && <p className="text-neutral-400 text-sm">No certifications yet.</p>}
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Add Certification</h2>
          <AddCertificationForm />
        </div>
      </div>
    </div>
  )
}

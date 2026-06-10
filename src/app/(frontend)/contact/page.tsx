import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Myra Global Exports.',
}

type ContactData = {
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  salesEmail?: string | null
  address?: string | null
  businessHours?: string | null
  googleMapsEmbedUrl?: string | null
}

async function getContactData(): Promise<ContactData> {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    return (settings.contact as ContactData) ?? {}
  } catch {
    return {}
  }
}

export default async function ContactPage() {
  const c = await getContactData()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">Contact Us</h1>
        <p className="text-gray-500">We&apos;d love to hear from you. Reach out any time.</p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact info */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-brand-green">Contact Information</h2>
          <div className="space-y-5">
            {c.phone && (
              <div className="flex gap-4">
                <span className="text-2xl" aria-hidden="true">📞</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                  <a href={`tel:${c.phone}`} className="font-medium text-gray-800 hover:text-brand-green">
                    {c.phone}
                  </a>
                </div>
              </div>
            )}
            {c.whatsapp && (
              <div className="flex gap-4">
                <span className="text-2xl" aria-hidden="true">💬</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">WhatsApp</p>
                  <a
                    href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-800 hover:text-brand-green"
                  >
                    {c.whatsapp}
                  </a>
                </div>
              </div>
            )}
            {c.email && (
              <div className="flex gap-4">
                <span className="text-2xl" aria-hidden="true">✉️</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Email</p>
                  <a href={`mailto:${c.email}`} className="font-medium text-gray-800 hover:text-brand-green">
                    {c.email}
                  </a>
                  {c.salesEmail && (
                    <a
                      href={`mailto:${c.salesEmail}`}
                      className="block font-medium text-gray-800 hover:text-brand-green"
                    >
                      {c.salesEmail}
                    </a>
                  )}
                </div>
              </div>
            )}
            {c.address && (
              <div className="flex gap-4">
                <span className="text-2xl" aria-hidden="true">📍</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Address</p>
                  <p className="whitespace-pre-line font-medium text-gray-800">{c.address}</p>
                </div>
              </div>
            )}
            {c.businessHours && (
              <div className="flex gap-4">
                <span className="text-2xl" aria-hidden="true">🕐</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Business Hours</p>
                  <p className="whitespace-pre-line font-medium text-gray-800">{c.businessHours}</p>
                </div>
              </div>
            )}
          </div>

          {c.googleMapsEmbedUrl && (
            <div className="mt-8 overflow-hidden rounded-xl">
              <iframe
                src={c.googleMapsEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Myra Global Exports Location"
              />
            </div>
          )}
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-brand-green">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'
import { siteSettings } from '@/data/site-settings'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact Myra Global Exports for agricultural export inquiries. Reach our team via phone, WhatsApp, or the contact form. We respond to all inquiries within 24 hours.',
}

export default function ContactPage() {
  const c = siteSettings.contact

  const contactItems = [
    c.phone && { label: 'Phone', value: c.phone, href: `tel:${c.phone}` },
    c.email && { label: 'Email', value: c.email, href: `mailto:${c.email}` },
    c.salesEmail && { label: 'Sales Email', value: c.salesEmail, href: `mailto:${c.salesEmail}` },
    c.whatsapp && {
      label: 'WhatsApp',
      value: c.whatsapp,
      href: `https://wa.me/${c.whatsapp.replace(/\D/g, '')}`,
    },
    c.address && { label: 'Address', value: c.address, href: null },
    c.businessHours && { label: 'Business Hours', value: c.businessHours, href: null },
  ].filter(Boolean) as { label: string; value: string; href: string | null }[]

  return (
    <div className="bg-cream min-h-screen">
      {/* Page hero */}
      <div className="bg-brand-green py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
            opacity: 0.04,
          }}
        />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="block h-px w-10 bg-brand-gold shrink-0" />
            <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-brand-gold/60">
              Get in Touch
            </p>
          </div>
          <h1
            className="font-heading font-light text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
          >
            Contact<br />
            <em className="italic text-brand-gold">Myra Global</em>
          </h1>
          <p className="text-white/50 font-sans text-base">
            We&apos;d love to hear from you. Reach out any time.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">
                Contact Information
              </p>
            </div>

            <div className="space-y-0 border border-fog overflow-hidden mb-10">
              {contactItems.map(({ label, value, href }, i) => (
                <div
                  key={label}
                  className={`flex gap-8 items-start p-6 ${i > 0 ? 'border-t border-fog' : ''} hover:bg-white transition-colors`}
                >
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-stone shrink-0 w-28">
                    {label}
                  </span>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-bark/70 font-sans text-sm hover:text-brand-green transition-colors whitespace-pre-line"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-bark/70 font-sans text-sm whitespace-pre-line">{value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="bg-brand-green p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                  opacity: 0.04,
                }}
              />
              <div className="relative z-10 flex items-center gap-6">
                <div>
                  <p className="font-heading text-4xl font-light text-brand-gold">24h</p>
                  <p className="text-[9px] font-sans uppercase tracking-[0.25em] text-white/40 mt-0.5">Response</p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <p className="text-white/55 font-sans text-sm leading-relaxed">
                  Our export team responds to all inquiries within one business day.
                </p>
              </div>
            </div>

            {c.googleMapsEmbedUrl && (
              <div className="mt-8 overflow-hidden border border-fog">
                <iframe
                  src={c.googleMapsEmbedUrl}
                  width="100%"
                  height="260"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Myra Global Exports Location"
                />
              </div>
            )}
          </div>

          {/* Contact form */}
          <div>
            <div className="flex items-center gap-4 mb-10">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">
                Send a Message
              </p>
            </div>
            <div className="bg-white border border-fog p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

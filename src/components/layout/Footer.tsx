import Link from 'next/link'
import { SocialLinks } from '@/components/shared/SocialLinks'

type ContactInfo = {
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  salesEmail?: string | null
  address?: string | null
  businessHours?: string | null
}

type SocialInfo = {
  whatsapp?: string | null
  instagram?: string | null
  facebook?: string | null
  linkedin?: string | null
  youtube?: string | null
}

type SectionFlags = {
  showSocialMedia?: boolean | null
  showContactInfo?: boolean | null
}

type FooterProps = {
  contact?: ContactInfo | null
  social?: SocialInfo | null
  sections?: SectionFlags | null
}

export function Footer({ contact, social, sections }: FooterProps) {
  return (
    <footer className="bg-brand-green text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-green">
                MG
              </div>
              <p className="text-xl font-bold">Myra Global Exports</p>
            </div>
            <p className="mb-4 text-sm text-green-200">Connecting the World. Empowering Futures.</p>
            {sections?.showSocialMedia && social && (
              <SocialLinks social={social} className="mt-4" iconSize={22} />
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 font-semibold uppercase tracking-wide text-brand-gold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-green-200">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Products' },
                { href: '/certifications', label: 'Certifications' },
                { href: '/get-quote', label: 'Get a Quote' },
                { href: '/contact', label: 'Contact Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          {sections?.showContactInfo && contact && (
            <div>
              <h3 className="mb-3 font-semibold uppercase tracking-wide text-brand-gold">Contact</h3>
              <ul className="space-y-2 text-sm text-green-200">
                {contact.phone && <li>📞 {contact.phone}</li>}
                {contact.email && (
                  <li>
                    ✉️{' '}
                    <a href={`mailto:${contact.email}`} className="hover:text-white">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.address && <li>📍 {contact.address}</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-green-700 pt-6 text-center text-xs text-green-300">
          <p>&copy; {new Date().getFullYear()} Myra Global Exports. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

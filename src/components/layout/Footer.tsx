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

const QUICK_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Products' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/partners', label: 'Partners' },
  { href: '/get-quote', label: 'Get a Quote' },
  { href: '/contact', label: 'Contact Us' },
]

export function Footer({ contact, social, sections }: FooterProps) {
  return (
    <footer className="bg-brand-green">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-brand-gold shrink-0">
              <span className="font-heading text-xs font-bold text-white">MG</span>
            </div>
            <div>
              <p className="font-heading text-xl font-semibold text-white tracking-tight">Myra Global Exports</p>
              <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 font-sans mt-0.5">
                Connecting the World · Empowering Futures
              </p>
            </div>
          </div>
          {sections?.showSocialMedia && social && (
            <SocialLinks social={social} className="mt-0" iconSize={20} />
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand description */}
          <div className="lg:col-span-2">
            <p className="text-white/50 text-sm font-sans leading-relaxed max-w-sm">
              India&apos;s premier agricultural export company delivering premium
              farm produce to buyers across 30+ countries worldwide.
              Trusted quality, reliable supply, international standards.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-brand-gold block" />
              <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-brand-gold/70">
                Est. India
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-gold/70">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-sans text-white/50 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          {sections?.showContactInfo && contact && (
            <div>
              <h3 className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-brand-gold/70">
                Contact
              </h3>
              <ul className="space-y-3">
                {contact.phone && (
                  <li className="text-sm font-sans text-white/50">
                    <span className="text-white/30 text-xs uppercase tracking-wider block mb-0.5 font-sans">Phone</span>
                    <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">{contact.phone}</a>
                  </li>
                )}
                {contact.email && (
                  <li className="text-sm font-sans text-white/50">
                    <span className="text-white/30 text-xs uppercase tracking-wider block mb-0.5 font-sans">Email</span>
                    <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">{contact.email}</a>
                  </li>
                )}
                {contact.address && (
                  <li className="text-sm font-sans text-white/50">
                    <span className="text-white/30 text-xs uppercase tracking-wider block mb-0.5 font-sans">Address</span>
                    <p className="whitespace-pre-line">{contact.address}</p>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-sans text-white/30">
            &copy; {new Date().getFullYear()} Myra Global Exports. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-[11px] font-sans text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.12em]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[11px] font-sans text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.12em]">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

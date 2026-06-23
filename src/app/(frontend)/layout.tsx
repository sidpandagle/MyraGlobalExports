import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { siteSettings } from '@/data/site-settings'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer
        contact={siteSettings.contact}
        social={siteSettings.social}
        sections={siteSettings.sections}
      />
      <WhatsAppButton phone={siteSettings.contact.whatsapp} />
    </div>
  )
}

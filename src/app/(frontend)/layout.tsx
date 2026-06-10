import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'

export const metadata: Metadata = {
  title: { default: 'Myra Global Exports', template: '%s | Myra Global Exports' },
  description: 'Premium agricultural export company. Connecting the World. Empowering Futures.',
  keywords: ['agricultural exports', 'India export', 'Myra Global', 'food export'],
}

async function getSiteSettings() {
  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    return await payload.findGlobal({ slug: 'site-settings' })
  } catch {
    return null
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer
        contact={settings?.contact}
        social={settings?.social}
        sections={settings?.sections}
      />
      <WhatsAppButton phone={settings?.contact?.whatsapp ?? '+919999999999'} />
    </div>
  )
}

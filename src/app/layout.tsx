import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myraglobalexports.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Myra Global Exports', template: '%s | Myra Global Exports' },
  description:
    'Myra Global Exports — premium agricultural commodities from India. We export fresh vegetables, fruits, spices, grains, and pulses to 30+ countries. APEDA-registered, FSSAI-compliant.',
  keywords: [
    'agricultural exports India',
    'India agri export company',
    'spices export India',
    'fresh vegetables export India',
    'grains pulses export',
    'Myra Global Exports',
  ],
  openGraph: {
    siteName: 'Myra Global Exports',
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    title: 'Myra Global Exports — Premium Agricultural Commodities from India',
    description:
      'Premium agricultural commodities from India. Fresh vegetables, fruits, spices, grains, and pulses exported to 30+ countries.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Myra Global Exports',
    description: 'Premium agricultural commodities from India exported to 30+ countries.',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${fraunces.variable}`}>
      <body className="font-sans bg-cream">
        {children}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
          process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID !== 'undefined' && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                var gaId = '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}';
                if (gaId && gaId !== 'undefined') { gtag('config', gaId); }
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}

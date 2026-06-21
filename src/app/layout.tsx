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

export const metadata: Metadata = {
  title: { default: 'Myra Global Exports', template: '%s | Myra Global Exports' },
  description: 'Premium agricultural export company. Connecting the World. Empowering Futures.',
  keywords: ['agricultural exports', 'India export', 'Myra Global', 'food export'],
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

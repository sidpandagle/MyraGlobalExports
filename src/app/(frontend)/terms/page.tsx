import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms & Conditions' }

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 font-heading text-4xl font-bold text-brand-green">
        Terms &amp; Conditions
      </h1>
      <div className="prose prose-lg max-w-none">
        <p>
          <strong>Effective Date:</strong> June 2025
        </p>
        <p>
          By using the Myra Global Exports website (myraglobalexports.com), you agree to these
          terms.
        </p>

        <h2>Use of Website</h2>
        <p>
          This website is for informational purposes and to facilitate business inquiries. You may
          not use the site for any unlawful purpose.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website — including text, images, logos, and design — is the
          property of Myra Global Exports and is protected by copyright law.
        </p>

        <h2>Inquiries &amp; Quotes</h2>
        <p>
          Submitting an inquiry form does not constitute a binding contract. All quotes are subject
          to separate written agreement.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          Myra Global Exports is not liable for any indirect or consequential damages arising from
          use of this website.
        </p>

        <h2>Contact</h2>
        <p>
          For questions:{' '}
          <a href="mailto:info@myraglobalexports.com">info@myraglobalexports.com</a>
        </p>
      </div>
    </div>
  )
}

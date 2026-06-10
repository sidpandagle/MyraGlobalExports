import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 font-heading text-4xl font-bold text-brand-green">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          <strong>Effective Date:</strong> June 2025
        </p>
        <p>
          Myra Global Exports (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is
          committed to protecting your personal information. This policy explains how we collect,
          use, and safeguard your data when you use our website at myraglobalexports.com.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>
            Contact details (name, email, phone, company) provided through inquiry and contact
            forms
          </li>
          <li>Usage data collected automatically through Google Analytics (anonymised)</li>
          <li>Cookies for website functionality and analytics</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to your inquiries and send you quotes</li>
          <li>To improve our website and services</li>
          <li>To send relevant business communications (with your consent)</li>
        </ul>

        <h2>Data Sharing</h2>
        <p>
          We do not sell or rent your personal data to third parties. We may share data with
          trusted service providers (email services, analytics) necessary to operate our website.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction, or deletion of your personal data by contacting
          us at{' '}
          <a href="mailto:info@myraglobalexports.com">info@myraglobalexports.com</a>.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy concerns:{' '}
          <a href="mailto:info@myraglobalexports.com">info@myraglobalexports.com</a>
        </p>
      </div>
    </div>
  )
}

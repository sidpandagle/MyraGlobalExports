import type { Metadata } from 'next'
import { InquiryForm } from '@/components/forms/InquiryForm'

export const metadata: Metadata = {
  title: 'Get a Quote',
  description: 'Request a competitive export quote from Myra Global Exports.',
}

export default function GetQuotePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-heading text-4xl font-bold text-brand-green">
          Request a Quote
        </h1>
        <p className="text-gray-500">
          Fill in the form below and we&apos;ll send you a competitive quote within 24 hours.
        </p>
      </div>
      <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <InquiryForm />
      </div>
    </div>
  )
}

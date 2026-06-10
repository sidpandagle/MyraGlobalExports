import Link from 'next/link'

export function InquirySection() {
  return (
    <section className="bg-brand-green py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-3 font-heading text-3xl font-bold">Ready to Place an Order?</h2>
        <p className="mb-8 text-green-100">
          Fill out our inquiry form and our export specialists will get back to you within 24 hours.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/get-quote"
            className="rounded-full bg-brand-gold px-8 py-3 font-semibold text-gray-900 transition-colors hover:bg-brand-gold-light"
          >
            Get a Quote
          </Link>
          <Link
            href="/contact"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-brand-green"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

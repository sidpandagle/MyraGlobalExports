const TERMS = [
  {
    code: 'TT',
    title: 'Telegraphic Transfer',
    desc: 'Direct bank-to-bank wire transfer — the fastest and most common method for international trade payments.',
  },
  {
    code: 'LC',
    title: 'Letter of Credit',
    desc: "A bank-backed guarantee of payment, issued by the buyer's bank in favor of Myra Global, released on shipment terms.",
  },
]

export function PaymentTerms() {
  return (
    <section className="py-24 bg-white border-y border-fog">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">
                Trade Terms
              </p>
            </div>
            <h2
              className="font-heading font-light text-brand-green leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)' }}
            >
              Payment<br />
              <em className="italic">Terms</em>
            </h2>
            <p className="text-bark/55 font-sans text-sm leading-relaxed">
              Payment terms are finalized based on mutual agreement and international trade
              standards. Buyers are welcome to discuss their preferred payment method while
              requesting a quotation.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-px bg-fog">
            {TERMS.map(({ code, title, desc }) => (
              <div
                key={code}
                className="bg-white p-8 hover:bg-cream transition-colors duration-200 group"
              >
                <p className="font-heading text-[3rem] font-light text-brand-gold/25 leading-none mb-5 group-hover:text-brand-gold/45 transition-colors duration-200">
                  {code}
                </p>
                <h3 className="font-heading text-xl font-semibold text-brand-green mb-2.5">
                  {title}
                </h3>
                <p className="text-bark/55 text-[14px] font-sans leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

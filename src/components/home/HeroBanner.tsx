import Link from 'next/link'

export function HeroBanner() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-brand-green to-brand-green-dark text-white">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjMiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiLz48L2c+PC9zdmc+')]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-gold">
          Premium Agricultural Exports from India
        </p>
        <h1 className="mb-4 font-heading text-4xl font-bold leading-tight md:text-6xl">
          Connecting the World.
          <br />
          <span className="text-brand-gold">Empowering Futures.</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-green-100">
          Myra Global Exports delivers high-quality agricultural products to buyers across the globe.
          Trusted quality. Reliable supply. International standards.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/get-quote"
            className="rounded-full bg-brand-gold px-8 py-3 font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
          >
            Get a Quote
          </Link>
          <Link
            href="/products"
            className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-brand-green"
          >
            View Products
          </Link>
        </div>
      </div>
    </section>
  )
}

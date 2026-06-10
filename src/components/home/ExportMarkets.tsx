const COUNTRIES = [
  { flag: '🇦🇪', name: 'UAE' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇬🇧', name: 'UK' },
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇨🇳', name: 'China' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇧🇩', name: 'Bangladesh' },
  { flag: '🇲🇾', name: 'Malaysia' },
  { flag: '🇮🇩', name: 'Indonesia' },
  { flag: '🇸🇬', name: 'Singapore' },
  { flag: '🇿🇦', name: 'South Africa' },
]

export function ExportMarkets() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-brand-green">
          Our Export Markets
        </h2>
        <p className="mb-10 text-center text-gray-500">
          Trusted by buyers across 30+ countries
        </p>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {COUNTRIES.map(({ flag, name }) => (
            <div
              key={name}
              className="flex flex-col items-center rounded-lg border p-4 text-center transition-shadow hover:shadow-md"
            >
              <span className="mb-2 text-3xl" aria-hidden="true">
                {flag}
              </span>
              <span className="text-xs font-medium text-gray-700">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

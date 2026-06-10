const REASONS = [
  {
    icon: '🌾',
    title: 'Premium Quality',
    desc: 'Strictly selected produce meeting international food safety standards.',
  },
  {
    icon: '🚢',
    title: 'Global Reach',
    desc: 'Export to 30+ countries across Asia, Middle East, Europe, and Africa.',
  },
  {
    icon: '📜',
    title: 'Certified & Compliant',
    desc: 'GST, IEC, APEDA, and FSSAI certified operations.',
  },
  {
    icon: '⏱️',
    title: 'On-Time Delivery',
    desc: 'Reliable logistics partners ensuring timely shipments worldwide.',
  },
  {
    icon: '💬',
    title: 'Dedicated Support',
    desc: 'Responsive team for every step from inquiry to delivery.',
  },
  {
    icon: '📦',
    title: 'Custom Packaging',
    desc: 'Flexible packaging options tailored to buyer requirements.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-brand-green">
          Why Choose Myra Global?
        </h2>
        <p className="mb-10 text-center text-gray-500">
          Your trusted partner for agricultural exports from India
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 text-3xl" aria-hidden="true">
                {icon}
              </div>
              <h3 className="mb-2 font-semibold text-brand-green">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

type ContactData = {
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  businessHours?: string | null
}

type Props = { contact: ContactData }

type ContactItem = {
  icon: string
  label: string
  value: string | null | undefined
  href?: string
}

export function ContactInfoSection({ contact }: Props) {
  const items: ContactItem[] = [
    {
      icon: '📞',
      label: 'Phone',
      value: contact.phone,
      href: contact.phone ? `tel:${contact.phone}` : undefined,
    },
    {
      icon: '💬',
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: contact.whatsapp
        ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`
        : undefined,
    },
    {
      icon: '✉️',
      label: 'Email',
      value: contact.email,
      href: contact.email ? `mailto:${contact.email}` : undefined,
    },
    {
      icon: '🕐',
      label: 'Business Hours',
      value: contact.businessHours,
    },
  ].filter((i): i is ContactItem & { value: string } => Boolean(i.value))

  if (items.length === 0) return null

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-brand-green">
          Get in Touch
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon, label, value, href }) => (
            <div key={label} className="rounded-xl bg-white p-6 text-center shadow-sm">
              <div className="mb-2 text-3xl" aria-hidden="true">
                {icon}
              </div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
              </p>
              {href ? (
                <a href={href} className="text-sm font-medium text-brand-green hover:underline">
                  {value}
                </a>
              ) : (
                <p className="text-sm font-medium text-gray-800">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

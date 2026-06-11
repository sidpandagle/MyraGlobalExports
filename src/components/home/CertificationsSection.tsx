import Image from 'next/image'

type CertImage = {
  url?: string | null
  alt?: string | null
}

type Certificate = {
  id: string
  title: string
  certificateNumber?: string | null
  image?: CertImage | null
}

type Props = { certificates: Certificate[] }

const MOCK_CERTS: Certificate[] = [
  { id: 'c1', title: 'APEDA', certificateNumber: 'Agri & Processed Food Export' },
  { id: 'c2', title: 'FSSAI', certificateNumber: 'Food Safety Standards Authority' },
  { id: 'c3', title: 'IEC', certificateNumber: 'Import Export Code' },
  { id: 'c4', title: 'GST', certificateNumber: 'Goods & Services Tax Reg.' },
]

export function CertificationsSection({ certificates }: Props) {
  const displayCerts = certificates.length > 0 ? certificates : MOCK_CERTS

  return (
    <section className="py-24 bg-white border-y border-fog">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          {/* Label */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="block h-px w-10 bg-brand-gold shrink-0" />
              <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-stone">
                Compliance
              </p>
            </div>
            <h2
              className="font-heading font-light text-brand-green leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Certified &amp;<br />
              <em className="italic">Compliant</em>
            </h2>
            <p className="text-bark/55 font-sans text-sm leading-relaxed">
              All operations meet international quality and food safety standards.
            </p>
          </div>

          {/* Cert cards */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-px bg-fog">
            {displayCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-white p-7 flex flex-col items-center text-center hover:bg-cream transition-colors"
              >
                {cert.image?.url ? (
                  <Image
                    src={cert.image.url}
                    alt={cert.image.alt ?? cert.title}
                    width={72}
                    height={72}
                    className="mb-4 object-contain"
                  />
                ) : (
                  <div
                    className="mb-4 flex h-14 w-14 items-center justify-center bg-brand-green/8 border border-fog"
                    aria-hidden="true"
                  >
                    <span className="font-heading text-lg font-bold text-brand-green">
                      {cert.title.slice(0, 2)}
                    </span>
                  </div>
                )}
                <p className="font-heading text-base font-semibold text-brand-green">{cert.title}</p>
                {cert.certificateNumber && (
                  <p className="mt-1 text-[11px] font-sans text-stone leading-tight">
                    {cert.certificateNumber}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

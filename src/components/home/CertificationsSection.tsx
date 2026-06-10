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

export function CertificationsSection({ certificates }: Props) {
  if (certificates.length === 0) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-heading text-3xl font-bold text-brand-green">
          Certifications
        </h2>
        <p className="mb-10 text-center text-gray-500">
          Compliant with international quality and food safety standards
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex w-40 flex-col items-center rounded-xl border p-6 text-center shadow-sm"
            >
              {cert.image?.url ? (
                <Image
                  src={cert.image.url}
                  alt={cert.image.alt ?? cert.title}
                  width={80}
                  height={80}
                  className="mb-3 object-contain"
                />
              ) : (
                <div className="mb-3 text-4xl" aria-hidden="true">📜</div>
              )}
              <p className="text-xs font-semibold text-gray-700">{cert.title}</p>
              {cert.certificateNumber && (
                <p className="mt-1 text-xs text-gray-400">{cert.certificateNumber}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

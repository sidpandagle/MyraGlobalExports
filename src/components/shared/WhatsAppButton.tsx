import { FaWhatsapp } from 'react-icons/fa'

type Props = { phone: string }

export function WhatsAppButton({ phone }: Props) {
  const clean = phone.replace(/\D/g, '')
  return (
    <a
      href={`https://wa.me/${clean}?text=Hello%2C%20I%20am%20interested%20in%20your%20products.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
    >
      <FaWhatsapp size={28} color="white" />
    </a>
  )
}

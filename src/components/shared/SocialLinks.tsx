import { FaWhatsapp, FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa'

type SocialData = {
  whatsapp?: string | null
  instagram?: string | null
  facebook?: string | null
  linkedin?: string | null
  youtube?: string | null
}

type Props = {
  social: SocialData
  className?: string
  iconSize?: number
}

export function SocialLinks({ social, className = '', iconSize = 20 }: Props) {
  const links = [
    { href: social?.whatsapp, Icon: FaWhatsapp, label: 'WhatsApp', color: '#25D366' },
    { href: social?.instagram, Icon: FaInstagram, label: 'Instagram', color: '#E1306C' },
    { href: social?.facebook, Icon: FaFacebook, label: 'Facebook', color: '#1877F2' },
    { href: social?.linkedin, Icon: FaLinkedin, label: 'LinkedIn', color: '#0A66C2' },
    { href: social?.youtube, Icon: FaYoutube, label: 'YouTube', color: '#FF0000' },
  ].filter((l) => l.href)

  return (
    <div className={`flex gap-3 ${className}`}>
      {links.map(({ href, Icon, label, color }) => (
        <a
          key={label}
          href={href!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="transition-transform hover:scale-110"
          style={{ color }}
        >
          <Icon size={iconSize} />
        </a>
      ))}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { FaWhatsapp, FaFacebook, FaLinkedin, FaEnvelope, FaLink } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

type Props = {
  url: string
  title: string
  className?: string
  iconSize?: number
}

export function ShareButtons({ url, title, className = '', iconSize = 16 }: Props) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    { href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, Icon: FaWhatsapp, label: 'Share on WhatsApp', color: '#25D366' },
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, Icon: FaFacebook, label: 'Share on Facebook', color: '#1877F2' },
    { href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, Icon: FaLinkedin, label: 'Share on LinkedIn', color: '#0A66C2' },
    { href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, Icon: FaXTwitter, label: 'Share on X', color: '#000000' },
    { href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, Icon: FaEnvelope, label: 'Share via Email', color: '#6B5A45' },
  ]

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map(({ href, Icon, label, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="transition-transform hover:scale-110"
          style={{ color }}
        >
          <Icon size={iconSize} />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex items-center gap-1.5 transition-transform hover:scale-110 text-stone"
      >
        <FaLink size={iconSize} />
        {copied && <span className="text-[11px] font-sans">Copied!</span>}
      </button>
    </div>
  )
}

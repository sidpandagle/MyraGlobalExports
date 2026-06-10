type Props = { href: string; label: string; className?: string }

export function PDFDownloadButton({ href, label, className = '' }: Props) {
  return (
    <a
      href={href}
      download
      className={`inline-flex items-center gap-2 rounded-full border-2 border-brand-green px-6 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white ${className}`}
    >
      📄 {label}
    </a>
  )
}

'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/partners', label: 'Partners' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-fog shadow-[0_1px_12px_rgba(61,43,26,0.06)]'
          : 'bg-cream border-fog/60'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center bg-brand-green shrink-0">
            <span className="font-heading text-sm font-bold text-white tracking-wider">MG</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-xl font-semibold text-brand-green tracking-tight">
              Myra Global
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-stone font-sans mt-0.5">
              Exports
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-3 py-2 text-[11.5px] font-sans font-medium uppercase tracking-[0.12em] text-bark/55 transition-colors hover:text-brand-green group"
            >
              {label}
              <span className="absolute bottom-1 left-3 right-3 h-px bg-brand-gold origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
          <Link
            href="/get-quote"
            className="ml-4 bg-brand-green px-5 py-2.5 text-[11.5px] font-sans font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-brand-gold"
          >
            Get Quote
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-1 text-bark/70"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-fog/60 bg-cream px-6 pb-6 lg:hidden">
          <div className="flex flex-col pt-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="border-b border-fog/40 py-3 text-[11px] font-sans font-medium uppercase tracking-[0.15em] text-bark/60 hover:text-brand-green transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/get-quote"
              className="mt-5 bg-brand-green py-3 text-center text-[11px] font-sans font-semibold uppercase tracking-[0.15em] text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

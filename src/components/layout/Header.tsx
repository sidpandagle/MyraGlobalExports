'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/products', label: 'Products' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/partners', label: 'Partners' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact Us' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-xl font-bold text-white">
            MG
          </div>
          <div>
            <p className="text-xl font-bold text-brand-green">Myra Global</p>
            <p className="text-xs text-gray-500">Connecting the World. Empowering Futures.</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-green"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/get-quote"
            className="rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-green-light"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-white px-4 pb-4 lg:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block py-2 text-sm font-medium text-gray-700 hover:text-brand-green"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/get-quote"
            className="mt-3 block rounded-full bg-brand-green px-5 py-2 text-center text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            Get a Quote
          </Link>
        </div>
      )}
    </header>
  )
}
